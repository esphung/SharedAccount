import useDevMenu from "@presentation/hooks/useDevMenu";
import { renderHook } from "@testing-library/react-hooks";
import { DevSettings } from "react-native";

jest.mock("react-native", () => ({
	DevSettings: {
		addMenuItem: jest.fn(),
	},
}));

jest.mock("react-native-file-access", () => ({
	Dirs: {
		DocumentDir: "/mocked/document/dir",
	},
}));

describe("useDevMenu", () => {
	// @ts-expect-error: __DEV__ is a global
	const originalDev = global.__DEV__;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		// @ts-expect-error: __DEV__ is a global
		global.__DEV__ = originalDev;
	});

	it("should add DevSettings menu item in __DEV__ mode", () => {
		// @ts-expect-error: __DEV__ is a global
		global.__DEV__ = true;
		renderHook(() => useDevMenu());
		expect(DevSettings.addMenuItem).toHaveBeenCalledWith("Show DB", expect.any(Function));
	});

	it("should not add DevSettings menu item when not in __DEV__ mode", () => {
		// @ts-expect-error: __DEV__ is a global
		global.__DEV__ = false;
		renderHook(() => useDevMenu());
		expect(DevSettings.addMenuItem).not.toHaveBeenCalled();
	});

	it("menu item callback logs the DB path", () => {
		// @ts-expect-error: __DEV__ is a global
		global.__DEV__ = true;
		renderHook(() => useDevMenu());
		const callback = (DevSettings.addMenuItem as jest.Mock).mock.calls[0][1];
		const consoleDebugSpy = jest.spyOn(console, "debug").mockImplementation();
		callback();
		expect(consoleDebugSpy).toHaveBeenCalledWith("DB Path:", "/mocked/document/dir");
		consoleDebugSpy.mockRestore();
	});
});
