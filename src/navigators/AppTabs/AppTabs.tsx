import BillsScreen from "@presentation/screens/BillsScreen/BillsScreen";
import ExpensesScreen from "@presentation/screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@presentation/screens/HomeScreen/HomeScreen";
import SettingsScreen from "@presentation/screens/SettingsScreen/SettingsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
  Expenses = "ExpensesScreen",
  Bills = "BillsScreen",
}

export type AppTabsParamList = {
  [AppTabsScreens.Home]: undefined;
  [AppTabsScreens.Settings]: undefined;
  [AppTabsScreens.Expenses]: undefined;
  [AppTabsScreens.Bills]: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function AppTabs() {
  return (
    <>
      <Tab.Navigator
        initialRouteName={AppTabsScreens.Home}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name={AppTabsScreens.Bills} component={BillsScreen} />
        <Tab.Screen name={AppTabsScreens.Expenses} component={ExpensesScreen} />
        <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
        <Tab.Screen name={AppTabsScreens.Settings} component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default AppTabs;
