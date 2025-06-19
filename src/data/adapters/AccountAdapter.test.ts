import AccountAdapter from "@data/adapters/AccountAdapter";
import TransactionAdapter from "@data/adapters/TransactionAdapter";
import AccountBuilder from "@data/models/builders/AccountBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import type { Account } from "types/Account";

const baseAccount: Account = new AccountBuilder()
	.withName("Test Account")
	.withStartingBalance(1000)
	.withTransactions([
		new TransactionBuilder()
			.withId("txn_1")
			.withAmount(100)
			.withDate(new Date("2023-01-01"))
			.build(),
		new TransactionBuilder()
			.withId("txn_2")
			.withAmount(-50)
			.withDate(new Date("2023-01-02"))
			.build(),
	])
	.build();

describe("AccountAdapter", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("localToState", () => {
		it("should convert local Account object to state Account", () => {
			const spy = jest.spyOn(TransactionAdapter, "localToState");
			const result = AccountAdapter.localToState(baseAccount);
			expect(result.startingBalance).toBe(1000);
			expect(result.version).toBe(0);
			expect(result.name).toBe(baseAccount.name);
			expect(Array.isArray(result.transactions)).toBe(true);
			expect(result.transactions[0].sharedAccountId).toBe(
				baseAccount.transactions[0].sharedAccountId
			);
			expect(spy).toHaveBeenCalledTimes(2);
		});

		it("should handle local object with toJSON method", () => {
			const local = {
				toJSON: () => baseAccount,
			};
			const result = AccountAdapter.localToState(local);
			expect(result.startingBalance).toBe(1000);
			expect(result.version).toBe(0);
			expect(result.transactions[0].sharedAccountId).toBe(
				baseAccount.transactions[0].sharedAccountId
			);
		});

		it("should handle missing transactions", () => {
			const accountNoTx = { ...baseAccount, transactions: undefined };
			// @ts-expect-error Allow undefined transactions for this test
			const result = AccountAdapter.localToState(accountNoTx);
			expect(Array.isArray(result.transactions)).toBe(true);
			expect(result.transactions.length).toBe(0);
		});
	});

	describe("stateToRemote", () => {
		it("should convert state Account to remote format", () => {
			const result = AccountAdapter.stateToRemote({
				...baseAccount,
				startingBalance: 500,
				version: 3,
			});
			expect(result.startingBalance).toBe(500);
			expect(result.version).toBe(3);
			expect(result.name).toBe(baseAccount.name);
		});
	});

	describe("remoteToState", () => {
		it("should convert remote Account to state Account", () => {
			const remote = { ...baseAccount, startingBalance: "1500", version: "4" };
			// @ts-expect-error Allow string types for this test
			const result = AccountAdapter.remoteToState(remote);
			expect(result.startingBalance).toBe(1500);
			expect(result.version).toBe(4);
			expect(result.name).toBe(baseAccount.name);
		});
	});
});
