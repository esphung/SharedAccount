import colors from "@config/themes/colors";
import type { Theme } from "@react-navigation/native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";

const darkTheme: Theme = {
	...DarkTheme,
	dark: true,
	colors: {
		...DarkTheme.colors,
		// TODO: Use a more suitable colors for dark mode
		primary: colors.primary,
		background: colors.black,
		card: colors.card,
		text: colors.white,
		border: colors.white,
		notification: colors.notification,
	},
	fonts: {
		...DarkTheme.fonts,
		regular: { fontFamily: "Roboto-Regular", fontWeight: "500" },
		medium: { fontFamily: "Roboto-Medium", fontWeight: "600" },
		bold: { fontFamily: "Roboto-Bold", fontWeight: "900" },
		heavy: { fontFamily: "Roboto-Black", fontWeight: "700" },
	},
};

const lightTheme: Theme = {
	...DefaultTheme,
	dark: false,
	colors: {
		...DefaultTheme.colors,
		primary: colors.primary,
		background: colors.white,
		card: colors.card,
		text: colors.black,
		border: colors.black,
		notification: colors.notification,
	},
	fonts: {
		...DefaultTheme.fonts,
		regular: { fontFamily: "Roboto-Regular", fontWeight: "normal" },
		medium: { fontFamily: "Roboto-Medium", fontWeight: "500" },
		bold: { fontFamily: "Roboto-Bold", fontWeight: "bold" },
		heavy: { fontFamily: "Roboto-Black", fontWeight: "900" },
	},
};

export const navigationThemes = {
	dark: darkTheme,
	light: lightTheme,
} as const;
