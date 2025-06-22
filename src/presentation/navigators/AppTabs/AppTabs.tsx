import PlusSvgIcon from "@assets/svg/plus-svgrepo-com.svg";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";
import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import CircleButton from "@components/CircleButton/CircleButton";
import { useAccountsContext } from "@domain/providers/AccountsProvider";
import { useSheetModalContext } from "@domain/providers/SheetModalProvider";
import { useTransactionsContext } from "@domain/providers/TransactionsProvider";
import styles from "@navigators/AppTabs/AppTabs.style";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { RouteProp } from "@react-navigation/native";
import { useTheme } from "@react-navigation/native";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";
import TransactionsScreen from "@screens/TransactionsScreen/TransactionsScreen";
import type { BoundState } from "@stores/zustand/useStore";
import { useStore } from "@stores/zustand/useStore";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { useCallback, useMemo, useRef } from "react";
import { Alert, View, type SectionList } from "react-native";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

const ICON_SIZE = 20;

export enum AppTabsScreens {
	Transactions = "TransactionsScreen",
	Settings = "SettingsScreen",
}

export type AppTabsParamList = { [key in AppTabsScreens]: undefined };

type TabRoute = RouteProp<AppTabsParamList, AppTabsScreens>;

const screenOptions = (_params: { route: TabRoute }): BottomTabNavigationOptions => ({
	headerShown: false,
	headerStyle: { display: "none" }, // Hide the default header
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

const selectCurrentAccountID = (state: BoundState) => state.account?.account?.id;
const selectUserId = (state: BoundState) => state.user?.userId;

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

	const currentAccountID = useStore(selectCurrentAccountID);

	const theme = useTheme();

	const { addItem: addAccount } = useAccountsContext();
	const { addItem: addTransaction, categoryPills = [] } = useTransactionsContext();
	const userId = useStore(selectUserId);

	// callbacks
	const handleCreateTransaction = useCallback(
		async (params: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => {
			if (!currentAccountID) {
				console.warn("[AppTabs] No current account");
				return;
			}
			if (!userId) {
				console.warn("[AppTabs] No user ID");
				return;
			}
			try {
				const paramsWithDefaults: Partial<Transaction> & {
					sharedAccountId: string;
					userId: string;
				} = {
					...params,
					sharedAccountId: currentAccountID,
					userId,
				};
				if (!paramsWithDefaults.userId || !paramsWithDefaults.sharedAccountId) {
					throw new Error(
						"[TransactionsScreen] Missing userId or sharedAccountId in transaction parameters"
					);
				}
				paramsWithDefaults.userId = userId;
				await addTransaction(paramsWithDefaults)
					.then(() => {
						Alert.alert("Transaction added successfully");
						closeTransactionModal();
					})
					.catch((error) => {
						console.error("[TransactionsScreen] Error adding transaction:", error);
						Alert.alert("Error", "Failed to add transaction. Please try again.");
					});
			} catch (error) {
				console.error("[TransactionsScreen] Error adding transaction:", error);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccountID]
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
				categoryPills={categoryPills}
			/>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transactionModalVisible, categoryPills]
	);

	const handleCreateAccount = useCallback(
		(data: Partial<Account>) => {
			addAccount(data)
				.then(() => {
					Alert.alert("Account created successfully");
					closeAccountModal();
				})
				.catch((error) => {
					console.error("[AppTabs] Error creating account:", error);
					Alert.alert("Error", "Failed to create account. Please try again.");
				});
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
						color={theme.colors.background}
						width={ICON_SIZE}
						height={ICON_SIZE}
					/>
				),
				onPress: !currentAccountID ? openAccountModal : openTransactionModal,
				disabled: false,
				backgroundColor: theme.colors.primary,
			},
		],

		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccountID, theme]
	);

	return (
		<>
			<Tab.Navigator
				initialRouteName={AppTabsScreens.Transactions}
				screenOptions={screenOptions}
			>
				<Tab.Screen name={AppTabsScreens.Transactions} component={TransactionsScreen} />
				<Tab.Screen
					name={AppTabsScreens.Settings}
					component={SettingsScreen}
					options={{
						tabBarStyle: { display: "none" }, // Hide the default tab bar for Settings
					}}
				/>
			</Tab.Navigator>
			<View {...generateTestIDs("add-account-button-view")} style={styles.buttonBar}>
				{btnList.map(mapBtnFromList)}
			</View>
			{addExpenseSheet}
			{addAccountSheet}
		</>
	);
};

export default AppTabs;
