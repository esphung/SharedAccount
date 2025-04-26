import createTabNavigator from "@presentation/navigators/generators/createTabNavigator";
import ScheduledTransactionsScreen from "@screens/ScheduledTransactionsScreen/ScheduledTransactionsScreen";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
  Expenses = "ExpensesScreen",
  Bills = "ScheduledTransactionsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const AppTabs = createTabNavigator(
  [
    { name: AppTabsScreens.Bills, component: ScheduledTransactionsScreen },
    { name: AppTabsScreens.Expenses, component: ExpensesScreen },
    { name: AppTabsScreens.Home, component: HomeScreen },
    { name: AppTabsScreens.Settings, component: SettingsScreen },
  ],
  { initialRouteName: AppTabsScreens.Home },
);

export default AppTabs;
