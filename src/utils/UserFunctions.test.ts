import type {User} from "@data/models/types/User";
import {getUserById} from "./UserFunctions";

describe("getUserById", () => {
	const mockUsers: User[] = [
		{id: "1", name: "Alice", email: "", avatar: ""},
		{id: "2", name: "Bob", email: "", avatar: ""},
		{id: "3", name: "Charlie", email: "", avatar: ""},
	];

	it("should return the user with the matching ID", () => {
		const result = getUserById("2", mockUsers);
		expect(result).toEqual(mockUsers[1]);
	});

	it("should return undefined if no user matches the ID", () => {
		const result = getUserById("4", mockUsers);
		expect(result).toBeUndefined();
	});

	it("should return undefined if the users array is empty", () => {
		const result = getUserById("1", []);
		expect(result).toBeUndefined();
	});

	it("should return undefined if no users array is provided", () => {
		const result = getUserById("1");
		expect(result).toBeUndefined();
	});
});
