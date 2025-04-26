import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";
import type { RefObject } from "react";
import React from "react";
import type { SectionList } from "react-native";

export default function AddExpenseSheet({
  modalVisible,
  setModalVisible,
  onSubmit,
  listRef,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: (data: { amount: number; category: string; date: Date }) => void;
  listRef: RefObject<SectionList | null>;
}) {
  return (
    <SheetModal
      testID="add-expense-sheet"
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      presentationStyle="formSheet"
    >
      <ExpenseForm
        listRef={listRef}
        onSubmit={(data) => {
          setModalVisible(!modalVisible);
          onSubmit(data);
        }}
      />
    </SheetModal>
  );
}
