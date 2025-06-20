/* eslint-disable no-restricted-imports */
import AccountBuilder from "@data/models/builders/AccountBuilder";
import {
	AccountsProvider,
	mergeAccounts,
	useAccountsContext,
} from "@domain/providers/AccountsProvider";
import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import React from "react";
import { Button, Text } from "react-native";
import type { Account } from "types/Account";

const mockAccountA: Account = new AccountBuilder()
	.withId("acct_2")
	.withName("Mock Account A")
	.withStartingBalance(50)
	.withVersion(1)
	.build();

const mockAccountB: Account = new AccountBuilder()
	.withId("acct_1")
	.withName("Mock Account B")
	.withStartingBalance(200)
	.withVersion(1)
	.build();

// Mock dependencies
jest.mock("@domain/providers/RepositoryProvider", () => ({
	useRepository: () => ({
		localAccountRepo: {
			getAll: jest.fn().mockResolvedValue([mockAccountA, mockAccountB]),
			add: jest.fn().mockResolvedValue(undefined),
			update: jest.fn().mockResolvedValue(undefined),
			delete: jest.fn().mockResolvedValue(undefined),
			getLiveData: jest.fn(),
			stopListening: jest.fn(),
		},
		remoteAccountRepo: {
			getAll: jest.fn().mockResolvedValue([mockAccountA, mockAccountB]),
			add: jest.fn().mockResolvedValue(undefined),
			update: jest.fn().mockResolvedValue(undefined),
			delete: jest.fn().mockResolvedValue(undefined),
		},
	}),
}));

jest.mock("@domain/storage/userDefaultsStorage", () => ({
	saveItem: jest.fn().mockResolvedValue(undefined),
	getItem: jest.fn().mockResolvedValue("1"),
}));

jest.mock("@presentation/utilities", () => ({
	handleCatchError: () => jest.fn(),
}));

jest.mock("@utils/listFunctions", () => ({
	mergeRecords: jest.fn().mockImplementation(({ local, remote }) => {
		// Just merge by id for test
		return local.list.map((l: Account) => {
			const remoteAccount = remote.list.find((r: Account) => r.id === l.id);
			return remoteAccount ? { ...l, ...remoteAccount } : l;
		});
	}),
}));

// Helper test component
const TestComponent = () => {
	const { state, currentAccount, selectCurrentAccount, addItem, deleteItem } =
		useAccountsContext();

	return (
		<>
			{/* <Text testID="accounts">{JSON.stringify(state)}</Text> */}
			{[...state].map((account, index) => (
				<Text key={index} testID={`account-${account.id}`}>
					{JSON.stringify(account)}
				</Text>
			))}
			<Text testID="currentAccount">{JSON.stringify(currentAccount)}</Text>
			<Button
				testID="selectCurrent"
				onPress={() => selectCurrentAccount(state[0])}
				title="Select Current"
			/>
			<Button testID="addAccount" onPress={() => addItem(mockAccountA)} title="Add Account" />
			<Button
				testID="deleteAccount"
				onPress={() => deleteItem(mockAccountB.id)}
				title="Delete Account"
			/>
		</>
	);
};

describe("AccountsProvider", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("provides merged accounts and sets currentAccount", async () => {
		render(
			<AccountsProvider>
				<TestComponent />
			</AccountsProvider>
		);

		// Accounts should be merged
		await waitFor(async () => {
			const accounts = screen.getAllByTestId(/account-/);
			expect(accounts).toHaveLength(2);
		});

		// currentAccount should be set to the first account
		const currentAccount = JSON.parse(screen.getByTestId("currentAccount").props.children);
		expect(currentAccount.id).toBe("acct_2");
	});

	it("selectCurrentAccount updates currentAccount", async () => {
		render(
			<AccountsProvider>
				<TestComponent />
			</AccountsProvider>
		);

		// Simulate selecting current account
		await waitFor(async () => {
			screen.debug();
			const elem = screen.getByTestId("selectCurrent");
			await userEvent.press(elem);
		});

		const currentAccount = JSON.parse(screen.getByTestId("currentAccount").props.children);
		expect(currentAccount.name).toBe("Mock Account A");
	});

	it("addItem adds a new account", async () => {
		render(
			<AccountsProvider>
				<TestComponent />
			</AccountsProvider>
		);

		await waitFor(async () => {
			const elem = screen.getByTestId("addAccount");
			await userEvent.press(elem);
		});

		// const accounts = JSON.parse(screen.getByTestId("accounts").props.children);
		const accounts = screen.getAllByTestId(/account-/);
		expect(accounts).toHaveLength(3); // 2 initial + 1 added
		const newAccount = JSON.parse(accounts[accounts.length - 1].props.children);
		expect(newAccount.name).toBe("Mock Account A");
	});

	it("deleteItem removes an account", async () => {
		render(
			<AccountsProvider>
				<TestComponent />
			</AccountsProvider>
		);

		await waitFor(async () => {
			const elem = screen.getByTestId("deleteAccount");
			await userEvent.press(elem);
		});

		const accounts = screen.getAllByTestId(/account-/);
		expect(accounts).toHaveLength(1); // 2 initial - 1 deleted
	});
});

describe("mergeAccounts", () => {
	it("merges local and remote accounts by id", () => {
		const local = [{ id: "1", name: "Local", startingBalance: 10, version: 1 }];
		const remote = [{ id: "1", name: "Remote", startingBalance: 20, version: 2 }];
		// @ts-expect-error testing
		const merged = mergeAccounts(local, remote);
		expect(merged[0].name).toBe("Remote");
		expect(merged[0].startingBalance).toBe(20);
		expect(merged[0].version).toBe(2);
	});
	it("returns local if no remote match", () => {
		const local = [{ id: "1", name: "Local", startingBalance: 10, version: 1 }];
		const remote = [{ id: "2", name: "Remote", startingBalance: 20, version: 2 }];
		// @ts-expect-error testing
		const merged = mergeAccounts(local, remote);
		expect(merged[0].name).toBe("Local");
	});
});
