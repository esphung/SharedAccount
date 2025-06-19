import { handleCatchError } from "./utilities";

describe("handleCatchError", () => {
	const originalWarn = console.warn;

	beforeEach(() => {
		console.warn = jest.fn();
	});

	afterEach(() => {
		console.warn = originalWarn;
		jest.clearAllMocks();
	});

	it("should log the error with the correct method name", async () => {
		const methodName = "testMethod";
		const error = new Error("Test error");
		const handler = handleCatchError(methodName);

		await expect(handler(error)).rejects.toThrow("Test error");
		expect(console.warn).toHaveBeenCalledWith(`[AppTabs:${methodName}] Error occurred:`, error);
	});

	it("should return a rejected promise with the error", async () => {
		const handler = handleCatchError("anotherMethod");
		const error = new Error("Another error");

		await expect(handler(error)).rejects.toBe(error);
	});
});
