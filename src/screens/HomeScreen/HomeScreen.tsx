import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SpendingStats from "@components/SpendingStats/SpendingStats";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Home>;

export default function HomeScreen(_: Props) {
  return (
    <SharedAccountScreen>
      <View style={styles.content}>
        <SpendingStats
          transactions={
            [
              // TODO: Replace with real data
            ]
          }
        />
      </View>
    </SharedAccountScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
