import AccountUsersAdapter from "./AccountUsersAdapter";
import type { AccountUsers } from "@data/types/AccountUsers";

describe("AccountUsersAdapter", () => {
	const baseUser: AccountUsers = {
		id: 123,
		role: "admin",
		accepted: false,
		sharedAccountId: "456",
		userId: "789",
		// add other required fields if any
	};

	describe("localToState", () => {
		it("should convert accepted to boolean, id to number, and set default role", () => {
			const input = {
				...baseUser,
				accepted: 1,
				id: "42",
				role: undefined,
			};
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.localToState(input);
			expect(result.accepted).toBe(true);
			expect(result.id).toBe(42);
			expect(result.role).toBe("viewer");
		});

		it("should keep provided role if present", () => {
			const input = { ...baseUser, role: "editor" };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.localToState(input);
			expect(result.role).toBe("editor");
		});
	});

	describe("stateToRemote", () => {
		it("should convert accepted to boolean, id to number, and set default role", () => {
			const input = { ...baseUser, accepted: 0, id: "7", role: undefined };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.stateToRemote(input);
			expect(result.accepted).toBe(false);
			expect(result.id).toBe(7);
			expect(result.role).toBe("viewer");
		});

		it("should keep provided role if present", () => {
			const input = { ...baseUser, role: "owner" };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.stateToRemote(input);
			expect(result.role).toBe("owner");
		});
	});

	describe("remoteToState", () => {
		it("should convert accepted to boolean, id to number, and set default role", () => {
			const input = { ...baseUser, accepted: undefined, id: "99", role: undefined };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.remoteToState(input);
			expect(result.accepted).toBe(false);
			expect(result.id).toBe(99);
			expect(result.role).toBe("viewer");
		});

		it("should keep provided role if present", () => {
			const input = { ...baseUser, role: "admin" };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.remoteToState(input);
			expect(result.role).toBe("admin");
		});
	});

	describe("stateToLocal", () => {
		it("should convert accepted to boolean, id to number, and set default role", () => {
			const input = { ...baseUser, accepted: "yes", id: "55", role: undefined };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.stateToLocal(input);
			expect(result.accepted).toBe(true);
			expect(result.id).toBe(55);
			expect(result.role).toBe("viewer");
		});

		it("should keep provided role if present", () => {
			const input = { ...baseUser, role: "custom" };
			// @ts-expect-error // Testing conversion logic
			const result = AccountUsersAdapter.stateToLocal(input);
			expect(result.role).toBe("custom");
		});
	});
});
