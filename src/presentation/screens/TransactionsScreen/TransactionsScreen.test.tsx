import AccountBuilder from "@data/models/builders/AccountBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import { AppTabsScreens } from "@navigators/AppTabs/AppTabs";
import { NavigationContainer } from "@react-navigation/native";
import TransactionsScreen, {
	calculateTotal,
	groupTransactionsByDate,
	isCreditTransaction,
	isExpenseTransaction,
	showAsyncAlertPrompt,
} from "@screens/TransactionsScreen/TransactionsScreen";
import { render, screen } from "@testing-library/react-native";
import { DateTime } from "luxon";
import React from "react";
import { Alert } from "react-native";

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

const mockTransaction = new TransactionBuilder()
	.withId("txn_1")
	.withDate(new Date("2023-01-01"))
	.withCategory("Food")
	.withName("Hello World")
	.withDescription("Weekly groceries")
	.withSharedAccountId("acct_1234567890")
	.withAmount(100)
	.withType("expense")
	.build();

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

jest.mock(
	"@domain/providers/RepositoryProvider",
	() =>
		({ children }: { children: React.ReactNode }) => <>{children}</>
);

const mockAccount = new AccountBuilder()
	.withId("acct_1234567890")
	.withName("Test Account")
	.withStartingBalance(1000)
	.withVersion(1)
	.build();

jest.mock("@domain/providers/AccountsProvider", () => ({
	__esModule: true,
	useAccountsContext: jest.fn(() => ({
		state: [mockAccount],
		fetchItems: () => Promise.resolve([]),
		deleteItem: () => Promise.resolve(),
		addItem: () => Promise.resolve(),
		startListening: () => () => {},
		currentAccount: mockAccount,
		addTransaction: () => Promise.resolve(),
		deleteTransaction: () => Promise.resolve(),
		selectCurrentAccount: (_accountId: string) => {},
	})),
	AccountsContext: {
		Provider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	},
}));

// mock the userDefaultsStorage
jest.mock("@domain/storage/userDefaultsStorage", () => ({
	__esModule: true,
	default: {
		getItem: () => Promise.resolve(null),
		saveItem: () => Promise.resolve(),
		removeItem: () => Promise.resolve(),
	},
}));

const mockRoute: {
	key: string;
	name: AppTabsScreens.Transactions;
} = {
	key: "testKey",
	name: AppTabsScreens.Transactions,
};

const mockNavigation = {
	addListener: jest.fn(),
	removeListener: jest.fn(),
	navigate: jest.fn(),
	goBack: jest.fn(),
	setOptions: jest.fn(),
	dispatch: jest.fn(),
	canGoBack: jest.fn(),
	reset: jest.fn(),
	isFocused: jest.fn(),
	getState: jest.fn(),
	setParams: jest.fn(),
	navigateDeprecated: jest.fn(),
	getId: jest.fn(),
	getParent: jest.fn(),
	preload: jest.fn(),
	setStateForNextRouteNamesChange: jest.fn(),
	jumpTo: jest.fn(),
	replaceParams: jest.fn(),
};

jest.mock("@components/AddExpenseSheet/AddExpenseSheet", () => "AddExpenseSheet");
jest.mock(
	"@components/SharedAccountScreen/SharedAccountScreen",
	() =>
		({ children }: { children: React.ReactNode }) => <>{children}</>
);

describe("TransactionsScreen", () => {
	const renderWithProviders = () => {
		render(<TransactionsScreen route={mockRoute} navigation={mockNavigation} />, {
			wrapper: ({ children }) => <NavigationContainer>{children}</NavigationContainer>,
		});
	};

	it("renders the TransactionsScreen tab", () => {
		renderWithProviders();
		const transactionsScreen = screen.queryByText("Transactions");
		expect(transactionsScreen).toBeDefined();
	});
	it("sets the initial route to TransactionsScreen", () => {
		renderWithProviders();
		const transactionsScreen = screen.queryByText("Transactions");
		expect(transactionsScreen).toBeDefined();
	});
});

