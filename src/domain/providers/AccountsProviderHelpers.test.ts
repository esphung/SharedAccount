import AccountBuilder from "@data/models/builders/AccountBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import type { Account } from "types/Account";
import { mergeAccounts } from "./AccountsProviderHelpers";

describe("mergeAccounts", () => {
	const baseAccounts: Account[] = [
		new AccountBuilder()
			.withId("acct_1")
			.withName("Checking")
			.withStartingBalance(100)
			.withTransactions([
				new TransactionBuilder()
					.withId("txn_1")
					.withAmount(50)
					.withDescription("Deposit")
					.withDate(new Date("2023-01-01"))
					.withType("credit")
					.build(),
				new TransactionBuilder()
					.withId("txn_2")
					.withAmount(-20)
					.withDescription("Withdrawal")
					.withDate(new Date("2023-01-02"))
					.withType("expense")
					.build(),
			])
			.build(),
		new AccountBuilder()
			.withId("acct_2")
			.withName("Savings")
			.withStartingBalance(200)
			.withTransactions([
				new TransactionBuilder()
					.withId("txn_3")
					.withAmount(200)
					.withDescription("Deposit")
					.withDate(new Date("2023-01-03"))
					.withType("credit")
					.build(),
			])
			.build(),
	];

	it("returns previous accounts if no updates match", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_3")
				.withName("Investment")
				.withStartingBalance(300)
				.withTransactions([
					new TransactionBuilder()
						.withId("txn_4")
						.withAmount(300)
						.withDescription("Deposit")
						.withDate(new Date("2023-01-04"))
						.withType("credit")
						.build(),
				])
				.build(),
		];
		expect(mergeAccounts(baseAccounts, updates)).toEqual(baseAccounts);
	});

	it("merges updated account fields and transactions", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_1")
				.withName("Checking Updated")
				.withStartingBalance(120)
				.withTransactions([
					new TransactionBuilder()
						.withId("txn_1")
						.withAmount(60)
						.withDescription("Deposit Updated")
						.withDate(new Date("2023-01-01"))
						.withType("credit")
						.build(),
					new TransactionBuilder()
						.withId("txn_2")
						.withAmount(-20)
						.withDescription("Withdrawal")
						.withDate(new Date("2023-01-02"))
						.withType("expense")
						.build(),
					new TransactionBuilder()
						.withId("txn_5")
						.withAmount(10)
						.withDescription("Bonus")
						.withDate(new Date("2023-01-05"))
						.withType("credit")
						.withName("Foo")
						.build(),
				])
				.build(),
		];
		const result = mergeAccounts(baseAccounts, updates);
		expect(result[0].name).toBe("Checking Updated");
		expect(result[0].startingBalance).toBe(120);
		expect(result[0].transactions).toHaveLength(3);
		expect(result[0].transactions.find((t) => t.id === "txn_1")?.amount).toBe(60);
		expect(result[0].transactions.find((t) => t.id === "txn_1")?.description).toBe(
			"Deposit Updated"
		);
		expect(result[0].transactions.find((t) => t.id === "txn_5")).toEqual({
			id: "txn_5",
			amount: 10,
			description: "Bonus",
			date: new Date("2023-01-05"),
			type: "credit",
			name: "Foo",
			category: "Food",
			sharedAccountId: "acct_1",
			userId: "usr_1234567890",
		});
	});

	it("does not modify accounts not present in updates", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_1")
				.withName("Checking Updated")
				.withStartingBalance(120)
				.withTransactions([
					new TransactionBuilder()
						.withId("txn_1")
						.withAmount(60)
						.withDescription("Deposit Updated")
						.withDate(new Date("2023-01-01"))
						.withType("credit")
						.build(),
				])
				.build(),
		];
		const result = mergeAccounts(baseAccounts, updates);
		expect(result[1]).toEqual(baseAccounts[1]);
	});

	it("handles empty updates array", () => {
		const result = mergeAccounts(baseAccounts, []);
		expect(result).toEqual(baseAccounts);
	});

	it("handles empty previous array", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_1")
				.withName("Checking")
				.withStartingBalance(100)
				.withTransactions([
					new TransactionBuilder()
						.withId("txn_1")
						.withAmount(50)
						.withDescription("Deposit")
						.withDate(new Date("2023-01-01"))
						.withType("credit")
						.build(),
				])
				.build(),
		];
		expect(mergeAccounts([], updates)).toEqual([]);
	});
});
