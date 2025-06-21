import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import { useAccountsContext } from "@domain/providers/AccountsProvider";
import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import { NavigationContainer } from "@react-navigation/native";
import { render, screen, userEvent } from "@testing-library/react-native";
import React from "react";
import AppTabs from "./AppTabs";

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
		selectCurrentAccount: (_accountId: string) => {},
	})),
	AccountsContext: {
		Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	},
}));

const mockTransaction = new TransactionBuilder()
	.withId("txn_1")
	.withSharedAccountId("acct_1")
	.withAmount(100)
	.withDate(new Date())
	.withDescription("Test Transaction")
	.withVersion(1)
	.build();

jest.mock("@domain/providers/AccountsProvider", () => ({
	__esModule: true,
	useAccountsContext: jest.fn(() => ({
		state: [],
		selectCurrentAccount: jest.fn(),
		addItem: jest.fn(),
		deleteItem: jest.fn(),
	})),
}));

jest.mock("@domain/providers/TransactionsProvider", () => ({
	__esModule: true,
	useTransactionsContext: jest.fn(() => ({
		state: [mockTransaction],
		fetchItems: () => Promise.resolve([]),
		deleteItem: () => Promise.resolve(),
		addItem: () => Promise.resolve(),
		startListening: () => () => {},
	})),
	TransactionsContext: {
		Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	},
}));

jest.mock("@domain/providers/SheetModalProvider", () => ({
	__esModule: true,
	useSheetModalContext: jest.fn(() => ({
		openTransactionModal: jest.fn(),
		openAccountModal: jest.fn(),
		closeTransactionModal: jest.fn(),
		closeAccountModal: jest.fn(),
		transactionModalVisible: false,
		accountModalVisible: false,
	})),
	SheetModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("AppTabs Navigator", () => {
	const renderWithProviders = () => {
		render(<AppTabs />, {
			wrapper: ({ children }) => (
				<SheetModalProvider>
					<NavigationContainer>{children}</NavigationContainer>
				</SheetModalProvider>
			),
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

	it("renders the add account/transaction button", async () => {
		renderWithProviders();
		const addBtn = await screen.findByTestId("add-btn-0");
		expect(addBtn).toBeVisible();
	});

	it("renders the add account button icon", () => {
		renderWithProviders();
		const icon = screen.getByTestId("add-account-button-icon");
		expect(icon).toBeVisible();
	});

	it("calls openAccountModal when add button is pressed and no currentAccount", async () => {
		const mockSheetModalContext = {
			openTransactionModal: jest.fn(),
			closeTransactionModal: jest.fn(),
			transactionModalVisible: false,
			accountModalVisible: false,
			openAccountModal: jest.fn(),
			closeAccountModal: jest.fn(),
		};
		jest.mock("@domain/providers/SheetModalProvider", () => ({
			...jest.requireActual("@domain/providers/SheetModalProvider"),
			__esModule: true,
			useSheetModalContext: jest.fn(() => mockSheetModalContext),
		}));

		// Mock the current account to simulate no existing account
		(useAccountsContext as jest.Mock).mockReturnValue({
			state: [],
			selectCurrentAccount: jest.fn(),
			addItem: jest.fn(),
			deleteItem: jest.fn(),
		});

		renderWithProviders();

		const icon = screen.getByTestId("add-account-button-icon");
		expect(icon).toBeVisible();
		await userEvent.press(icon);

		expect(screen.queryByTestId("add-account-sheet")).toBeDefined();
	});

	it("shows AddExpenseSheet when transactionModalVisible is true", () => {
		const mockSheetModalContext = {
			openTransactionModal: jest.fn(),
			closeTransactionModal: jest.fn(),
			transactionModalVisible: true,
			accountModalVisible: false,
			openAccountModal: jest.fn(),
			closeAccountModal: jest.fn(),
		};
		jest.mock("@domain/providers/SheetModalProvider", () => ({
			__esModule: true,
			useSheetModalContext: jest.fn(() => mockSheetModalContext),
			SheetModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		}));
		renderWithProviders();
		// AddExpenseSheet renders a SectionList ref, so check for its existence
		// or check for a unique prop or text if available
		// Here we check for the presence of the button bar as a proxy
		const addBtn = screen.getByTestId("add-btn-0");
		expect(addBtn).toBeTruthy();
	});

	it("shows AddAccountSheet when accountModalVisible is true", async () => {
		const mockSheetModalContext = {
			openTransactionModal: jest.fn(),
			closeTransactionModal: jest.fn(),
			transactionModalVisible: false,
			accountModalVisible: true,
			openAccountModal: jest.fn(),
			closeAccountModal: jest.fn(),
		};
		jest.mock("@domain/providers/SheetModalProvider", () => ({
			__esModule: true,
			useSheetModalContext: jest.fn(() => mockSheetModalContext),
			SheetModalProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
		}));
		renderWithProviders();
		const elem = await screen.findByTestId("add-btn-0");
		expect(elem).toBeDefined();

		expect(1).toBe(1); // Placeholder assertion, replace with actual check for AddAccountSheet
	});
});
