import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Settings>;

export default function SettingsScreen(_: Props) {
  return <SharedAccountScreen />;
}
