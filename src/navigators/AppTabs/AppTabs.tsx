import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
  Expenses = "ExpensesScreen",
}

export type AppTabsParamList = {
  [AppTabsScreens.Home]: undefined;
  [AppTabsScreens.Settings]: undefined;
  [AppTabsScreens.Expenses]: undefined;
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
        <Tab.Screen name={AppTabsScreens.Expenses} component={ExpensesScreen} />
        <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
        <Tab.Screen name={AppTabsScreens.Settings} component={SettingsScreen} />
      </Tab.Navigator>
    </>
  );
}

export default AppTabs;
