import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SpendingStats from "@components/SpendingStats/SpendingStats";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import RepositoryFactory from "@repositories/RepositoryFactory";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { Transaction } from "types/Transaction";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Home>;

// TODO: Move to context
const transactionRepo = RepositoryFactory.createTransactionRepository();

export default function HomeScreen(_: Props) {
  const [transactions, setTransactions] = React.useState<Transaction[]>([]);

  // TODO: Move to context
  React.useEffect(() => {
    async function fetchTransactions() {
      const txns = await transactionRepo.getTransactions();
      setTransactions(txns);
    }
    fetchTransactions();
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
