// src/presentation/components/FullScreenSpinner/FullScreenSpinner.tsx
import colors from "@config/themes/colors";
import React from "react";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type FullscreenSpinnerProps = {
  visible: boolean;
};

const FullscreenSpinner: React.FC<FullscreenSpinnerProps> = ({ visible }) => {
  return (
    <Modal transparent animationType="fade" visible={visible} statusBarTranslucent>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: "center",
    opacity: 0.1,
  },
});

export default FullscreenSpinner;
