import PlusSvgIcon from "@assets/svg/plus-svgrepo-com.svg";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";
import AddExpenseSheet from "@components/AddExpenseSheet/AddExpenseSheet";
import CircleButton from "@components/CircleButton/CircleButton";
import colors from "@config/themes/colors";
import {useAccountsContext} from "@domain/providers/AccountsProvider";
import {useSheetModalContext} from "@domain/providers/SheetModalProvider";
import styles from "@navigators/AppTabs/AppTabs.style";
import {handleCatchError} from "@presentation/utilities";
import type {BottomTabNavigationOptions} from "@react-navigation/bottom-tabs";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import type {RouteProp} from "@react-navigation/native";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import TransactionsScreen from "@screens/TransactionsScreen/TransactionsScreen";
import {generateTestIDs} from "@utils/testUtils/generateTestIDs";
import React, {useCallback, useMemo, useRef} from "react";
import {Alert, View, type SectionList} from "react-native";
import type {Account} from "types/Account";
import type {Transaction} from "types/Transaction";

const ICON_SIZE = 24;

export enum AppTabsScreens {
	Home = "HomeScreen",
	Transactions = "TransactionsScreen",
}

export type AppTabsParamList = {[key in AppTabsScreens]: undefined};

type TabRoute = RouteProp<AppTabsParamList, AppTabsScreens>;

const screenOptions = (_params: {route: TabRoute}): BottomTabNavigationOptions => ({
	headerShown: false,
	tabBarStyle: {display: "none"}, // Hide the default tab bar
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
	index: number,
) => (
	<CircleButton
		key={index}
		{...generateTestIDs(`add-btn-${index}`, "button")}
		onPress={onPress}
		style={styles.circularBtnStyle}
		disabled={disabled}>
		{icon}
	</CircleButton>
);

// component
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

	const {addItem: addAccount, currentAccount, addTransaction} = useAccountsContext();

	// memoized values
	const Tab = useMemo(() => createBottomTabNavigator<AppTabsParamList>(), []);

	// callbacks
	const handleSetTransactionModalVisible = useCallback(
		(shouldShow: boolean) => {
			if (!shouldShow) {
				closeTransactionModal();
			} else {
				openTransactionModal();
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const handleSetAccountModalVisible = useCallback((shouldShow: boolean) => {
		if (!shouldShow) {
			closeAccountModal();
		} else {
			openAccountModal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleCreateTransaction = useCallback(
		async (params: Pick<Transaction, "amount" | "category" | "date" | "type" | "name">) => {
			if (!currentAccount?.id) {
				console.warn("[TransactionsScreen] No current account");
				return;
			}
			try {
				await addTransaction(params, currentAccount?.id)
					.then(() => closeTransactionModal())
					.catch(handleCatchError("addTransaction"));
			} catch (error) {
				console.error("[TransactionsScreen] Error adding transaction:", error);
			}
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccount?.id],
	);

	const addExpenseSheet = useMemo(
		() => (
			<AddExpenseSheet
				listRef={listRef}
				modalVisible={transactionModalVisible}
				setModalVisible={handleSetTransactionModalVisible}
				onSubmit={handleCreateTransaction}
			/>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transactionModalVisible],
	);

	const handleCreateAccount = useCallback(
		(data: Partial<Account>) => {
			addAccount({...data, transactions: []})
				.then(() => {
					Alert.alert("Account created successfully");
					closeAccountModal();
				})
				.catch(handleCatchError("createAccount"));
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const addAccountSheet = useMemo(
		() => (
			<AddAccountSheet
				modalVisible={accountModalVisible}
				setModalVisible={handleSetAccountModalVisible}
				onSubmit={handleCreateAccount}
				nonDismissable
			/>
		),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[accountModalVisible],
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
		[currentAccount?.id],
	);

	return (
		<>
			<Tab.Navigator initialRouteName={AppTabsScreens.Transactions} screenOptions={screenOptions}>
				<Tab.Screen name={AppTabsScreens.Transactions} component={TransactionsScreen} />
				<Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
			</Tab.Navigator>
			<View style={styles.buttonBar}>{btnList.map(mapBtnFromList)}</View>
			{addExpenseSheet}
			{addAccountSheet}
		</>
	);
};

export default AppTabs;
