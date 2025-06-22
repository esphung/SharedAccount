import AccountAdapter from "@data/adapters/AccountAdapter";
import type { Account } from "types/Account";

describe("AccountAdapter", () => {
	const baseAccount: Account = {
		id: "acc1",
		name: "Checking",
		startingBalance: 1000,
		version: 2,
		// add other required Account fields if any
	};

	describe("localToState", () => {
		it("should convert Account object with string fields to Account with numbers", () => {
			const result = AccountAdapter.localToState(baseAccount);
			expect(result).toEqual({
				...baseAccount,
				startingBalance: 1000,
				version: 2,
				name: "Checking",
			});
		});

		it("should handle objects with toJSON method", () => {
			const local = {
				toJSON: () => baseAccount,
			};
			const result = AccountAdapter.localToState(local);
			expect(result).toEqual({
				...baseAccount,
				startingBalance: 1000,
				version: 2,
				name: "Checking",
			});
		});
	});

	describe("stateToRemote", () => {
		it("should convert Account state to Partial<Account> with numbers", () => {
			const state: Account = {
				...baseAccount,
				startingBalance: 2000,
				version: 3,
			};
			const result = AccountAdapter.stateToRemote(state);
			expect(result).toEqual({
				...state,
				startingBalance: 2000,
				version: 3,
				name: "Checking",
			});
		});
	});

	describe("remoteToState", () => {
		it("should convert remote Account to state Account with numbers", () => {
			const remote: Account = {
				...baseAccount,
				// @ts-expect-error // Simulating remote data with string values
				startingBalance: "1500",
				// @ts-expect-error // Simulating remote data with string values
				version: "4",
			};
			const result = AccountAdapter.remoteToState(remote);
			expect(result).toEqual({
				...remote,
				startingBalance: 1500,
				version: 4,
				name: "Checking",
			});
		});
	});

	describe("stateToLocal", () => {
		it("should convert state Account to LocalAccount with numbers", () => {
			const state: Account = {
				...baseAccount,
				startingBalance: 3000,
				version: 5,
			};
			const result = AccountAdapter.stateToLocal(state);
			expect(result).toEqual({
				...state,
				startingBalance: 3000,
				version: 5,
				name: "Checking",
			});
		});
	});
});
