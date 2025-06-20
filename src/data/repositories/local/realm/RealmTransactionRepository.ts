import { realmSchema, realmSchemaVersion } from "@config/realmSchema";
import TransactionAdapter from "@data/adapters/TransactionAdapter";
import type RealmTransaction from "@data/models/realm/RealmTransaction";
import type { Transaction } from "@data/models/types/Transaction";
import AbstractLocalRepository from "@data/repositories/local/AbstractLocalRepository";
import type { RealmSubscription } from "@data/repositories/local/realm/types/RealmSubscription";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import Realm, { UpdateMode } from "realm";

export default class RealmTransactionRepository
	extends AbstractLocalRepository<Transaction>
	implements DataModelRepository<Transaction, "local">
{
	private realm: Realm;
	private subscription: RealmSubscription<RealmTransaction> | null = null;

	constructor() {
		super();
		this.realm = new Realm({
			schema: realmSchema,
			schemaVersion: realmSchemaVersion,
		});
	}

	getLiveData(callback: (expenses: Transaction[]) => void): void {
		const realmObjects = this.realm.objects<RealmTransaction>("Transaction");

		this.subscription = realmObjects;

		realmObjects.addListener((collection) => {
			const transactions: Transaction[] = collection.map(TransactionAdapter.localToState);
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

	async getAll(): Promise<Transaction[]> {
		const realmObjs = this.realm.objects<RealmTransaction>("Transaction");
		const mapped = realmObjs.map(TransactionAdapter.localToState);
		return mapped;
	}

	async getById(id: string): Promise<Transaction | null> {
		const realmObj = this.realm.objectForPrimaryKey<RealmTransaction>("Transaction", id);
		if (!realmObj) {
			return null;
		}
		const mapped: Transaction = TransactionAdapter.localToState(realmObj);
		return mapped;
	}

	async add(expense: Transaction): Promise<void> {
		this.realm.write(() => {
			this.realm.create<RealmTransaction>("Transaction", expense);
		});
	}

	async update(expense: Transaction): Promise<void> {
		this.realm.write(() => {
			this.realm.create<RealmTransaction>("Transaction", expense, UpdateMode.All);
		});
	}

	async delete(id: string): Promise<void> {
		this.realm.write(() => {
			const expense = this.realm.objectForPrimaryKey<RealmTransaction>("Transaction", id);
			if (expense) {
				this.realm.delete(expense);
			}
		});
	}

	async getUnsynced(): Promise<Transaction[]> {
		const realmObjs = this.realm
			.objects<RealmTransaction>("Transaction")
			.filtered("syncStatus != 'synced'");
		const mapped = realmObjs.map(TransactionAdapter.localToState);
		return mapped;
	}

	async markAsSynced(id: string): Promise<void> {
		this.realm.write(() => {
			const expense = this.realm.objectForPrimaryKey<RealmTransaction>("Transaction", id);
			if (expense) {
				this.realm.create(
					"Transaction",
					{
						...expense,
						syncStatus: "synced",
					},
					UpdateMode.All
				);
			}
		});
	}

	getType(): "local" {
		return "local";
	}

	getName(): string {
		return "RealmTransactionRepository";
	}
}
