import CalculatorSvgIcon from "@assets/svg/calculator-svgrepo-com.svg";
import ChartSvgIcon from "@assets/svg/chart-line-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";

import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import React from "react";
import type { SvgProps } from "react-native-svg";

const SIZE_MULTIPLIER = 20;

export enum AppTabsScreens {
  Home = "HomeScreen",
  Expenses = "ExpensesScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const TabBarLabelScreenNamesMap: { [key in AppTabsScreens]: string } = {
  [AppTabsScreens.Home]: "Home",
  [AppTabsScreens.Expenses]: "Expenses",
};

const AppTabsTabBarIconMap: {
  [key in AppTabsScreens]: (props: SvgProps) => React.JSX.Element;
} = {
  [AppTabsScreens.Home]: (props: SvgProps) => <ChartSvgIcon {...props} />,
  [AppTabsScreens.Expenses]: (props: SvgProps) => <CalculatorSvgIcon {...props} />,
};

type TabRoute = RouteProp<AppTabsParamList, AppTabsScreens>;

const tabBarIcon = ({
  color,
  route,
}: TabBarIconProps & {
  route: TabRoute;
}) => {
  const Icon = AppTabsTabBarIconMap[route.name];
  return <Icon width={SIZE_MULTIPLIER} height={SIZE_MULTIPLIER} fill={color} />;
};

const tabBarLabel = ({
  route,
}: TabBarIconProps & {
  route: TabRoute;
}) => {
  return (
    <SharedAccountText type="tabBarLabel" numberOfLines={1}>
      {TabBarLabelScreenNamesMap[route.name]}
    </SharedAccountText>
  );
};

type TabBarIconProps = {
  focused: boolean;
  color: string;
};

const screenOptions = ({ route }: { route: TabRoute }): BottomTabNavigationOptions => ({
  tabBarLabelPosition: "below-icon",
  tabBarActiveTintColor: "#000",
  tabBarInactiveTintColor: "#000",
  headerShown: false,
  tabBarButtonTestID: `${route.name}-tabBarButton`,
  tabBarStyle: { height: 100, paddingBottom: 10, paddingTop: 10 },
  tabBarLabelStyle: { fontSize: 12, marginBottom: 0 },
  tabBarIconStyle: { marginBottom: 4 },
  tabBarIcon: (tabBarIconProps: TabBarIconProps) => tabBarIcon({ ...tabBarIconProps, route }),
  tabBarLabel: (tabBarLabelProps: TabBarIconProps) => tabBarLabel({ ...tabBarLabelProps, route }),
});

const AppTabs = () => {
  const Tab = createBottomTabNavigator<AppTabsParamList>();

  return (
    <Tab.Navigator initialRouteName={AppTabsScreens.Expenses} screenOptions={screenOptions}>
      <Tab.Screen name={AppTabsScreens.Expenses} component={ExpensesScreen} />
      <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
    </Tab.Navigator>
  );
};

export default AppTabs;
