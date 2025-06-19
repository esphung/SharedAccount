// import CheckMarkSvgIcon from "@assets/svg/dollar-svgrepo-com.svg";
import CircleMinusSvgIcon from "@assets/svg/circle-minus-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { calculateTotal } from "@screens/TransactionsScreen/TransactionsScreen";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import type { Account } from "types/Account";

type AccountListProps = {
	accounts: Account[];
	onPress: (account: Account) => void;
	selectedAccount?: Account;
	onPressRemove: (account: Account) => void;
};

const ICON_SIZE = 20;

const AccountList = ({ accounts, onPress, selectedAccount, onPressRemove }: AccountListProps) => {
	const onPressRemoveCallback = useCallback(
		(item: Account) => onPressRemove(item),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);
	const renderItem = useCallback(
		({ item }: { item: Account }) => {
			const total = calculateTotal(item);
			const isSelected = selectedAccount?.id === item.id;
			return (
				<TouchableOpacity
					{...generateTestIDs(`account-item-${item.id}`, "button")}
					disabled={!!isSelected}
					style={styles.item}
					onPress={() => onPress?.(item)}
					activeOpacity={0.7}
				>
					<View style={styles.centerItemPanel}>
						<SharedAccountText
							{...generateTestIDs(`account-item-name-${item.id}`, "text")}
						>
							{item.name}
						</SharedAccountText>
						<SharedAccountText
							{...generateTestIDs(`account-item-total-${item.id}`, "text")}
						>
							{total}
						</SharedAccountText>
					</View>
					<View
						style={{
							width: ICON_SIZE,
							height: ICON_SIZE,
						}}
					>
						{selectedAccount?.id === item.id && (
							<TouchableOpacity
								{...generateTestIDs(`account-item-remove-${item.id}`, "button")}
								onPress={() => onPressRemoveCallback(item)}
								activeOpacity={0.7}
							>
								<CircleMinusSvgIcon
									{...generateTestIDs(`account-item-icon-${item.id}`, "image")}
									width={ICON_SIZE}
									height={ICON_SIZE}
								/>
							</TouchableOpacity>
						)}
					</View>
				</TouchableOpacity>
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[selectedAccount]
	);

	const keyExtractorCallback = useCallback((item: Account) => `${item.id}`, []);

	return <FlatList data={accounts} keyExtractor={keyExtractorCallback} renderItem={renderItem} />;
};

const styles = StyleSheet.create({
	centerItemPanel: {
		flex: 1,
		flexDirection: "row",
		gap: 8,
		justifyContent: "space-between",
		marginLeft: 8,
		marginRight: 8,
	},
	item: {
		alignItems: "center",
		borderWidth: 1,
		flexDirection: "row",
		marginBottom: 12,
		marginHorizontal: 16,
		paddingHorizontal: 12,
		paddingVertical: 16,
	},
});

export default AccountList;
