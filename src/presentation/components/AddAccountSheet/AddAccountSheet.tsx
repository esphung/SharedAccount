import AccountForm from "@components/AccountForm/AccountForm";
import SheetModal from "@components/SheetModal/SheetModal";
import React from "react";
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
	return (
		<SheetModal
			testID="add-account-sheet"
			modalVisible={modalVisible}
			setModalVisible={setModalVisible}
			presentationStyle="formSheet"
			nonDismissable={nonDismissable}
		>
			<View style={styles.content}>
				<AccountForm
					onSubmit={(data) => {
						onSubmit(data);
						setModalVisible(false);
					}}
				/>
			</View>
		</SheetModal>
	);
}

const styles = StyleSheet.create({
	content: {
		flex: 1,
	},
});
