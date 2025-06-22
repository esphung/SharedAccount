import type { Transaction } from "@data/models/types/Transaction";
import { Realm } from "@realm/react";

export default class RealmTransaction extends Realm.Object implements Transaction {
	id: string = `txn_${Math.random().toString(36).substr(2, 9)}`;
	sharedAccountId: string = `acct_${Math.random().toString(36).substr(2, 9)}`;
	userId: string = `usr_${Math.random().toString(36).substr(2, 9)}`;
	amount: number = Math.random() * 1000;
	name: string = "";
	category: string = "";
	description?: string;
	date: Date = new Date();
	type: "credit" | "expense" = "expense";
	version: number = 0;

	static schema = {
		name: "Transaction",
		primaryKey: "id",
		properties: {
			id: "string",
			sharedAccountId: "string",
			userId: "string",
			amount: "int",
			name: "string",
			category: "string",
			description: "string?",
			date: "date",
			type: "string",
			version: "int",
		},
	};
}
