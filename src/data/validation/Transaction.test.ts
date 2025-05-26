import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import {isCreditTransaction, isExpenseTransaction} from "./Transaction";

describe("Transaction Validation", () => {
	it("should identify an expense transaction", () => {
		const transaction = new TransactionBuilder()
			.withType("expense")
			.withAmount(100)
			.withDescription("Groceries")
			.build();

		expect(isExpenseTransaction(transaction)).toBe(true);
		expect(isCreditTransaction(transaction)).toBe(false);
	});

	it("should identify a credit transaction", () => {
		const transaction = new TransactionBuilder()
			.withType("credit")
			.withAmount(200)
			.withDescription("Salary")
			.build();

		expect(isCreditTransaction(transaction)).toBe(true);
		expect(isExpenseTransaction(transaction)).toBe(false);
	});

	it("should return false for an unknown transaction type", () => {
		const transaction = new TransactionBuilder()
			// @ts-expect-error testing unknown type
			.withType("unknown")
			.withAmount(300)
			.withDescription("Unknown")
			.build();

		expect(isExpenseTransaction(transaction)).toBe(false);
		expect(isCreditTransaction(transaction)).toBe(false);
	});
});
