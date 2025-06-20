import { AccountsProvider } from "@domain/providers/AccountsProvider";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import { SheetModalProvider } from "@domain/providers/SheetModalProvider";
import { TransactionsProvider } from "@domain/providers/TransactionsProvider";
import RootStack from "@presentation/navigators/RootStack/RootStack";
import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@realm/react", () => ({ RealmProvider: jest.fn() }));

jest.mock("@config/realmSchema", () => {
	return { realmSchemaVersion: 2 };
});

jest.mock(
	"@domain/providers/RepositoryProvider",
	() =>
		({ children }: { children: React.ReactNode }) => <>{children}</>
);

jest.mock("@domain/providers/TransactionsProvider", () => ({
	__esModule: true,
	TransactionsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	useTransactionsContext: () => ({
		state: [],
		fetchItems: jest.fn(),
		deleteItem: jest.fn(),
		addItem: jest.fn(),
		startListening: () => () => {},
	}),
}));

jest.mock("@domain/providers/AccountsProvider", () => ({
	__esModule: true,
	AccountsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
	useAccountsContext: () => ({
		state: [mockStateAccount],
		currentAccount: undefined,
		fetchItems: jest.fn(),
		deleteItem: jest.fn(),
		addItem: jest.fn(),
		startListening: () => () => {},
		selectCurrentAccount: (_accountId: string) => {},
	}),
}));

const mockStateAccount = {
	id: "acc_TEST_ACCOUNT_ID",
	name: "Test Account",
	startingBalance: 1234,
	transactions: [],
};

const MockNavigationContainer = ({ children }: { children: React.ReactNode }) => (
	<NavigationContainer>{children}</NavigationContainer>
);

export const renderWithProviders = (children: React.ReactNode) =>
	render(
		<SheetModalProvider>
			<MockNavigationContainer>
				<RepositoryProvider>
					<TransactionsProvider>
						<AccountsProvider>{children}</AccountsProvider>
					</TransactionsProvider>
				</RepositoryProvider>
			</MockNavigationContainer>
		</SheetModalProvider>
	);

describe("RootStack", () => {
	it("renders", () => {
		const tree = renderWithProviders(<RootStack />);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
