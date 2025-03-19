import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AddExpenseSheet({
  modalVisible,
  setModalVisible,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}) {
  return (
    <SheetModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      presentationStyle="formSheet"
    >
      <View style={styles.modalSheetContainer}>
        <View style={styles.modalSheetContent}>
          <ExpenseForm
            onSubmit={(data) => {
              console.debug("[AppTabs] ExpenseForm onSubmit:", data);
              setModalVisible(!modalVisible);
            }}
          />
        </View>
        {/* <Button title="Show Modal" onPress={() => setModalVisible(true)} /> */}
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  modalSheetContainer: {
    flex: 1,
  },
  modalSheetContent: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
});
