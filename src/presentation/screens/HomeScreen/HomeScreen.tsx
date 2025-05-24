import AccountList from "@components/AccountList/AccountList";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import {useAccountsContext} from "@domain/providers/AccountsProvider";
import {useSheetModalContext} from "@domain/providers/SheetModalProvider";
import {handleCatchError} from "@presentation/utilities";
import {calculateTotal} from "@screens/TransactionsScreen/TransactionsScreen";
import React, {useCallback, useMemo} from "react";
import {Alert, Button} from "react-native";

import type {Account} from "types/Account";

const HomeScreen = () => {
	const {
		state: accounts,
		addItem: addAccount,
		currentAccount,
		selectCurrentAccount,
		deleteItem: deleteAccount,
	} = useAccountsContext();

	const {accountModalVisible, openAccountModal, closeAccountModal} = useSheetModalContext();

	// state
	// const [accountModalVisible, setAccountModalVisible] = useState(false);

	const screenTitleBalance = useMemo(() => {
		if (!currentAccount) {
			return "No account";
		}
		return `Balance: ${calculateTotal(currentAccount)}`;
	}, [currentAccount]);

	const handleCreateAccount = useCallback(
		(data: Partial<Account>) =>
			addAccount({...data, transactions: []}).catch(handleCatchError("HomeScreen:handleCreateAccount")),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[],
	);

	const onPressRemoveCallback = useCallback((acct: Account) => {
		Alert.alert("Remove account", "Are you sure?", [
			{text: "Cancel", style: "cancel"},
			{
				text: "OK",
				onPress: () =>
					deleteAccount(acct.id).catch(handleCatchError("HomeScreen:handleRemoveAccount")),
			},
		]);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<SharedAccountScreen>
			<ScreenTitle title="Home" subtitle={screenTitleBalance} />
			<Button title="Add an account" onPress={openAccountModal} />
			<AccountList
				accounts={accounts}
				onPress={selectCurrentAccount}
				selectedAccount={currentAccount}
				onPressRemove={onPressRemoveCallback}
			/>
			<AddAccountSheet
				modalVisible={accountModalVisible}
				setModalVisible={(bool) => {
					if (bool) {
						openAccountModal();
					} else {
						closeAccountModal();
					}
				}}
				onSubmit={handleCreateAccount}
				nonDismissable={false}
			/>
		</SharedAccountScreen>
	);
};

export default HomeScreen;
