import {realmSchema, realmSchemaVersion} from "@config/realmSchema";
import AccountAdapter from "@data/adapters/AccountAdapter";
import type RealmAccount from "@data/models/realm/RealmAccount";
import type {Account} from "@data/models/types/Account";
import type {RealmSubscription} from "@data/repositories/realm/types/RealmSubscription";
import type {DataModelRepository} from "@data/types/DataModelRepository";
import Realm, {UpdateMode} from "realm";

export default class RealmAccountRepository implements DataModelRepository<Account> {
	private realm: Realm;
	private subscription: RealmSubscription<RealmAccount> | null = null;

	constructor() {
		this.realm = new Realm({
			schema: realmSchema,
			schemaVersion: realmSchemaVersion,
		});
	}

	getLiveData(callback: (_: Account[]) => void): void {
		const realmObjects = this.realm.objects<RealmAccount>("Account");

		this.subscription = realmObjects;

		realmObjects.addListener((collection) => {
			const accounts: Account[] = collection.map(AccountAdapter.localToState);
			// Notify UI of changes
			callback(accounts);
		});
	}

	stopListening(): void {
		if (this.subscription) {
			this.subscription.removeAllListeners();
			this.subscription = null;
		}
	}

	async getAll(): Promise<Account[]> {
		const realmObjs = this.realm.objects<RealmAccount>("Account");
		const mapped = realmObjs.map(AccountAdapter.localToState);
		return mapped;
	}

	async getById(id: string): Promise<Account | null> {
		const realmObj = this.realm.objectForPrimaryKey<RealmAccount>("Account", id);
		if (!realmObj) {
			console.warn(`[RealmAccountRepository] Account not found: ${id}`);
			return null;
		}
		const mapped: Account = AccountAdapter.localToState(realmObj);
		return mapped;
	}

	async add(account: Account): Promise<void> {
		this.realm.write(() => {
			this.realm.create<RealmAccount>("Account", account);
		});
	}

	async update(account: Account): Promise<void> {
		this.realm.write(() => {
			this.realm.create<RealmAccount>("Account", account, UpdateMode.All);
		});
	}

	async delete(id: string): Promise<void> {
		this.realm.write(() => {
			const account = this.realm.objectForPrimaryKey<RealmAccount>("Account", id);
			if (account) {
				this.realm.delete(account);
			}
		});
	}

	async getUnsynced(): Promise<Account[]> {
		const realmObjs = this.realm.objects<RealmAccount>("Account").filtered("syncStatus != 'synced'");
		const mapped = realmObjs.map(AccountAdapter.localToState);
		return mapped;
	}

	async markAsSynced(id: string): Promise<void> {
		this.realm.write(() => {
			const account = this.realm.objectForPrimaryKey<RealmAccount>("Account", id);
			if (account) {
				this.realm.create(
					"Account",
					{
						...account,
						syncStatus: "synced",
					},
					UpdateMode.All,
				);
			}
		});
	}
}
