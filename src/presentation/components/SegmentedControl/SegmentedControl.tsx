import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, type ViewStyle } from "react-native";
import colors from "@config/themes/colors";
import SharedAccountText from "@presentation/components/SharedAccountText/SharedAccountText";

type SegmentedControlProps = {
	options: string[];
	selectedIndex?: number;
	onSelect: (index: number) => void;
	containerStyle?: ViewStyle;
};

const SegmentedControl: React.FC<SegmentedControlProps> = ({
	options,
	selectedIndex = 0,
	onSelect,
	containerStyle,
}) => {
	const [selected, setSelected] = useState(selectedIndex);

	const handlePress = useCallback((index: number) => {
		setSelected(index);
		onSelect(index);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const keyExtractor = useCallback((item: string, index: number) => `${item}-${index}`, []);

	const renderItem = useCallback(
		({ item, index }: { item: string; index: number }) => {
			const isSelected = selected === index;
			return (
				<TouchableOpacity
					onPress={() => handlePress(index)}
					style={[styles.option, isSelected && styles.selected]}
				>
					<SharedAccountText
						type="secondaryButtonTitle"
						numberOfLines={1}
						style={[styles.text, { color: isSelected ? colors.primary : colors.dark }]}
					>
						{item}
					</SharedAccountText>
				</TouchableOpacity>
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selected]
	);

	return (
		<FlatList
			data={options}
			horizontal
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={[styles.container, containerStyle]}
		/>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
	option: {
		alignItems: "center",
		borderColor: colors.secondary,
		borderRadius: 8,
		borderWidth: StyleSheet.hairlineWidth,
		justifyContent: "center",
		marginHorizontal: 2,
		maxWidth: 120,
		minHeight: 40,
		minWidth: 86,
		width: "100%",
	},
	selected: {
		borderColor: colors.primary,
		borderWidth: 1,
	},
	text: {
		textAlign: "center",
	},
});

export default SegmentedControl;
