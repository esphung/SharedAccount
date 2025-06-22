import { capitalizeFirstLetter } from "@utils/stringFunctions";

describe("capitalizeFirstLetter", () => {
	it("capitalizes the first letter of a lowercase word", () => {
		expect(capitalizeFirstLetter("hello")).toBe("Hello");
	});

	it("returns the same string if the first letter is already capitalized", () => {
		expect(capitalizeFirstLetter("Hello")).toBe("Hello");
	});

	it("handles empty string", () => {
		expect(capitalizeFirstLetter("")).toBe("");
	});

	it("handles single character string", () => {
		expect(capitalizeFirstLetter("a")).toBe("A");
	});

	it("handles string with first character as a space", () => {
		expect(capitalizeFirstLetter(" hello")).toBe(" hello");
	});

	it("handles string with non-letter first character", () => {
		expect(capitalizeFirstLetter("1hello")).toBe("1hello");
	});

	it("handles string with all uppercase", () => {
		expect(capitalizeFirstLetter("HELLO")).toBe("HELLO");
	});
});
