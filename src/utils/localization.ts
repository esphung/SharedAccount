type TranslationKeys = "SplashScreen" | "LoginScreen";

const translations = {
	en: {
		LoginScreen: {
			version: "Version",
			logout: "Logout",
			login: "Login",
			welcomeBack: "Welcome back!",
			pleaseLogIn: "Please log in to continue.",
			loggedIn: "You are logged in.",
			notLoggedIn: "You are not logged in.",
		},
		SplashScreen: {
			title: "Welcome to Shared Account",
		},
	},
	es: {
		LoginScreen: {
			version: "Versión",
			logout: "Cerrar sesión",
			login: "Iniciar sesión",
			welcomeBack: "¡Bienvenido de nuevo!",
			pleaseLogIn: "Por favor, inicia sesión para continuar.",
			loggedIn: "Has iniciado sesión.",
			notLoggedIn: "No has iniciado sesión.",
		},
		SplashScreen: {
			title: "Bienvenido a la Cuenta Compartida",
		},
	},
} as const;

export const getCurrentLanguage = (): keyof typeof translations => {
	// TODO: Add localStorage support
	return "en";
};

export const trans = (key: `${TranslationKeys}.${string}`): string => {
	const language = getCurrentLanguage();
	const [namespace, value] = key.split(".");

	const namespaceTranslations: Record<string, string> | undefined =
		translations[language]?.[namespace as TranslationKeys];
	return namespaceTranslations?.[value] || key;
};
