import AccountAdapter from "@data/adapters/AccountAdapter";
import TransactionAdapter from "@data/adapters/TransactionAdapter";
import { remoteAccountApi, remoteTransactionsApi } from "@data/api/backend";
import type { Transaction } from "@data/models/types/Transaction";
import RealmAccountRepository from "@data/repositories/local/realm/RealmAccountRepository";
import RealmTransactionRepository from "@data/repositories/local/realm/RealmTransactionRepository";
import RemoteRepository from "@data/repositories/remote/RemoteRepository";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import type { Account } from "types/Account";

export default class RepositoryFactory {
	static createTransactionRepository(): DataModelRepository<Transaction, "local"> {
		return new RealmTransactionRepository();
	}

	static createAccountRepository(): DataModelRepository<Account, "local"> {
		return new RealmAccountRepository();
	}

	static createRemoteAccountRepository(
		getToken: () => string | null
	): DataModelRepository<Account, "remote"> {
		return new RemoteRepository(remoteAccountApi, "/accounts", AccountAdapter, getToken);
	}

	static createRemoteTransactionRepository(
		getToken: () => string | null
	): DataModelRepository<Transaction, "remote"> {
		return new RemoteRepository(
			remoteTransactionsApi,
			"/transactions",
			TransactionAdapter,
			getToken
		);
	}
}
