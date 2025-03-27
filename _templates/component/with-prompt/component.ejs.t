---
to: src/presentation/components/<%= message %>/<%= message %>.tsx
---
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import React from "react";
import { StyleSheet } from "react-native";

type <%= message %>Props = {
  // props here
};

const <%= message %> = (_: <%= message %>Props) => {
  return <SharedAccountText style={styles.text}><%= message %></SharedAccountText>;
};

const styles = StyleSheet.create({
  text: {
    color: colors.dark,
    fontSize: 24,
  },
});

export default <%= message %>;
