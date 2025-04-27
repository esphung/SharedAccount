import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SpendingStats from "@components/SpendingStats/SpendingStats";
import useTransactions from "@presentation/hooks/useTransactions";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const HomeScreen = () => {
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
      <ScreenTitle title="Home" />
      <View style={styles.content}>
        <SpendingStats transactions={transactions} />
      </View>
    </SharedAccountScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
