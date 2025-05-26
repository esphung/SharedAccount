import {AccountsProvider} from "@domain/providers/AccountsProvider";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import {SheetModalProvider} from "@domain/providers/SheetModalProvider";
import RootStack from "@presentation/navigators/RootStack/RootStack";
import {NavigationContainer} from "@react-navigation/native";
import {render} from "@testing-library/react-native";
import React from "react";

jest.mock("@realm/react", () => ({RealmProvider: jest.fn()}));

jest.mock("@config/realmSchema", () => {
	return {realmSchemaVersion: 2};
});

jest.mock("@domain/providers/RepositoryProvider", () => ({children}: {children: React.ReactNode}) => (
	<>{children}</>
));

const mockStateAccount = {
	id: "acc_TEST_ACCOUNT_ID",
	name: "Test Account",
	startingBalance: 1234,
	transactions: [],
};

const MockNavigationContainer = ({children}: {children: React.ReactNode}) => (
	<NavigationContainer>{children}</NavigationContainer>
);

export const renderWithProviders = (children: React.ReactNode) =>
	render(
		<SheetModalProvider>
			<MockNavigationContainer>
				<RepositoryProvider>
					<AccountsProvider>{children}</AccountsProvider>
				</RepositoryProvider>
			</MockNavigationContainer>
		</SheetModalProvider>,
	);

jest.mock("@domain/providers/AccountsProvider", () => ({
	__esModule: true,
	AccountsProvider: ({children}: {children: React.ReactNode}) => <>{children}</>,
	useAccountsContext: () => ({
		state: [mockStateAccount],
		currentAccount: undefined,
		fetchItems: jest.fn(),
		deleteItem: jest.fn(),
		addItem: jest.fn(),
		startListening: () => () => {},
		addTransaction: jest.fn(),
		deleteTransaction: jest.fn(),
		selectCurrentAccount: (_accountId: string) => {},
	}),
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

describe("RootStack", () => {
	it("renders", () => {
		const tree = renderWithProviders(<RootStack />);
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
