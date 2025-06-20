import type { ReactNode } from "react";
import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

// Define the shape of the context
type SheetModalContextType = {
	transactionModalVisible: boolean;
	openTransactionModal: () => void;
	closeTransactionModal: () => void;
	accountModalVisible: boolean;
	openAccountModal: () => void;
	closeAccountModal: () => void;
};

// Create the context with default undefined value
const SheetModalContext = createContext<SheetModalContextType | undefined>(undefined);

// Provider component
export const SheetModalProvider = ({ children }: { children: ReactNode }) => {
	const [transactionModalVisible, setTransactionModalVisible] = useState(false);
	const [accountModalVisible, setAccountModalVisible] = useState(false);

	const openTransactionModal = useCallback(() => {
		setTransactionModalVisible(true);
	}, []);

	const closeTransactionModal = useCallback(() => {
		setTransactionModalVisible(false);
	}, []);

	const openAccountModal = useCallback(() => {
		setAccountModalVisible(true);
	}, []);

	const closeAccountModal = useCallback(() => {
		setAccountModalVisible(false);
	}, []);

	const memoizedValue = useMemo(
		() => ({
			accountModalVisible,
			transactionModalVisible,
			openTransactionModal,
			closeTransactionModal,
			openAccountModal,
			closeAccountModal,
		}),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[transactionModalVisible, accountModalVisible]
	);

	return (
		<SheetModalContext.Provider value={memoizedValue}>{children}</SheetModalContext.Provider>
	);
};

// Custom hook for consuming the context
export const useSheetModalContext = () => {
	const context = useContext(SheetModalContext);
	if (!context) {
		throw new Error("useSheetModalContext must be used within a SheetModalProvider");
	}
	return context;
};
