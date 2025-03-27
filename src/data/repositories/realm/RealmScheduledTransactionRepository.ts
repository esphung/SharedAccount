import { realmSchema, realmSchemaVerison } from "@config/realmSchema";
import ScheduledTransactionAdapter from "@data/adapters/ScheduledTransactionAdapter";
import type RealmScheduledTransaction from "@data/models/realm/RealmScheduledTransaction";
import type { ScheduledTransaction } from "@data/models/types/ScheduledTransaction";
import type { RealmSubscription } from "@data/repositories/realm/types/RealmSubscription";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import Realm, { UpdateMode } from "realm";

export default class RealmScheduledTransactionRepository implements DataModelRepository<ScheduledTransaction> {
  private realm: Realm;
  private subscription: RealmSubscription<RealmScheduledTransaction> | null = null;

  constructor() {
    this.realm = new Realm({
      schema: realmSchema,
      schemaVersion: realmSchemaVerison,
    });
  }

  getLiveData(callback: (expenses: ScheduledTransaction[]) => void): void {
    const realmObjects = this.realm.objects<RealmScheduledTransaction>("ScheduledTransaction");

    this.subscription = realmObjects;

    realmObjects.addListener((collection) => {
      // map to JSON and then parse to avoid Realm.Object
      const transactions: ScheduledTransaction[] = collection.map(ScheduledTransactionAdapter.localToState);
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

  async getAll(): Promise<ScheduledTransaction[]> {
    const realmObjs = this.realm.objects<RealmScheduledTransaction>("ScheduledTransaction");
    const mapped = realmObjs.map(ScheduledTransactionAdapter.localToState);
    return mapped;
  }

  async getById(id: string): Promise<ScheduledTransaction | null> {
    const realmObj = this.realm.objectForPrimaryKey<RealmScheduledTransaction>("ScheduledTransaction", id);
    if (!realmObj) {
      console.warn(`[RealmScheduledTransactionRepository] ScheduledTransaction not found: ${id}`);
      return null;
    }
    const mapped: ScheduledTransaction = ScheduledTransactionAdapter.localToState(realmObj);
    return mapped;
  }

  async add(expense: ScheduledTransaction): Promise<void> {
    this.realm.write(() => {
      this.realm.create<RealmScheduledTransaction>("ScheduledTransaction", expense);
    });
  }

  async update(expense: ScheduledTransaction): Promise<void> {
    this.realm.write(() => {
      this.realm.create<RealmScheduledTransaction>("ScheduledTransaction", expense, UpdateMode.All);
    });
  }

  async delete(id: string): Promise<void> {
    this.realm.write(() => {
      const expense = this.realm.objectForPrimaryKey<RealmScheduledTransaction>("ScheduledTransaction", id);
      if (expense) {
        this.realm.delete(expense);
      }
    });
  }

  async getUnsynced(): Promise<ScheduledTransaction[]> {
    const realmObjs = this.realm
      .objects<RealmScheduledTransaction>("ScheduledTransaction")
      .filtered("syncStatus != 'synced'");
    const mapped = realmObjs.map(ScheduledTransactionAdapter.localToState);
    return mapped;
  }

  async markAsSynced(id: string): Promise<void> {
    this.realm.write(() => {
      const expense = this.realm.objectForPrimaryKey<RealmScheduledTransaction>("ScheduledTransaction", id);
      if (expense) {
        this.realm.create(
          "ScheduledTransaction",
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
