import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import TransactionAdapter from "./TransactionAdapter";
import type { Transaction } from "@data/models/types/Transaction";

describe("TransactionAdapter", () => {
	const baseTransaction = new TransactionBuilder()
		.withId("txn_123")
		.withAmount(100050)
		.withType("expense")
		.withDescription("Test Transaction")
		.withCategory("Test Category")
		.withSharedAccountId("acct_123")
		.build();

	describe("localToState", () => {
		it("should convert a plain Transaction object with string date and amount to correct types", () => {
			const result = TransactionAdapter.localToState(baseTransaction);
			expect(result).toEqual({
				...baseTransaction,
				date: new Date(baseTransaction.date),
				amount: Number(baseTransaction.amount),
			});
			expect(result.date).toBeInstanceOf(Date);
			expect(typeof result.amount).toBe("number");
		});

		it("should convert an object with toJSON method", () => {
			const local = {
				toJSON: () => baseTransaction,
			};
			const result = TransactionAdapter.localToState(local);
			expect(result).toEqual({
				...baseTransaction,
				date: new Date(baseTransaction.date),
				amount: Number(baseTransaction.amount),
			});
			expect(result.date).toBeInstanceOf(Date);
			expect(typeof result.amount).toBe("number");
		});
	});

	describe("stateToRemote", () => {
		it("should return the state as is", () => {
			const state = {
				...baseTransaction,
				date: new Date(baseTransaction.date),
				amount: 100.5,
			};
			const result = TransactionAdapter.stateToRemote(state as Transaction);
			expect(result).toBe(state);
		});
	});

	describe("remoteToState", () => {
		it("should return the remote transaction as is", () => {
			const remote = { ...baseTransaction };
			const result = TransactionAdapter.remoteToState(remote);
			expect(result).toBe(remote);
		});
	});
});
