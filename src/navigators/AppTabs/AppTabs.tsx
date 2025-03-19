import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
}

export type AppTabsParamList = {
  [AppTabsScreens.Home]: undefined;
  [AppTabsScreens.Settings]: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName={AppTabsScreens.Home}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
      <Tab.Screen name={AppTabsScreens.Settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default AppTabs;
