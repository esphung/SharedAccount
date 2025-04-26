import { AppTabsScreens } from "./AppTabs";

jest.mock("@presentation/navigators/generators/createTabNavigator", () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

jest.mock("react-native-keyboard-controller", () => {
  return {
    KeyboardAwareScrollView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock("react-native-modal-datetime-picker", () => {
  return {
    default: null,
  };
});

jest.mock("react-native-gifted-charts", () => {
  return {
    default: null,
  };
});

describe("AppTabsScreens Enum", () => {
  it("should have the correct values for each screen", () => {
    expect(AppTabsScreens.Home).toBe("HomeScreen");
    expect(AppTabsScreens.Settings).toBe("SettingsScreen");
    expect(AppTabsScreens.Expenses).toBe("ExpensesScreen");
    expect(AppTabsScreens.ScheduledTransactions).toBe("ScheduledTransactionsScreen");
  });

  it("should contain all expected values", () => {
    const values = Object.values(AppTabsScreens);
    expect(values).toEqual(["HomeScreen", "SettingsScreen", "ExpensesScreen", "ScheduledTransactionsScreen"]);
  });
});
