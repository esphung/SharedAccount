import createTabNavigator from "@presentation/navigators/generators/createTabNavigator";
import BillsScreen from "@screens/BillsScreen/BillsScreen";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
  Expenses = "ExpensesScreen",
  Bills = "BillsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const AppTabs = createTabNavigator(
  [
    { name: AppTabsScreens.Bills, component: BillsScreen },
    { name: AppTabsScreens.Expenses, component: ExpensesScreen },
    { name: AppTabsScreens.Home, component: HomeScreen },
    { name: AppTabsScreens.Settings, component: SettingsScreen },
  ],
  { initialRouteName: AppTabsScreens.Home },
);

export default AppTabs;
