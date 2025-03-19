import RealmTransaction from "@models/realm/RealmTransaction";
import Realm, { UpdateMode } from "realm";
import type { Transaction } from "types/Transaction";
import type { TransactionRepository } from "types/TransactionRepository";

export default class RealmTransactionRepository
  implements TransactionRepository
{
  private realm: Realm;
  private listener: Realm.Results<
    Realm.Object<RealmTransaction, never> & RealmTransaction
  > | null = null;

  constructor() {
    this.realm = new Realm({ schema: [RealmTransaction], schemaVersion: 1 });
  }

  getLiveTransactions(callback: (expenses: Transaction[]) => void): void {
    const realmObjects = this.realm.objects<RealmTransaction>("Transaction");

    this.listener = realmObjects;

    realmObjects.addListener((collection) => {
      // map to JSON and then parse to avoid Realm.Object
      const json = collection.toJSON();
      const parsed = JSON.parse(JSON.stringify(json));
      const transactions: Transaction[] = parsed.map(
        (transaction: Transaction) => {
          return {
            ...transaction,
            date: new Date(transaction.date),
          };
        },
      );
      // Notify UI of changes
      callback(transactions);
    });
  }

  stopListening(): void {
    if (this.listener) {
      this.listener.removeAllListeners();
      this.listener = null;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    const realmObj = this.realm.objects<RealmTransaction>("Transaction");
    const json = realmObj.toJSON();
    const parsed = JSON.parse(JSON.stringify(json));
    const transactions: Transaction[] = parsed.map(
      (transaction: Transaction) => {
        return {
          ...transaction,
          date: new Date(transaction.date),
        };
      },
    );
    return transactions;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const realmObj = this.realm.objectForPrimaryKey<RealmTransaction>(
      "Transaction",
      id,
    );
    if (!realmObj) {
      return null;
    }
    const json = realmObj.toJSON();
    const parsed = JSON.parse(JSON.stringify(json));
    const mapped: Transaction = {
      ...parsed,
      date: new Date(parsed.date),
    };
    return mapped;
  }

  async addTransaction(expense: Transaction): Promise<void> {
    this.realm.write(() => {
      this.realm.create<RealmTransaction>("Transaction", expense);
    });
  }

  async updateTransaction(expense: Transaction): Promise<void> {
    this.realm.write(() => {
      this.realm.create<RealmTransaction>(
        "Transaction",
        expense,
        UpdateMode.All,
      );
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    this.realm.write(() => {
      const expense = this.realm.objectForPrimaryKey<RealmTransaction>(
        "Transaction",
        id,
      );
      if (expense) {
        this.realm.delete(expense);
      }
    });
  }

  async getUnsyncedTransactions(): Promise<Transaction[]> {
    const realmObj = this.realm
      .objects<RealmTransaction>("Transaction")
      .filtered("syncStatus != 'synced'")
      .toJSON();
    return JSON.parse(JSON.stringify(realmObj));
  }

  async markAsSynced(id: string): Promise<void> {
    this.realm.write(() => {
      const expense = this.realm.objectForPrimaryKey<RealmTransaction>(
        "Transaction",
        id,
      );
      if (expense) {
        this.realm.create(
          "Transaction",
          {
            ...expense,
            syncStatus: "synced",
          },
          UpdateMode.All,
        );
      }
    });
  }
}
