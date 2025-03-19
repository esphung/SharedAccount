import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <SharedAccountText>Hello World!</SharedAccountText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
