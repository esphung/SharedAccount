import React from "react";
import type { ModalProps } from "react-native";
import { Button, Modal, StyleSheet, View } from "react-native";

const SheetModal = (
  props: {
    children?: React.ReactNode;
    modalVisible: boolean;
    setModalVisible: (modalVisible: boolean) => void;
    onDismiss?: () => void;
  } & ModalProps,
) => {
  const { children, presentationStyle = "formSheet", modalVisible, setModalVisible, onDismiss, ...rest } = props;
  return (
    <Modal
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
      {...rest}
    >
      {/* Sheet Header */}
      <View>
        <View style={styles.headerContainer}>
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </View>
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 8,
    paddingTop: 8,
  },
});

export default SheetModal;
