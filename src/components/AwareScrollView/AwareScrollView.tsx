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
    <KeyboardAwareScrollView bottomOffset={50} {...rest}>
      {children}
    </KeyboardAwareScrollView>
  );
}
