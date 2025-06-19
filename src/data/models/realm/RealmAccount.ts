import type { Account } from "@data/models/types/Account";
import type { Transaction } from "@data/models/types/Transaction";
import { Realm } from "@realm/react";

export default class RealmAccount extends Realm.Object implements Account {
	id: `acct_${string}` = `acct_${Math.random().toString(36).substr(2, 9)}`;
	name: string = "";
	startingBalance: number = 0; // kept in cents
	transactions: Transaction[] = [];
	version: number = 0;

	static schema = {
		name: "Account",
		primaryKey: "id",
		properties: {
			id: "string",
			name: "string",
			startingBalance: "int",
			transactions: "Transaction[]",
			version: "int",
		},
	};
}
