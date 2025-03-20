import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SpendingStats from "@components/SpendingStats/SpendingStats";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import useTransactions from "@presentation/hooks/useTransactions";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Home>;

export default function HomeScreen(_: Props) {
  const { state: transactions, startListening } = useTransactions();

  useEffect(() => {
    const sub = startListening();

    return () => {
      sub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SharedAccountScreen>
      <View style={styles.content}>
        <SpendingStats transactions={transactions} />
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
