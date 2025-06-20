import BaseBuilder from "@data/models/builders/BaseBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import UserBuilder from "@data/models/builders/UserBuilder";

import type { Transaction } from "@data/models/types/Transaction";
import type { User } from "@data/models/types/User";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";

type LocalDatabase = {
	users: User[];
	transactions: Transaction[];
};

export default class LocalDatabaseBuilder extends BaseBuilder<LocalDatabase> {
	constructor() {
		const fakeSharedAccountId: `acct_${string}` = `acct_${faker.database.mongodbObjectId()}`;
		const fakeUserId1: `usr_${string}` = `usr_${faker.database.mongodbObjectId()}`;
		const fakeUserId2: `usr_${string}` = `usr_${faker.database.mongodbObjectId()}`;

		// For adding userIds to transactions
		const users: User[] = [
			new UserBuilder().withId(fakeUserId1).build(),
			new UserBuilder().withId(fakeUserId2).build(),
		];

		const transactions: Transaction[] = [
			...Array.from({ length: 30 }, (_, i) => {
				const fakeUserId: `usr_${string}` = `usr_${faker.helpers.arrayElement(users).id.replace("usr_", "")}`;
				return new TransactionBuilder()
					.withId(`txn_${faker.database.mongodbObjectId()}`)
					.withType(faker.helpers.arrayElement(["credit", "expense"]))
					.withSharedAccountId(fakeSharedAccountId)
					.withDate(DateTime.now().minus({ days: i }).toJSDate())
					.withUserId(fakeUserId)
					.build();
			}),
		];
		const initial: LocalDatabase = {
			users,
			transactions,
		};
		super(initial);
	}
}
