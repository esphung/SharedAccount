import type { PickerProps } from "@react-native-picker/picker";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import type { ViewStyle } from "react-native";
import { StyleSheet, View } from "react-native";

type DropdownPickerProps = {
	items: { label: string; value: string }[];
	onChange: (value: string) => void;
	selectedValue: string;
	containerStyle?: ViewStyle;
} & PickerProps;

const DropdownPicker = (props: DropdownPickerProps) => {
	const { selectedValue, items, onChange, containerStyle, ...rest } = props;
	return (
		<View style={containerStyle}>
			<Picker
				itemStyle={styles.itemStyle}
				selectedValue={selectedValue}
				onValueChange={onChange}
				{...rest}
			>
				{items.map((item) => (
					<Picker.Item key={item.value} label={item.label} value={item.value} />
				))}
			</Picker>
		</View>
	);
};

const styles = StyleSheet.create({
	itemStyle: {
		fontSize: 16,
		fontWeight: "400",
	},
});

export default DropdownPicker;
