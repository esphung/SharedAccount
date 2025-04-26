// import createTabNavigator from "@presentation/navigators/generators/createTabNavigator";
import ScheduledTransactionsScreen from "@screens/ScheduledTransactionsScreen/ScheduledTransactionsScreen";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Expenses = "ExpensesScreen",
  ScheduledTransactions = "ScheduledTransactionsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const AppTabs = () => {
  const Tab = createBottomTabNavigator<AppTabsParamList>();

  return (
    <Tab.Navigator initialRouteName={AppTabsScreens.Home} screenOptions={{ headerShown: false }}>
      <Tab.Screen name={AppTabsScreens.ScheduledTransactions} component={ScheduledTransactionsScreen} />
      <Tab.Screen name={AppTabsScreens.Expenses} component={ExpensesScreen} />
      <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;
