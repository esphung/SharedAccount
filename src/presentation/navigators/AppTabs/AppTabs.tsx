import PlusSvgIcon from "@assets/svg/plus-svgrepo-com.svg";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";
import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import CircleButton from "@components/CircleButton/CircleButton";
import colors from "@config/themes/colors";
import { useAccountsContext } from "@domain/providers/AccountsProvider";
import { useSheetModalContext } from "@domain/providers/SheetModalProvider";
import { useTransactionsContext } from "@domain/providers/TransactionsProvider";
import styles from "@navigators/AppTabs/AppTabs.style";
import { handleCatchError } from "@presentation/utilities";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import TransactionsScreen from "@screens/TransactionsScreen/TransactionsScreen";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback, useMemo, useRef } from "react";
import { Alert, View, type SectionList } from "react-native";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

const ICON_SIZE = 24;

export enum AppTabsScreens {
	Transactions = "TransactionsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

type TabRoute = RouteProp<AppTabsParamList, AppTabsScreens>;

const screenOptions = (_params: { route: TabRoute }): BottomTabNavigationOptions => ({
	headerShown: false,
	tabBarStyle: { display: "none" }, // Hide the default tab bar
});

const mapBtnFromList = (
	{
		disabled,
		icon,
		onPress,
	}: {
		disabled: boolean;
		icon: React.ReactNode;
		onPress: () => void;
	},
	index: number
) => (
	<CircleButton
		key={index}
		{...generateTestIDs(`add-btn-${index}`, "button")}
		onPress={onPress}
		style={styles.circularBtnStyle}
		disabled={disabled}
	>
		{icon}
	</CircleButton>
);

const Tab = createBottomTabNavigator<AppTabsParamList>();

const AppTabs = () => {
	// refs
	const listRef = useRef<SectionList>(null);

	// hooks
	const {
		openTransactionModal,
		closeTransactionModal,
		transactionModalVisible,
		accountModalVisible,
		openAccountModal,
		closeAccountModal,
	} = useSheetModalContext();

	const { addItem: addAccount, currentAccount } = useAccountsContext();
	const { addItem: addTransaction } = useTransactionsContext();

	// callbacks
	const handleCreateTransaction = useCallback(
		async (params: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => {
			const userId = "usr_default"; // Replace with actual user ID logic
			if (!currentAccount?.id) {
				console.warn("[TransactionsScreen] No current account");
				return;
			}
			if (!userId) {
				console.warn("[TransactionsScreen] No user ID");
				return;
			}
			try {
				const paramsWithDefaults: Partial<Transaction> & {
					sharedAccountId: string;
					userId: string;
				} = {
					...params,
					sharedAccountId: currentAccount.id,
					userId,
				};
				await addTransaction(paramsWithDefaults)
					.then(() => {
						Alert.alert("Transaction added successfully");
						closeTransactionModal();
					})
					.catch(handleCatchError("addTransaction"));
			} catch (error) {
				console.error("[TransactionsScreen] Error adding transaction:", error);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccount?.id]
	);

	const addExpenseSheet = useMemo(
		() => (
			<AddExpenseSheet
				listRef={listRef}
				modalVisible={transactionModalVisible}
				setModalVisible={(shouldShow: boolean) => {
					if (!shouldShow) {
						closeTransactionModal();
					} else {
						openTransactionModal();
					}
				}}
				onSubmit={handleCreateTransaction}
			/>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transactionModalVisible]
	);

	const handleCreateAccount = useCallback(
		(data: Partial<Account>) => {
			addAccount(data)
				.then(() => {
					Alert.alert("Account created successfully");
					closeAccountModal();
				})
				.catch(handleCatchError("createAccount"));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const addAccountSheet = useMemo(
		() => (
			<AddAccountSheet
				modalVisible={accountModalVisible}
				setModalVisible={(shouldShow: boolean) => {
					if (!shouldShow) {
						closeAccountModal();
					} else {
						openAccountModal();
					}
				}}
				onSubmit={handleCreateAccount}
				nonDismissable
			/>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[accountModalVisible]
	);

	// Add a fourth button as needed
	const btnList: {
		icon: React.ReactNode;
		onPress: () => void;
		disabled: boolean;
	}[] = useMemo(
		() => [
			{
				icon: (
					<PlusSvgIcon
						{...generateTestIDs("add-account-button-icon", "image")}
						width={ICON_SIZE}
						height={ICON_SIZE}
						stroke={colors.primary}
						strokeWidth={2}
					/>
				),
				onPress: !currentAccount?.id ? openAccountModal : openTransactionModal,
				disabled: false,
			},
		],
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccount?.id]
	);

	return (
		<>
			<Tab.Navigator
				initialRouteName={AppTabsScreens.Transactions}
				screenOptions={screenOptions}
			>
				<Tab.Screen name={AppTabsScreens.Transactions} component={TransactionsScreen} />
			</Tab.Navigator>
			<View style={styles.buttonBar}>{btnList.map(mapBtnFromList)}</View>
			{addExpenseSheet}
			{addAccountSheet}
		</>
	);
};

export default AppTabs;
