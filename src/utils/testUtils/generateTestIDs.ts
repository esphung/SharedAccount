import type { AccessibilityProps } from "react-native";

type GenerateTestIDResult = { testID: string } & Pick<
	AccessibilityProps,
	"accessibilityLabel" | "accessibilityHint" | "accessible" | "accessibilityRole"
>;

export const generateTestIDs = (
	testID: string,
	accessibilityRole: AccessibilityProps["accessibilityRole"] = "none"
): GenerateTestIDResult => {
	return {
		testID,
		accessibilityLabel: testID,
		accessibilityRole,
		accessible: true,
	};
};
