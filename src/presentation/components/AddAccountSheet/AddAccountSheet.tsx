import AccountForm from "@components/AccountForm/AccountForm";
import SheetModal from "@components/SheetModal/SheetModal";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

import type { Account } from "types/Account";

export default function AddAccountSheet({
	modalVisible,
	setModalVisible,
	onSubmit,
	nonDismissable = true,
}: {
	modalVisible: boolean;
	setModalVisible: (visible: boolean) => void;
	onSubmit: (data: Partial<Account>) => void;
	nonDismissable?: boolean;
}) {
	const onSubmitCallback = useCallback(
		(data: Partial<Account>) => {
			onSubmit(data);
			setModalVisible(false);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<SheetModal
			{...generateTestIDs("add-account-sheet")}
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			presentationStyle="formSheet"
			nonDismissable={nonDismissable}
		>
			<View style={styles.content}>
				<AccountForm onSubmit={onSubmitCallback} />
			</View>
		</SheetModal>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
});
