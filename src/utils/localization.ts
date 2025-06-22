type TranslationKeys = "SplashScreen" | "LoginScreen" | "TransactionsScreen" | "SettingsScreen";

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
			env: "Environment",
		},
		SplashScreen: {
			title: "Welcome to Shared Account",
		},
		TransactionsScreen: {
			noTransactions: "No accounts found",
			createAccount: "Please create an account to get started",
		},
		SettingsScreen: {
			signOut: "Sign Out",
			goBack: "Go Back",
			createAccount: "Create Account",
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
			env: "Entorno",
		},
		SplashScreen: {
			title: "Bienvenido a la Cuenta Compartida",
		},
		TransactionsScreen: {
			noTransactions: "No se encontraron cuentas",
			createAccount: "Por favor, crea una cuenta para comenzar",
		},
		SettingsScreen: {
			goBack: "Regresar",
			signOut: "Cerrar sesión",
			createAccount: "Crear cuenta",
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
