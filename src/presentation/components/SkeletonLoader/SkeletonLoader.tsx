import colors from "@config/themes/colors";
import React from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";

type SkeletonLoaderProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: object;
};

export default function SkeletonLoader({ width = "100%", height = 20, borderRadius = 8, style }: SkeletonLoaderProps) {
  const shimmerAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  return (
    <View testID="skeleton-loader" style={[styles.container, { width, height, borderRadius }, style]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            transform: [{ translateX }],
          },
          styles.skeleton,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.skeletonBg,
    overflow: "hidden",
  },
  skeleton: {
    backgroundColor: colors.skeleton,
    opacity: 0.5,
  },
});
