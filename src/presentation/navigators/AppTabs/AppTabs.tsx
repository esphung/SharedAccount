import createTabNavigator from "@presentation/navigators/generators/createTabNavigator";
import BillsScreen from "@screens/BillsScreen/BillsScreen";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Expenses = "ExpensesScreen",
  Bills = "BillsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const AppTabs = createTabNavigator(
  [
    { name: AppTabsScreens.Bills, component: BillsScreen },
    { name: AppTabsScreens.Expenses, component: ExpensesScreen },
    { name: AppTabsScreens.Home, component: HomeScreen },
  ],
  { initialRouteName: AppTabsScreens.Home },
);

export default AppTabs;
