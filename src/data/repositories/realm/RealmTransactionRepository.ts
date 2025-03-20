import { realmSchema, realmSchemaVerison } from "@config/realmSchema";
import TransactionAdapter from "@data/adapters/TransactionAdapter";
import type RealmTransaction from "@data/models/realm/RealmTransaction";
import type { RealmSubscription } from "@data/repositories/realm/types/RealmSubscription";
import Realm, { UpdateMode } from "realm";
import type { Transaction } from "types/Transaction";
import type { TransactionRepository } from "types/TransactionRepository";

export default class RealmTransactionRepository
  implements TransactionRepository
{
  private realm: Realm;
  private subscription: RealmSubscription<RealmTransaction> | null = null;

  constructor() {
    this.realm = new Realm({
      schema: realmSchema,
      schemaVersion: realmSchemaVerison,
    });
  }

  getLiveTransactions(callback: (expenses: Transaction[]) => void): void {
    const realmObjects = this.realm.objects<RealmTransaction>("Transaction");

    this.subscription = realmObjects;

    realmObjects.addListener((collection) => {
      // map to JSON and then parse to avoid Realm.Object
      const json = collection.toJSON();
      const parsed = JSON.parse(JSON.stringify(json));
      const transactions: Transaction[] = parsed.map(
        TransactionAdapter.localToState,
      );
      // Notify UI of changes
      callback(transactions);
    });
  }

  stopListening(): void {
    if (this.subscription) {
      this.subscription.removeAllListeners();
      this.subscription = null;
    }
  }

  async getTransactions(): Promise<Transaction[]> {
    const realmObjs = this.realm.objects<RealmTransaction>("Transaction");
    const mapped = realmObjs.map(TransactionAdapter.localToState);
    return mapped;
  }

  async getTransactionById(id: string): Promise<Transaction | null> {
    const realmObj = this.realm.objectForPrimaryKey<RealmTransaction>(
      "Transaction",
      id,
    );
    if (!realmObj) {
      console.warn(`[RealmTransactionRepository] Transaction not found: ${id}`);
      return null;
    }
    const mapped: Transaction = TransactionAdapter.localToState(realmObj);
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
    const realmObjs = this.realm
      .objects<RealmTransaction>("Transaction")
      .filtered("syncStatus != 'synced'");
    const mapped = realmObjs.map(TransactionAdapter.localToState);
    return mapped;
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
