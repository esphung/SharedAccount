import AccountAdapter from "@data/adapters/AccountAdapter";
import AccountBuilder from "@data/models/builders/AccountBuilder";
import type { Account } from "types/Account";

const baseAccount: Account = new AccountBuilder()
	.withName("Test Account")
	.withStartingBalance(1000)
	.build();

describe("AccountAdapter", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("localToState", () => {
		it("should convert local Account object to state Account", () => {
			const result = AccountAdapter.localToState(baseAccount);
			expect(result.startingBalance).toBe(1000);
			expect(result.version).toBe(0);
			expect(result.name).toBe(baseAccount.name);
		});

		it("should handle local object with toJSON method", () => {
			const local = {
				toJSON: () => baseAccount,
			};
			const result = AccountAdapter.localToState(local);
			expect(result.startingBalance).toBe(1000);
			expect(result.version).toBe(0);
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
