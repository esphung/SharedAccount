import CalculatorSvgIcon from "@assets/svg/calculator-svgrepo-com.svg";
import ClockSvgIcon from "@assets/svg/clock-svgrepo-com.svg";
import HomeSvgIcon from "@assets/svg/home-1-svgrepo-com.svg";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ExpensesScreen from "@screens/ExpensesScreen/ExpensesScreen";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import ScheduledTransactionsScreen from "@screens/ScheduledTransactionsScreen/ScheduledTransactionsScreen";
import React from "react";

import type { RouteProp } from "@react-navigation/native";
import type { SvgProps } from "react-native-svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { StyleSheet, View } from "react-native";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Expenses = "ExpensesScreen",
  ScheduledTransactions = "ScheduledScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

const TabBarLabelScreenNamesMap: { [key in AppTabsScreens]: string } = {
  [AppTabsScreens.Home]: "Home",
  [AppTabsScreens.Expenses]: "Expenses",
  [AppTabsScreens.ScheduledTransactions]: "Scheduled",
};

const AppTabsTabBarIconMap: {
  [key in AppTabsScreens]: (props: SvgProps) => React.JSX.Element;
} = {
  [AppTabsScreens.Home]: (props: SvgProps) => <HomeSvgIcon {...props} />,
  [AppTabsScreens.Expenses]: (props: SvgProps) => <CalculatorSvgIcon {...props} />,
  [AppTabsScreens.ScheduledTransactions]: (props: SvgProps) => <ClockSvgIcon {...props} />,
};

type TabRoute = RouteProp<AppTabsParamList, AppTabsScreens>;

const tabBarIcon = ({ color, size, route }: { focused: boolean; color: string; size: number; route: TabRoute }) => {
  const Icon = AppTabsTabBarIconMap[route.name];
  return (
    <View style={styles.tabBarIconContainer}>
      <Icon width={size * 0.76} height={size * 0.8} fill={color} />
    </View>
  );
};

const tabBarLabel = ({ route }: { focused: boolean; color: string; route: TabRoute }) => {
  return (
    <View style={styles.tabBarLabelContainer}>
      <SharedAccountText type="tabBarLabel" numberOfLines={1}>
        {TabBarLabelScreenNamesMap[route.name]}
      </SharedAccountText>
    </View>
  );
};

const AppTabs = () => {
  const Tab = createBottomTabNavigator<AppTabsParamList>();

  return (
    <Tab.Navigator
      initialRouteName={AppTabsScreens.Expenses}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: (tabBarIconProps) => tabBarIcon({ ...tabBarIconProps, route }),
        tabBarLabel: (tabBarLabelProps) => tabBarLabel({ ...tabBarLabelProps, route }),
      })}
    >
      <Tab.Screen name={AppTabsScreens.ScheduledTransactions} component={ScheduledTransactionsScreen} />
      <Tab.Screen name={AppTabsScreens.Expenses} component={ExpensesScreen} />
      <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarIconContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  tabBarLabelContainer: {
    alignItems: "center",
    height: "100%",
    justifyContent: "center",
    paddingBottom: 12,
    width: "100%",
  },
});

export default AppTabs;
