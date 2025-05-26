import BaseBuilder from "@data/models/builders/BaseBuilder";

import type {Account} from "@data/models/types/Account";

export default class AccountBuilder extends BaseBuilder<Account> {
	constructor(initialInstance?: Partial<Account>, fakerSeed?: number) {
		const result: Account = {
			id: `acct_${new Date().getTime()}`,
			startingBalance: 99999, // in cents
			name: "Hello World",
			transactions: [],
			...initialInstance,
		};
		super(result, fakerSeed);
	}

	withId(id: `acct_${string}`): AccountBuilder {
		this.instance.id = id;
		return this;
	}

	withStartingBalance(startingBalance: number): AccountBuilder {
		this.instance.startingBalance = startingBalance;
		return this;
	}

	withName(name: string): AccountBuilder {
		this.instance.name = name;
		return this;
	}

	withTransactions(transactions: Account["transactions"]): AccountBuilder {
		const updated = transactions.map((transaction) => ({
			...transaction,
			sharedAccountId: this.instance.id,
		}));
		this.instance.transactions = updated;
		return this;
	}

	build(): Account {
		return this.instance;
	}
}
