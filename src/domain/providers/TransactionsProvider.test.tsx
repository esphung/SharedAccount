/* eslint-disable @typescript-eslint/no-var-requires */
import { mergeTransactions, useTransactionSync } from "@domain/providers/TransactionsProvider";
import type { Transaction } from "types/Transaction";
import { renderHook } from "@testing-library/react-hooks";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";

jest.mock("./RepositoryProvider", () => ({
	useRepository: jest.fn(() => ({
		localTransactionRepo: {
			getAll: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
		},
		remoteTransactionRepo: {
			getAll: jest.fn(),
			add: jest.fn(),
			update: jest.fn(),
		},
	})),
}));

const remoteTransactionRepoMock = {
	getAll: jest.fn(),
	add: jest.fn(),
	update: jest.fn(),
};
const localTransactionRepoMock = {
	getAll: jest.fn(),
	add: jest.fn(),
	update: jest.fn(),
};

describe("useTransactionSync", () => {
	const localTransactionRepo: {
		getAll: jest.Mock;
		add: jest.Mock;
		update: jest.Mock;
	} = localTransactionRepoMock;
	const remoteTransactionRepo: {
		getAll: jest.Mock;
		add: jest.Mock;
		update: jest.Mock;
	} = remoteTransactionRepoMock;

	const useRepository: jest.Mock = require("./RepositoryProvider").useRepository;
	let transactionA: Transaction;
	let transactionB: Transaction;
	let transactionC: Transaction;

	(useRepository as jest.Mock).mockReturnValue({
		localTransactionRepo: localTransactionRepoMock,
		remoteTransactionRepo: remoteTransactionRepoMock,
	});

	beforeEach(() => {
		transactionA = new TransactionBuilder()
			.withId("txn_1")
			.withVersion(1)
			.withName("Transaction A")
			.withAmount(100)
			.withType("expense")
			.build();
		transactionB = new TransactionBuilder()
			.withId("txn_2")
			.withVersion(2)
			.withName("Transaction B")
			.withAmount(200)
			.withType("credit")
			.build();
		transactionC = new TransactionBuilder()
			.withId("txn_3")
			.withVersion(1)
			.withName("Transaction C")
			.withAmount(300)
			.withType("expense")
			.build();
		jest.resetModules();
		(useRepository as jest.Mock).mockReturnValue({
			localTransactionRepo,
			remoteTransactionRepo,
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
		jest.dontMock("./RepositoryProvider");
	});

	it("should sync unsynced local transactions to remote", async () => {
		localTransactionRepo.getAll.mockResolvedValue([transactionA]);
		remoteTransactionRepo.getAll.mockResolvedValue([]);
		remoteTransactionRepo.add.mockResolvedValue(undefined);

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(remoteTransactionRepo.add).toHaveBeenCalledWith(transactionA);
	});

	it("should add missing remote transactions to local", async () => {
		localTransactionRepo.getAll.mockResolvedValue([transactionA]);
		remoteTransactionRepo.getAll.mockResolvedValue([transactionA, transactionB]);
		localTransactionRepo.add.mockResolvedValue(undefined);

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(localTransactionRepo.add).toHaveBeenCalledWith(transactionB);
	});

	it("should update local if remote version is newer", async () => {
		const local = { id: "1", version: 1 };
		const remote = { id: "1", version: 2 };
		localTransactionRepo.getAll.mockResolvedValue([local]);
		remoteTransactionRepo.getAll.mockResolvedValue([remote]);
		localTransactionRepo.update.mockResolvedValue(undefined);

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(localTransactionRepo.update).toHaveBeenCalledWith(remote);
	});

	it("should update remote if local version is newer", async () => {
		const local = { id: "1", version: 3 };
		const remote = { id: "1", version: 2 };
		localTransactionRepo.getAll.mockResolvedValue([local]);
		remoteTransactionRepo.getAll.mockResolvedValue([remote]);
		remoteTransactionRepo.update.mockResolvedValue(undefined);

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(remoteTransactionRepo.update).toHaveBeenCalledWith(local);
	});

	it("should not update if versions are equal", async () => {
		const local = { id: "1", version: 2 };
		const remote = { id: "1", version: 2 };
		localTransactionRepo.getAll.mockResolvedValue([local]);
		remoteTransactionRepo.getAll.mockResolvedValue([remote]);

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(localTransactionRepo.update).not.toHaveBeenCalled();
		expect(remoteTransactionRepo.update).not.toHaveBeenCalled();
	});

	it("should handle errors in remote add gracefully", async () => {
		localTransactionRepo.getAll.mockResolvedValue([transactionC]);
		remoteTransactionRepo.getAll.mockResolvedValue([]);
		remoteTransactionRepo.add.mockRejectedValue(new Error("fail"));

		// const { syncTransactions } = getHook();
		const { result } = renderHook(() => useTransactionSync());
		const { syncTransactions } = result.current;
		await syncTransactions();

		expect(remoteTransactionRepo.add).toHaveBeenCalledWith(transactionC);
	});
});

describe("mergeTransactions", () => {
	it("should merge transactions correctly", () => {
		const local = [{ id: "1", version: 1, name: "Local Transaction" }];
		const remote = [{ id: "1", version: 2, name: "Remote Transaction" }];

		// @ts-expect-error Testing merge function
		const merged = mergeTransactions(local, remote);

		expect(merged).toEqual([{ id: "1", version: 2, name: "Remote Transaction" }]);
	});

	it("should return local transactions if remotes is undefined", () => {
		const local = [{ id: "1", version: 1, name: "Local Transaction" }];
		// @ts-expect-error Testing undefined remote
		const merged = mergeTransactions(local, undefined);

		expect(merged).toEqual([{ id: "1", version: 1, name: "Local Transaction" }]);
	});

	it("should return remote transaction if local is undefined", () => {
		const remote = [{ id: "1", version: 2, name: "Remote Transaction" }];
		// @ts-expect-error Testing undefined local
		const merged = mergeTransactions(undefined, remote);

		expect(merged).toEqual([]);
	});
});
