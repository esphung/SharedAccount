import { DEFAULT_EXTRA_KEYBOARD_SPACE, DEFAULT_KEYBOARD_BOTTOM_OFFSET } from "@constants/layout";
import styles from "@presentation/components/AwareScrollView/AwareScrollView.style";
import React from "react";
import type { KeyboardAvoidingViewProps } from "react-native-keyboard-controller";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

export default function AwareScrollView({
  children,
  ...rest
}: {
  children: React.ReactNode;
} & KeyboardAvoidingViewProps) {
  return (
    <KeyboardAwareScrollView
      bottomOffset={DEFAULT_KEYBOARD_BOTTOM_OFFSET} // Adjust this value as needed
      keyboardShouldPersistTaps="always"
      {...rest}
      style={styles.fill} // Ensure the scroll view takes up the full height
      contentContainerStyle={styles.contentContainerStyle} // Allow content to grow
      extraKeyboardSpace={DEFAULT_EXTRA_KEYBOARD_SPACE} // Adjust this value as needed
    >
      {children}
    </KeyboardAwareScrollView>
  );
}
