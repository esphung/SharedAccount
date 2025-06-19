import colors from "@config/themes/colors";
import SharedAccountText from "@presentation/components/SharedAccountText/SharedAccountText";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

type Option = {
	id: number;
	label: string;
};

type SingleSelectPillsProps = {
	options?: Option[];
	selected: string;
	onChange: (selected: string) => void;
	disabled?: boolean;
};

const SingleSelectPills = ({
	disabled = false,
	options = [],
	selected,
	onChange,
}: SingleSelectPillsProps) => {
	return (
		<View style={styles.scrollView}>
			<View style={styles.content}>
				<FlatList
					showsHorizontalScrollIndicator={false}
					nestedScrollEnabled
					data={options}
					horizontal
					keyExtractor={({ id }) => id.toString()}
					renderItem={({ item: { id, label } }) => (
						<TouchableOpacity
							disabled={disabled}
							key={id}
							onPress={() => onChange(label)}
							style={[
								styles.item,
								{
									backgroundColor:
										selected === label ? colors.primary : colors.light,
									borderWidth: StyleSheet.hairlineWidth,
									borderColor: selected === label ? colors.primary : colors.light,
								},
							]}
						>
							<SharedAccountText
								style={{
									color: selected === label ? colors.light : colors.dark,
								}}
							>
								{label}
							</SharedAccountText>
						</TouchableOpacity>
					)}
				/>
			</View>
		</View>
	);
};

export default SingleSelectPills;

const styles = StyleSheet.create({
	content: {
		flexDirection: "row",
		gap: 8,
	},
	item: {
		borderRadius: 20,
		marginHorizontal: 4,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	scrollView: {
		padding: 8,
	},
});
