import BaseBuilder from "@data/models/builders/BaseBuilder";

import type { Account } from "@data/models/types/Account";

export default class AccountBuilder extends BaseBuilder<Account> {
	constructor(initialInstance?: Partial<Account>, fakerSeed?: number) {
		const result: Account = {
			id: `acct_${new Date().getTime()}`,
			startingBalance: 0, // in cents
			name: "Hello World",
			version: 0,
			...initialInstance,
		};
		super(result, fakerSeed);
	}

	withId(id: string): AccountBuilder {
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

	withVersion(version: number): AccountBuilder {
		this.instance.version = version;
		return this;
	}

	build(): Account {
		return this.instance;
	}
}
