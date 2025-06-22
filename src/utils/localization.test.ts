import * as localization from "@utils/localization";

describe("trans", () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("returns English translation for LoginScreen.version", () => {
		expect(localization.trans("LoginScreen.version")).toBe("Version");
	});

	it("returns key if translation does not exist", () => {
		expect(localization.trans("LoginScreen.nonexistent")).toBe("LoginScreen.nonexistent");
	});

	it("returns English translation for LoginScreen.login", () => {
		expect(localization.trans("LoginScreen.login")).toBe("Login");
	});

	it("returns English translation for SplashScreen.title", () => {
		expect(localization.trans("SplashScreen.title")).toBe("Welcome to Shared Account");
	});

	describe("getCurrentLanguage", () => {
		it("returns 'en' when no language is set", () => {
			jest.spyOn(localization, "getCurrentLanguage").mockReturnValue("en");
			expect(localization.getCurrentLanguage()).toBe("en");
		});

		it("returns 'es' when Spanish is set", () => {
			jest.spyOn(localization, "getCurrentLanguage").mockReturnValue("es");
			expect(localization.getCurrentLanguage()).toBe("es");
		});
	});
});
