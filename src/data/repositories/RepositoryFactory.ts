import type {Transaction} from "@data/models/types/Transaction";
import RealmAccountRepository from "@data/repositories/realm/RealmAccountRepository";
import RealmTransactionRepository from "@data/repositories/realm/RealmTransactionRepository";
import RemoteAccountRepository from "@data/repositories/remote/RemoteAccountRepository";
import type {DataModelRepository} from "@data/types/DataModelRepository";
import type {Account} from "types/Account";

export default class RepositoryFactory {
	static createTransactionRepository(): DataModelRepository<Transaction> {
		return new RealmTransactionRepository(); // Change here if switching databases
	}
	static createAccountRepository(): DataModelRepository<Account> {
		return new RealmAccountRepository(); // Change here if switching databases
	}
	static createRemoteAccountRepository(): DataModelRepository<Account> {
		return new RemoteAccountRepository();
	}
}
