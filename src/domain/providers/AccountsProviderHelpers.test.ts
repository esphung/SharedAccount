import AccountBuilder from "@data/models/builders/AccountBuilder";
import type { Account } from "types/Account";
import { mergeAccounts } from "./AccountsProviderHelpers";

describe("mergeAccounts", () => {
	const baseAccounts: Account[] = [
		new AccountBuilder().withId("acct_1").withName("Checking").withStartingBalance(100).build(),
		new AccountBuilder().withId("acct_2").withName("Savings").withStartingBalance(200).build(),
	];

	it("returns previous accounts if no updates match", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_3")
				.withName("Investment")
				.withStartingBalance(300)
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
				.build(),
		];
		const result = mergeAccounts(baseAccounts, updates);
		expect(result[0].name).toBe("Checking Updated");
		expect(result[0].startingBalance).toBe(120);
	});

	it("does not modify accounts not present in updates", () => {
		const updates: Account[] = [
			new AccountBuilder()
				.withId("acct_1")
				.withName("Checking Updated")
				.withStartingBalance(120)
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
				.build(),
		];
		expect(mergeAccounts([], updates)).toEqual([]);
	});
});
