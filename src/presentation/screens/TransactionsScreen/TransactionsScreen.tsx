import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import TransactionList from "@components/TransactionList/TransactionList";
import { useAccountsContext } from "@domain/providers/AccountsProvider";
import type { AppTabsParamList, AppTabsScreens } from "@presentation/navigators/AppTabs/AppTabs";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import MoneyFunctions from "@utils/MoneyFunctions";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import { DateTime } from "luxon";
import type { RefObject } from "react";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AlertButton, SectionList } from "react-native";
import { Alert, Button } from "react-native";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

type ScreenProps = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Transactions>;

export const isExpenseTransaction = (
	transaction: Transaction
): transaction is Transaction<"expense"> => transaction.type === "expense";

export const isCreditTransaction = (
	transaction: Transaction
): transaction is Transaction<"credit"> => transaction.type === "credit";

export const calculateTotal = (account: Account) => {
	// current starting balance
	const total = 0;

	// reduce all transactions to get the total balance
	const transactionsTotal = [...(account?.transactions || [])].reduce((acc, transaction) => {
		if (isExpenseTransaction(transaction)) {
			return acc - transaction.amount;
		}
		if (isCreditTransaction(transaction)) {
			return acc + transaction.amount;
		}
		return acc;
	}, total);

	// get the current account balance
	const currentAccountBalance = account?.startingBalance || 0;

	// get the total balance in cents
	const centsTotalBalance = currentAccountBalance + (transactionsTotal || 0);

	// return the total balance in dollars as a formatted string
	return MoneyFunctions.formatMoney(centsTotalBalance, 2);
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

export default function TransactionsScreen({ navigation }: ScreenProps) {
	// state
	const [isListReady, setIsListReady] = useState(false);

	// refs
	const listRef = useRef<SectionList<Transaction>>(null);

	// hooks
	// const {openAccountModal} = useSheetModalContext();
	const {
		currentAccount,
		currentAccount: { transactions: currentAccountTransactions = [] } = {},
		deleteTransaction,
		deleteItem: removeAccount,
	} = useAccountsContext();

	const sectionsData = useMemo(() => {
		const expenses = currentAccountTransactions.filter(isExpenseTransaction);
		const credits = currentAccountTransactions.filter(isCreditTransaction);
		return groupTransactionsByDate(expenses, credits);
	}, [currentAccountTransactions]);

	useEffect(() => {
		const onFocus = async () => {
			setIsListReady(true);
			scrollToTop(sectionsData, listRef);
		};

		const unsubscribeOnFocus = navigation.addListener("focus", onFocus);
		return unsubscribeOnFocus;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [sectionsData]);

	// const promptToCreateAccount = useCallback(() => {
	// 	showAsyncAlertPrompt({
	// 		title: "Create Account",
	// 		message: "You don't have an account yet. Create one now to start tracking expenses!",
	// 		cancelable: false,
	// 	}).then(openAccountModal);
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, []);

	const handleDeleteTransaction = useCallback(
		(txnId: Transaction["id"]) =>
			showAsyncAlertPrompt({
				title: "Delete Transaction",
				message: "Are you sure you want to delete this transaction?",
				cancelable: true,
			}).then((shouldDelete) => {
				if (shouldDelete) {
					deleteTransaction(txnId, currentAccount?.id as `acct_${string}`).catch(
						(error) =>
							console.error("[TransactionsScreen] Error deleting transaction:", error)
					);
				}
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[currentAccount?.id]
	);

	const screenTitleBalance = useMemo(() => {
		if (!currentAccount) {
			return "No account";
		}
		return `Balance: ${calculateTotal(currentAccount)}`;
	}, [currentAccount]);

	return (
		<SharedAccountScreen {...generateTestIDs("transactions-screen")}>
			{__DEV__ && (
				<Button
					title="Remove Account"
					onPress={() => {
						removeAccount(currentAccount?.id as `acct_${string}`).catch((error) =>
							console.error("[TransactionsScreen] Error removing account:", error)
						);
					}}
					disabled={!currentAccount}
					{...generateTestIDs("remove-account-button")}
				/>
			)}
			<ScreenTitle title="Transactions" subtitle={screenTitleBalance} />
			<TransactionList
				ref={listRef}
				data={sectionsData}
				onPress={handleDeleteTransaction}
				onContentSizeChange={() => scrollToTop(sectionsData, listRef)}
				isListReady={isListReady}
			/>
		</SharedAccountScreen>
	);
}
