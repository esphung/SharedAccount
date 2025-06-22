import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import colors from "@config/themes/colors";
import { padding } from "@presentation/constants/layout";
import MoneyFunctions from "@utils/MoneyFunctions";
import { trans } from "@utils/localization";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import type { Account } from "types/Account";

type ListAccount = {
	totalBalance: number;
	version?: number;
} & Account;

type Props = {
	accounts: ListAccount[];
	onPressAccount: (accountId: string) => void;
	onPressAddAccount: () => void;
	selectedAccountId?: string | null;
};

const LOWER_LIMIT_BALANCE_THRESHOLD = 1000; // Example threshold for low balance ($10.00)

const AccountsList: React.FC<Props> = ({
	accounts = [],
	onPressAccount,
	onPressAddAccount,
	selectedAccountId,
}) => {
	const renderItem = useCallback(
		({ item }: { item: ListAccount }) => (
			<TouchableOpacity
				disabled={selectedAccountId === item.id}
				style={[
					styles.itemContainer,
					selectedAccountId === item.id && styles.selectedItemContainer,
				]}
				{...generateTestIDs(`account-list-item-${item.id}`, "button")}
				onPress={() => onPressAccount(item.id)}
			>
				<View style={styles.header}>
					<SharedAccountText
						{...generateTestIDs(`account-list-item-${item.id}-name`, "text")}
					>
						{item.name}
					</SharedAccountText>
					<SharedAccountText
						{...generateTestIDs(`account-list-item-${item.id}-balance`, "text")}
						style={[
							styles.balance,
							{
								// Apply different styles based on the balance percentage
								color:
									item.totalBalance <= LOWER_LIMIT_BALANCE_THRESHOLD
										? colors.warning
										: colors.primary,
							},
						]}
						type="transactionType"
					>
						{MoneyFunctions.formatMoney(item.totalBalance, 2)}
					</SharedAccountText>
				</View>
			</TouchableOpacity>
		),
		[onPressAccount, selectedAccountId]
	);

	const keyExtractor = useCallback((item: ListAccount) => `account-list-item-${item.id}`, []);

	const ListEmptyComponent = useCallback(
		() => (
			<TouchableOpacity
				style={styles.itemContainer}
				{...generateTestIDs("accounts-list-empty-button", "button")}
				onPress={onPressAddAccount}
			>
				<View style={styles.header}>
					<SharedAccountText
						{...generateTestIDs("accounts-list-empty-text", "text")}
						type="listItemTitle"
					>
						{trans("TransactionsScreen.noTransactions")}
					</SharedAccountText>
				</View>
				<SharedAccountText
					style={styles.bottomLeftLabel}
					type="finePrint"
					{...generateTestIDs("accounts-list-empty-label", "text")}
				>
					{trans("TransactionsScreen.createAccount")}
				</SharedAccountText>
			</TouchableOpacity>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	return (
		<FlatList
			{...generateTestIDs("accounts-list-flatlist")}
			ListEmptyComponent={ListEmptyComponent}
			data={accounts}
			keyExtractor={keyExtractor}
			renderItem={renderItem}
			contentContainerStyle={styles.container}
			scrollEnabled={accounts.length > 1} // Enable scrolling if more than 3 accounts
		/>
	);
};

export default AccountsList;

const styles = StyleSheet.create({
	balance: {
		color: colors.primary,
	},
	bottomLeftLabel: {
		color: colors.black,
		fontSize: 12,
		marginTop: padding.screen.vertical.medium,
	},
	container: {
		padding: padding.screen.horizontal.xSmall,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	itemContainer: {
		backgroundColor: colors.lightBackground,
		borderColor: colors.lightBackground,
		borderRadius: 8,
		borderWidth: StyleSheet.hairlineWidth,
		elevation: 2,
		marginBottom: padding.screen.vertical.xSmall,
		padding: padding.screen.horizontal.small,
	},
	selectedItemContainer: {
		borderColor: colors.primary,
		borderWidth: 1,
		elevation: 4,
	},
});
