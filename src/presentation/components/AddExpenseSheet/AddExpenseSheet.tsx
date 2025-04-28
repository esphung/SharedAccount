import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";
import type { RefObject } from "react";
import React from "react";
import { StyleSheet, View, type SectionList } from "react-native";
import type { Transaction } from "types/Transaction";

export default function AddExpenseSheet({
  modalVisible,
  setModalVisible,
  onSubmit,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: (data: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => void;
  listRef: RefObject<SectionList | null>;
}) {
  return (
    <SheetModal
      testID="add-expense-sheet"
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      presentationStyle="formSheet"
    >
      <View style={styles.content}>
        <ExpenseForm
          onSubmit={(data) => {
            setModalVisible(!modalVisible);
            onSubmit(data);
          }}
        />
      </View>
    </SheetModal>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
});
