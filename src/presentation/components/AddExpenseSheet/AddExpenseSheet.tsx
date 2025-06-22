import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";

import type { RefObject } from "react";
import React, { useCallback } from "react";
import { StyleSheet, View, type SectionList } from "react-native";
import type { Transaction } from "types/Transaction";

export default function AddExpenseSheet({
	modalVisible,
	setModalVisible,
	onSubmit,
	categoryPills = [],
}: {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	onSubmit: (data: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => void;
	listRef: RefObject<SectionList | null>;
	categoryPills: { id: string; label: string }[];
}) {
	const onSubmitCallback = useCallback(
		(data: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => {
			setModalVisible(!modalVisible);
			onSubmit(data);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[modalVisible, onSubmit]
	);

	return (
		<SheetModal
			testID="add-expense-sheet"
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			presentationStyle="formSheet"
		>
			<View style={styles.content}>
				<ExpenseForm onSubmit={onSubmitCallback} categoryPills={categoryPills} />
			</View>
		</SheetModal>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
});
