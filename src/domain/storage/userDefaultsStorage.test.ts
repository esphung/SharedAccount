import asyncStorage from "./asyncStorage";
import userDefaultsStorage from "./userDefaultsStorage";

jest.mock("./asyncStorage", () => ({
	setItem: jest.fn(() => Promise.resolve()),
	getItem: jest.fn(() => Promise.resolve("mocked-value")),
	removeItem: jest.fn(() => Promise.resolve()),
}));

describe("userDefaultsStorage", () => {
	const key = "account";
	const value = "test-value";
	const storageKey = "user-defaults-account";

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should save an item using asyncStorage.setItem", async () => {
		await userDefaultsStorage.saveItem(key, value);
		expect(asyncStorage.setItem).toHaveBeenCalledWith(storageKey, value);
		expect(asyncStorage.setItem).toHaveBeenCalledTimes(1);
	});

	it("should get an item using asyncStorage.getItem", async () => {
		const result = await userDefaultsStorage.getItem(key);
		expect(asyncStorage.getItem).toHaveBeenCalledWith(storageKey);
		expect(asyncStorage.getItem).toHaveBeenCalledTimes(1);
		expect(result).toBe("mocked-value");
	});

	it("should remove an item using asyncStorage.removeItem", async () => {
		await userDefaultsStorage.removeItem(key);
		expect(asyncStorage.removeItem).toHaveBeenCalledWith(storageKey);
		expect(asyncStorage.removeItem).toHaveBeenCalledTimes(1);
	});

	it("should handle undefined value in saveItem", async () => {
		await userDefaultsStorage.saveItem(key, undefined);
		expect(asyncStorage.setItem).toHaveBeenCalledWith(storageKey, undefined);
	});
});
