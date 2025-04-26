import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";
import React from "react";

export default function AddExpenseSheet({
  modalVisible,
  setModalVisible,
  onSubmit,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onSubmit: (data: { amount: number; category: string; date: Date }) => void;
}) {
  return (
    <SheetModal
      testID="add-expense-sheet"
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      presentationStyle="formSheet"
    >
      <ExpenseForm
        onSubmit={(data) => {
          setModalVisible(!modalVisible);
          onSubmit(data);
        }}
      />
    </SheetModal>
  );
}
