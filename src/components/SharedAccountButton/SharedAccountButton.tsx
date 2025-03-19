import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import type { TouchableOpacityProps } from "react-native";
import { StyleSheet, TouchableOpacity } from "react-native";

type SharedAccountButtonProps = {
  title: string;
  type?: keyof typeof styles;
} & TouchableOpacityProps;

export default function SharedAccountButton(props: SharedAccountButtonProps) {
  const { title, type = "primary", ...rest } = props;
  return (
    <TouchableOpacity style={styles[type]} activeOpacity={0.8} {...rest}>
      <SharedAccountText type="buttonTitle">{title}</SharedAccountText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  secondary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgb(46, 52, 54)",
    borderRadius: 8,
  },
  primary: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgb(106, 178, 193)",
    borderRadius: 8,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
});
