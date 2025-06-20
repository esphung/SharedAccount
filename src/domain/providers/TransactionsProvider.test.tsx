/* eslint-disable no-restricted-imports */
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import {
	mergeTransactions,
	TransactionsProvider,
	useTransactionsContext,
} from "@domain/providers/TransactionsProvider";
import { act, render, screen } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";
import type { Transaction } from "types/Transaction";

// Mock dependencies
const mockLocalRepo = {
	getAll: jest.fn(),
	update: jest.fn(),
	add: jest.fn(),
	delete: jest.fn(),
	getLiveData: jest.fn(),
	stopListening: jest.fn(),
};

const mockRemoteRepo = {
	getAll: jest.fn(),
	update: jest.fn(),
	add: jest.fn(),
	delete: jest.fn(),
};

jest.mock("@domain/providers/RepositoryProvider", () => ({
	useRepository: () => ({
		localTransactionRepo: mockLocalRepo,
		remoteTransactionRepo: mockRemoteRepo,
	}),
}));

jest.mock("@utils/listFunctions", () => ({
	mergeRecords: jest.fn(
		async ({
			local,
			remote,
		}: {
			local: { list: Transaction[] };
			remote: { list: Transaction[] };
		}) => [...local.list, ...remote.list]
	),
}));

const textStyle = { color: "black", fontSize: 16, margin: 10 };

const mockTransactionA = new TransactionBuilder()
	.withId("txn_1")
	.withAmount(10)
	.withDescription("Test Transaction A")
	.withDate(new Date())
	.withName("Test A")
	.withCategory("Test Category")
	.withType("expense")
	.withSharedAccountId("acct_1")
	.withUserId("usr_1")
	.build();

const TestComponent = () => {
	const { state, fetchItems, addItem, deleteItem } = useTransactionsContext();
	return (
		<>
			{/* <span data-testid="count">{state.length}</span> */}
			<Text testID="count">{state.length}</Text>
			{/* Buttons to trigger actions */}
			<Text testID="fetch" onPress={fetchItems} style={textStyle}>
				Fetch Transactions
			</Text>
			<Text testID="add" onPress={() => addItem(mockTransactionA)} style={textStyle}>
				Add Transaction
			</Text>
			<Text testID="delete" onPress={() => deleteItem(mockTransactionA.id)} style={textStyle}>
				Delete Transaction
			</Text>
		</>
	);
};

describe("TransactionsProvider", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockLocalRepo.getAll.mockResolvedValue([]);
		mockRemoteRepo.getAll.mockResolvedValue([]);
		mockLocalRepo.add.mockResolvedValue(undefined);
		mockRemoteRepo.add.mockResolvedValue(undefined);
		mockLocalRepo.delete.mockResolvedValue(undefined);
		mockRemoteRepo.delete.mockResolvedValue(undefined);
	});

	it("provides initial empty state", () => {
		// arrange
		render(
			<TransactionsProvider>
				<TestComponent />
			</TransactionsProvider>
		);

		// act
		act(() => {
			expect(screen.getByTestId("count")).toHaveTextContent("0");
		});

		// assert
		expect(mockLocalRepo.getAll).toHaveBeenCalled();
	});

	it("fetches and merges transactions", async () => {
		// arrange
		mockLocalRepo.getAll.mockResolvedValue([{ id: "a", amount: 1 }]);
		mockRemoteRepo.getAll.mockResolvedValue([{ id: "b", amount: 2 }]);
		render(
			<TransactionsProvider>
				<TestComponent />
			</TransactionsProvider>
		);

		// act
		await act(async () => {
			const fetchButton = screen.getByTestId("fetch");
			await fetchButton.props.onPress();
		});

		// assert
		// Should merge both local and remote
		expect(mockLocalRepo.getAll).toHaveBeenCalled();
		expect(mockRemoteRepo.getAll).toHaveBeenCalled();
	});

	it("adds a transaction", async () => {
		// arrange
		render(
			<TransactionsProvider>
				<TestComponent />
			</TransactionsProvider>
		);

		// act
		await act(async () => {
			await screen.getByTestId("add").props.onPress();
		});

		// assert
		expect(mockRemoteRepo.add).toHaveBeenCalled();
		expect(mockRemoteRepo.add).toHaveBeenCalledWith(mockTransactionA);
		expect(mockRemoteRepo.add).toHaveBeenCalledTimes(1);
		expect(mockLocalRepo.add).toHaveBeenCalled();
		expect(mockLocalRepo.add).toHaveBeenCalledWith(mockTransactionA);
		expect(mockLocalRepo.add).toHaveBeenCalledTimes(1);
	});

	it("deletes a transaction", async () => {
		// arrange
		render(
			<TransactionsProvider>
				<TestComponent />
			</TransactionsProvider>
		);

		// act
		await act(async () => {
			await screen.getByTestId("delete").props.onPress();
		});

		// assert
		expect(mockRemoteRepo.delete).toHaveBeenCalledWith(mockTransactionA.id);
		expect(mockLocalRepo.delete).toHaveBeenCalledTimes(1);
		expect(mockLocalRepo.delete).toHaveBeenCalledWith(mockTransactionA.id);
		expect(mockLocalRepo.delete).toHaveBeenCalledTimes(1);
	});

	it("throws error if useTransactionsContext is used outside provider", () => {
		const Broken = () => {
			useTransactionsContext();
			return null;
		};
		expect(() => render(<Broken />)).toThrow();
	});

	describe("mergeTransactions", () => {
		it("merges local and remote transactions by id", () => {
			const local: Transaction[] = [
				new TransactionBuilder()
					.withId("txn_1")
					.withAmount(10)
					.withDescription("local")
					.withDate(new Date())
					.withName("local")
					.withCategory("")
					.withType("expense")
					.withSharedAccountId("acct_1")
					.withUserId("usr_1")
					.build(),
			];
			const remote: Transaction[] = [
				new TransactionBuilder()
					.withId("txn_1")
					.withAmount(20)
					.withDescription("remote")
					.withDate(new Date())
					.withName("remote")
					.withCategory("")
					.withType("expense")
					.withSharedAccountId("acct_2")
					.withUserId("usr_2")
					.build(),
			];
			const merged = mergeTransactions(local, remote);
			expect(merged[0].amount).toBe(20);
			expect(merged[0].description).toBe("remote");
		});
	});

	it("returns local if no matching remote", () => {
		const local: Transaction[] = [
			new TransactionBuilder()
				.withId("txn_1")
				.withAmount(10)
				.withDescription("local")
				.withDate(new Date())
				.withName("local")
				.withCategory("")
				.withType("expense")
				.withSharedAccountId("acct_1")
				.withUserId("usr_1")
				.build(),
		];
		const remote: Transaction[] = [
			new TransactionBuilder()
				.withId("txn_2")
				.withAmount(20)
				.withDescription("remote")
				.withDate(new Date())
				.withName("remote")
				.withCategory("")
				.withType("expense")
				.withSharedAccountId("acct_2")
				.withUserId("usr_2")
				.build(),
		];
		const merged = mergeTransactions(local, remote);
		expect(merged[0].amount).toBe(10);
	});
});
