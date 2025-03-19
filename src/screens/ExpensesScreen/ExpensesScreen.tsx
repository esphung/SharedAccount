import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React, { useState } from "react";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Expenses>;

export default function ExpensesScreen(_: Props) {
  const [modalVisible, setModalVisible] = useState(false);

  const onPressAddTransaction = React.useCallback(() => {
    setModalVisible(true);
  }, []);

  return (
    <SharedAccountScreen>
      <TransactionList
        users={[]}
        transactions={[]}
        onPressAddTransaction={onPressAddTransaction}
      />
      <AddExpenseSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SharedAccountScreen>
  );
}
