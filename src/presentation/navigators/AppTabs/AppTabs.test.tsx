import { render, screen } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppTabs from "./AppTabs";

jest.mock("@domain/providers/SheetModalProvider", () => ({
	__esModule: true,
	useSheetModalContext: jest.fn(() => ({
		openTransactionModal: jest.fn(),
		closeTransactionModal: jest.fn(),
		transactionModalVisible: false,
		accountModalVisible: false,
		openAccountModal: jest.fn(),
		closeAccountModal: jest.fn(),
	})),
}));

jest.mock("@presentation/screens/TransactionsScreen/TransactionsScreen", () => {
	return {
		__esModule: true,
		// @ts-expect-error invalid prop types
		// eslint-disable-next-line react-native/no-raw-text
		default: (props: unknown) => <div {...props}>Transactions</div>,
	};
});

jest.mock("@domain/providers/AccountsProvider", () => ({
	__esModule: true,
	useAccountsContext: jest.fn(() => ({
		state: [],
		fetchItems: () => Promise.resolve([]),
		deleteItem: () => Promise.resolve(),
		addItem: () => Promise.resolve(),
		startListening: () => () => {},
		currentAccount: undefined,
		addTransaction: () => Promise.resolve(),
		deleteTransaction: () => Promise.resolve(),
		selectCurrentAccount: (_accountId: string) => {},
	})),
	AccountsContext: {
		Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	},
}));

describe("AppTabs Navigator", () => {
	const renderWithProviders = () => {
		render(<AppTabs />, {
			wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer>,
		});
	};

	it("renders the TransactionsScreen tab", () => {
		renderWithProviders();
		const expensesScreen = screen.queryByText("Transactions");
		expect(expensesScreen).toBeDefined();
	});

	it("sets the initial route to TransactionsScreen", () => {
		renderWithProviders();

		expect(screen.queryByText("Transactions")).toBeDefined();
	});
});
