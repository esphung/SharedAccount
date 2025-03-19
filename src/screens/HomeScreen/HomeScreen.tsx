import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import type {
  RootStackParamList,
  RootStackScreens,
} from "@navigators/RootStack/RootStack";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = NativeStackScreenProps<RootStackParamList, RootStackScreens.Home>;

export default function HomeScreen(_: Props) {
  return (
    <View style={styles.container}>
      <SharedAccountText>HomeScreen</SharedAccountText>
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
