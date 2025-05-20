import AccountList from "@components/AccountList/AccountList";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";
import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import useAccounts from "@hooks/useAccounts";
import { calculateTotal } from "@screens/TransactionsScreen/TransactionsScreen";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Button } from "react-native";

import type { Account } from "types/Account";

const HomeScreen = () => {
  const {
    state: accounts,
    addItem: addAccount,
    fetchItems: fetchAccounts,
    currentAccount,
    startListening: startAccountsListening,
    selectCurrentAccount,
    deleteItem: deleteAccount,
  } = useAccounts();

  // state
  const [accountModalVisible, setAccountModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribeAccounts = startAccountsListening();
    return () => {
      unsubscribeAccounts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const screenTitleBalance = useMemo(() => {
    if (!currentAccount) {
      return "No account";
    }
    return `Balance: ${calculateTotal(currentAccount)}`;
  }, [currentAccount]);

  const handleCreateAccount = useCallback(
    (data: Partial<Account>) => {
      addAccount({ ...data, transactions: [] })
        .then(() => Alert.alert("Account created successfully"))
        .catch((error) => console.error("[TransactionsScreen] Error creating account:", error));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <SharedAccountScreen>
      <ScreenTitle title="Home" subtitle={screenTitleBalance} />
      <Button title="Add an account" onPress={() => setAccountModalVisible(true)} />
      <AccountList
        accounts={accounts}
        onPress={selectCurrentAccount}
        selectedAccount={currentAccount}
        onPressRemove={(acct: Account) => {
          Alert.alert("Remove account", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
              text: "OK",
              onPress: () => {
                deleteAccount(acct.id)
                  .then(() => Alert.alert("Account removed successfully"))
                  .catch((error) => console.error("[HomeScreen] Error removing account:", error));
              },
            },
          ]);
        }}
      />
      <AddAccountSheet
        modalVisible={accountModalVisible}
        setModalVisible={setAccountModalVisible}
        onSubmit={handleCreateAccount}
        nonDismissable={false}
      />
    </SharedAccountScreen>
  );
};

export default HomeScreen;
