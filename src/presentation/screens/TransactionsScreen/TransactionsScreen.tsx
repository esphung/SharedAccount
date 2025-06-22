import AccountsList from "@components/AccountsList/AccountsList";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import { useAccountsContext } from "@domain/providers/AccountsProvider";
import { useSheetModalContext } from "@domain/providers/SheetModalProvider";
import { useTransactionsContext } from "@domain/providers/TransactionsProvider";
import { selectCurrentAccount } from "@domain/stores/zustand/selectors";
import { useStore } from "@domain/stores/zustand/useStore";
import type { AppTabsParamList } from "@presentation/navigators/AppTabs/AppTabs";
import { AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import MoneyFunctions from "@utils/MoneyFunctions";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import { DateTime } from "luxon";
import type { RefObject } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlertButton, SectionList } from "react-native";
import { Alert } from "react-native";
import type { Transaction } from "types/Transaction";

export const isExpenseTransaction = (
	transaction: Transaction
): transaction is Transaction<"expense"> => transaction.type === "expense";

export const isCreditTransaction = (
	transaction: Transaction
): transaction is Transaction<"credit"> => transaction.type === "credit";

export const calculateTotal = ({
	transactions = [],
	startingBalance = 0,
}: {
	transactions: Transaction[];
	startingBalance: number;
}): number => {
	// Calculate total starting with the starting balance (in cents)
	const totalInCents = transactions.reduce((acc, transaction) => {
		if (isExpenseTransaction(transaction)) {
			return acc - transaction.amount;
		} else if (isCreditTransaction(transaction)) {
			return acc + transaction.amount;
		}
		return acc;
	}, startingBalance);

	// Format as currency (assuming amounts are stored in cents)
	// return MoneyFunctions.formatMoney(totalInCents, 2);

	return totalInCents; // Convert cents to dollars
};

export const groupTransactionsByDate = (expenses: Transaction[], credits: Transaction[]) => {
	const transactions = [...expenses, ...credits];
	const grouped: Record<string, Transaction[]> = {};

	transactions.forEach((transaction) => {
		const dateKey = new Date(transaction.date).toDateString();
		grouped[dateKey] = grouped[dateKey] || [];
		grouped[dateKey].push(transaction);
	});

	return Object.entries(grouped)
		.map(([title, data]) => ({
			title,
			data: data.sort(
				(a, b) =>
					DateTime.fromJSDate(b.date).toMillis() - DateTime.fromJSDate(a.date).toMillis()
			),
		}))
		.sort(
			(a, b) =>
				DateTime.fromJSDate(new Date(b.title)).toMillis() -
				DateTime.fromJSDate(new Date(a.title)).toMillis()
		);
};

export const showAsyncAlertPrompt = ({
	title = "Delete Transaction",
	message = "Are you sure?",
	cancelable = true,
}: {
	title?: string;
	message?: string;
	cancelable?: boolean;
}): Promise<boolean> => {
	return new Promise((resolve) => {
		const buttons: AlertButton[] = [
			{
				text: "Cancel",
				style: "cancel",
				onPress: () => resolve(false),
			},
			{
				text: "OK",
				style: "default",
				onPress: () => resolve(true),
			},
		];
		if (!cancelable) {
			buttons.shift();
		}
		return Alert.alert(title, message, buttons);
	});
};

const scrollToTop = (
	data: { title: string; data: Transaction[] }[],
	ref: RefObject<SectionList<Transaction> | null>
) => {
	if (!!data && data?.length && ref?.current) {
		ref.current.scrollToLocation({
			itemIndex: 0,
			sectionIndex: 0,
			animated: true,
			viewPosition: 0,
			viewOffset: 0,
		});
	}
};

// TODO: Replace with actual user data fetching logic
const users: { avatar: string; id: string }[] = [
	{ avatar: "https://picsum.photos/200/300", id: "usr_1" },
	{ avatar: "https://picsum.photos/200/300", id: "usr_2" },
];

export default function TransactionsScreen({
	navigation,
}: BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Transactions>) {
	// context
	const { state: transactionsState, deleteItem: deleteTransaction } = useTransactionsContext();
	const { state: accounts } = useAccountsContext();
	const { openAccountModal } = useSheetModalContext();

	// store
	const currentAccount = useStore(selectCurrentAccount);

	// state
	const [isListReady, setIsListReady] = useState(false);

	// refs
	const listRef = useRef<SectionList<Transaction>>(null);

	// TODO: Replace with actual transactions fetching logic
	const accountTransactions: Transaction[] = useMemo(() => {
		if (!currentAccount) {
			return [];
		}
		// Filter transactions for the current shared account
		if (!transactionsState || !Array.isArray(transactionsState) || !transactionsState.length) {
			return [];
		}
		return transactionsState.filter((txn) => txn.sharedAccountId === currentAccount?.id);
	}, [currentAccount, transactionsState]);

	const sectionsData = useMemo(() => {
		const expenses = accountTransactions.filter(isExpenseTransaction);
		const credits = accountTransactions.filter(isCreditTransaction);
		return groupTransactionsByDate(expenses, credits);
	}, [accountTransactions]);

	useEffect(() => {
		const onFocus = async () => {
			setIsListReady(true);
			scrollToTop(sectionsData, listRef);
		};

		const unsubscribeOnFocus = navigation.addListener("focus", onFocus);
		return unsubscribeOnFocus;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sectionsData]);

	const handleDeleteTransaction = useCallback(
		(txnId: Transaction["id"]) =>
			showAsyncAlertPrompt({
				title: "Delete Transaction",
				message: "Are you sure you want to delete this transaction?",
				cancelable: true,
			}).then((shouldDelete) => {
				if (shouldDelete) {
					// Implement the delete transaction logic here
					deleteTransaction(txnId)
						.then(() => {
							Alert.alert("Transaction deleted successfully");
						})
						.catch((error) => {
							// Handle any errors that occur during deletion
							console.error("Error deleting transaction:", error);
						});
				}
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[]
	);

	const screenTitleBalance = useMemo(() => {
		if (!currentAccount) {
			return "No account";
		}
		const balance = calculateTotal({
			transactions: accountTransactions,
			startingBalance: currentAccount.startingBalance,
		});

		return `Balance: ${MoneyFunctions.formatMoney(balance, 2)}`;
	}, [accountTransactions, currentAccount]);

	const processAccountsList = useMemo(() => {
		// calculate total balance for each account and add it to the account object
		const list = accounts.map((account) => ({
			...account,
			totalBalance: calculateTotal({
				transactions: accountTransactions.filter(
					(txn) => txn.sharedAccountId === account.id
				),
				startingBalance: account.startingBalance,
			}),
		}));

		return list;
	}, [accounts, accountTransactions]);

	const handlePressAccount = useCallback((accountId: string) => {
		console.info("[TransactionsScreen] Pressed account:", accountId);
	}, []);

	return (
		<SharedAccountScreen {...generateTestIDs("transactions-screen")}>
			<ScreenTitle
				title="Transactions"
				subtitle={screenTitleBalance}
				onPressRightSide={() => {
					navigation.navigate(AppTabsScreens.Settings);
				}}
			/>
			<AccountsList
				accounts={processAccountsList}
				onPressAccount={handlePressAccount}
				onPressAddAccount={openAccountModal}
			/>
			<TransactionList
				ref={listRef}
				data={sectionsData}
				onPress={handleDeleteTransaction}
				onContentSizeChange={() => scrollToTop(sectionsData, listRef)}
				isListReady={isListReady}
				users={users}
			/>
		</SharedAccountScreen>
	);
}