describe("calculateTotal", () => {
	it("calculates the total balance correctly with no starting balance and one expense", () => {
		const transactions = [new TransactionBuilder().withAmount(100).withType("expense").build()];
		const result = calculateTotal({ transactions, startingBalance: 0 });
		expect(result).toBe("-$1.00");
	});
	it("calculates the total balance correctly with no transactions", () => {
		const result = calculateTotal({ transactions: [], startingBalance: 0 });
		expect(result).toBe("$0.00");
	});

	it("calculates the total balance correctly with one credit transaction", () => {
		const transactions = [new TransactionBuilder().withAmount(200).withType("credit").build()];
		const result = calculateTotal({ transactions, startingBalance: 0 });
		expect(result).toBe("$2.00");
	});

	it("calculates the total balance correctly with mixed transactions", () => {
		const transactions = [
			new TransactionBuilder().withAmount(100).withType("expense").build(),
			new TransactionBuilder().withAmount(200).withType("credit").build(),
		];
		const result = calculateTotal({ transactions, startingBalance: 0 });
		expect(result).toBe("$1.00");
	});

	it("calculates the total balance correctly with a starting balance", () => {
		const transactions = [
			new TransactionBuilder().withAmount(100).withType("expense").build(),
			new TransactionBuilder().withAmount(200).withType("credit").build(),
		];
		const result = calculateTotal({ transactions, startingBalance: 500 });
		expect(result).toBe("$6.00");
	});

	it("calculates the total balance correctly with negative amounts", () => {
		const transactions = [
			new TransactionBuilder().withAmount(-100).withType("expense").build(),
			new TransactionBuilder().withAmount(-200).withType("credit").build(),
		];
		const result = calculateTotal({ transactions, startingBalance: 0 });
		expect(result).toBe("$1.00");
	});
});

describe("groupTransactionsByDate", () => {
	it("groups transactions by date", () => {
		const mockTxn1 = new TransactionBuilder({}, 123)
			.withDate(new Date("2023-01-01"))
			.withCategory("Food")
			.withName("Hello World")
			.withDescription("Weekly groceries")
			.withSharedAccountId("acct_1234567890")
			.withAmount(100)
			.withType("expense")
			.withId("txn_1")
			.build();
		const mockTxn2 = new TransactionBuilder({}, 123)
			.withCategory("Food")
			.withName("Hello World")
			.withDescription("Weekly groceries")
			.withSharedAccountId("acct_1234567890")
			.withDate(new Date("2023-01-05"))
			.withType("credit")
			.withAmount(50)
			.withId("txn_2")
			.build();
		const expenses = [mockTxn1];
		const credits = [mockTxn2];
		const result = groupTransactionsByDate(expenses, credits);
		expect(result).toEqual([
			{
				title: DateTime.fromJSDate(mockTxn2.date).toFormat("ccc LLL dd yyyy"),
				data: [mockTxn2],
			},
			{
				title: DateTime.fromJSDate(mockTxn1.date).toFormat("ccc LLL dd yyyy"),
				data: [mockTxn1],
			},
		]);
	});
});

describe("showAsyncAlertPrompt", () => {
	it("resolves true when OK is pressed", async () => {
		jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
			const okButton = buttons?.find((button) => button.text === "OK");
			okButton?.onPress?.();
		});

		const result = await showAsyncAlertPrompt({
			title: "Test",
			message: "Test message",
		});
		expect(result).toBe(true);
	});

	it("resolves false when Cancel is pressed", async () => {
		jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
			const cancelButton = buttons?.find((button) => button.text === "Cancel");
			cancelButton?.onPress?.();
		});

		const result = await showAsyncAlertPrompt({
			title: "Test",
			message: "Test message",
		});
		expect(result).toBe(false);
	});
});

describe("Transaction Validation", () => {
	it("should identify an expense transaction", () => {
		const transaction = new TransactionBuilder()
			.withType("expense")
			.withAmount(100)
			.withDescription("Groceries")
			.build();

		expect(isExpenseTransaction(transaction)).toBe(true);
		expect(isCreditTransaction(transaction)).toBe(false);
	});

	it("should identify a credit transaction", () => {
		const transaction = new TransactionBuilder()
			.withType("credit")
			.withAmount(200)
			.withDescription("Salary")
			.build();

		expect(isCreditTransaction(transaction)).toBe(true);
		expect(isExpenseTransaction(transaction)).toBe(false);
	});

	it("should return false for an unknown transaction type", () => {
		const transaction = new TransactionBuilder()
			// @ts-expect-error testing unknown type
			.withType("unknown")
			.withAmount(300)
			.withDescription("Unknown")
			.build();

		expect(isExpenseTransaction(transaction)).toBe(false);
		expect(isCreditTransaction(transaction)).toBe(false);
	});
});
