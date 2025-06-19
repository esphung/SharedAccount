import React, { useCallback, useEffect, useRef } from "react";
import { Animated } from "react-native";

const FadeInView = ({
	children,
	initialValue = 0,
	animate = false,
}: {
	children: React.ReactNode;
	initialValue: 0 | 1;
	animate?: boolean;
}) => {
	const fadeAnim = useRef(new Animated.Value(initialValue)).current;

	// method to start the animation
	const startAnimation = useCallback(() => {
		Animated.timing(fadeAnim, {
			toValue: initialValue === 0 ? 1 : 0,
			duration: 700,
			useNativeDriver: true,
		}).start();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialValue]);

	// start the animation when the component mounts
	useEffect(() => {
		if (animate) {
			startAnimation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [animate]);

	return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>;
};

export default FadeInView;
