import ScreenTitle from "@components/ScreenTitle/ScreenTitle";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import useAccounts from "@hooks/useAccounts";
import { calculateTotal } from "@screens/TransactionsScreen/TransactionsScreen";
import React, { useEffect, useMemo } from "react";

const HomeScreen = () => {
  const { fetchItems: fetchAccounts, currentAccount, startListening: startAccountsListening } = useAccounts();

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

  return (
    <SharedAccountScreen>
      <ScreenTitle title="Home" subtitle={screenTitleBalance} />
    </SharedAccountScreen>
  );
};

export default HomeScreen;
