import createTabNavigator from "@presentation/navigators/generators/createTabNavigator";
import ScheduledTransactionsScreen from "@screens/ScheduledTransactionsScreen/ScheduledTransactionsScreen";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Expenses = "ExpensesScreen",
  ScheduledTransactions = "ScheduledTransactionsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const AppTabs = createTabNavigator(
  [
    { name: AppTabsScreens.ScheduledTransactions, component: ScheduledTransactionsScreen },
    { name: AppTabsScreens.Expenses, component: ExpensesScreen },
    { name: AppTabsScreens.Home, component: HomeScreen },
  ],
  { initialRouteName: AppTabsScreens.Home },
);

export default AppTabs;
