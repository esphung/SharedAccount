import BillsSectionList from "@components/BillsSectionList/BillsSectionList";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SheetModal from "@components/SheetModal/SheetModal";
import useScheduledTransactions from "@hooks/useScheduledTransactions";
import React, { useCallback } from "react";
import { Button } from "react-native";

export default function ScheduledTransactionsScreen() {
  // hooks
  const { state: scheduledTransactions, startListening } = useScheduledTransactions();

  // local state
  const [modalVisible, setModalVisible] = React.useState(false);

  // effects
  React.useEffect(() => {
    const sub = startListening();
    return () => {
      sub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModalCallback = useCallback(() => setModalVisible(true), []);

  return (
    <SharedAccountScreen>
      <Button title="Add Scheduled Transaction" onPress={openModalCallback} />
      <BillsSectionList onPressAddNew={openModalCallback} scheduledTransactions={scheduledTransactions} />
      <SheetModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </SharedAccountScreen>
  );
}
