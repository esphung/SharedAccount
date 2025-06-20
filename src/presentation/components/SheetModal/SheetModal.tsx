import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import type { ModalProps } from "react-native";
import { Modal, StyleSheet, View } from "react-native";

const SheetModal = (
	props: {
		children?: React.ReactNode;
		modalVisible: boolean;
		setModalVisible: (modalVisible: boolean) => void;
		onDismiss?: () => void;
		testID?: string;
		nonDismissable?: boolean;
	} & ModalProps
) => {
	const {
		testID,
		children,
		presentationStyle = "formSheet",
		modalVisible,
		setModalVisible,
		onDismiss,
		nonDismissable,
		...rest
	} = props;
	return (
		<Modal
			testID={testID}
			animationType="slide"
			visible={modalVisible}
			onRequestClose={() => {
				// Called on drag gesture (iOS) or hardware back button press (Android)
				setModalVisible(!modalVisible);
			}}
			onDismiss={() => {
				setModalVisible(false);
				onDismiss?.();
			}}
			presentationStyle={presentationStyle}
			// Prevent dismiss if nonDismissable is true
			{...(nonDismissable && {
				onRequestClose: () => {},
				hardwareAccelerated: true,
			})}
			{...rest}
		>
			{/* Sheet Header */}
			<View>
				<View style={styles.headerContainer}>
					{!nonDismissable && (
						// <Button title="Close" onPress={() => setModalVisible(false)} />
						<SharedAccountText
							type="link"
							onPress={() => setModalVisible(false)}
							style={styles.closeButtonPadding}
						>
							Close
						</SharedAccountText>
					)}
				</View>
			</View>
			{children}
		</Modal>
	);
};

const styles = StyleSheet.create({
	closeButtonPadding: {
		paddingLeft: 12,
		paddingTop: 16,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "flex-start",
		paddingHorizontal: 4,
		paddingTop: 4,
	},
});

export default SheetModal;
