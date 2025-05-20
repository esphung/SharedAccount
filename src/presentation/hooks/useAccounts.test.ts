import AccountBuilder from "@data/models/builders/AccountBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import useRepository from "@domain/contexts/useRepository";
import { act, renderHook } from "@testing-library/react-native";

import { createMockRepos } from "./__mocks__/mockFactories";
import useAccounts, { mergeAccounts } from "./useAccounts";

const mockAccount1 = new AccountBuilder().withTransactions([]).build();
const mockAccount2 = new AccountBuilder().withTransactions([]).build();
const mockAccount3 = new AccountBuilder().withTransactions([]).build();

jest.mock("@domain/contexts/useRepository", () => ({
  __esModule: true,
  default: jest.fn(),
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

describe("useAccounts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete a transaction", async () => {
    // arrange
    const mockTxn1 = new TransactionBuilder().withId("txn_1").withSharedAccountId(mockAccount1.id).build();
    const mockTxn2 = new TransactionBuilder().withId("txn_2").withSharedAccountId(mockAccount1.id).build();
    const mockRepos = createMockRepos({
      accounts: [mockAccount1],
      transactions: [mockTxn1, mockTxn2],
    });

    (useRepository as jest.Mock).mockImplementation(() => mockRepos);
    const { result } = renderHook(() => useAccounts());

    await act(async () => {
      await result.current.fetchItems();
    });

    // act
    await act(async () => {
      await result.current.deleteTransaction("txn_1", mockAccount1.id);
    });

    // assert
    expect(mockRepos.transactionRepo.delete).toHaveBeenCalledWith("txn_1");
    expect(mockRepos.transactionRepo.delete).toHaveBeenCalledTimes(1);
    expect(mockRepos.accountRepo.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.state[0].transactions).not.toContainEqual(mockTxn1);
    expect(result.current.state[0].transactions).toEqual([mockTxn2]);
  });

  it("should add an account", async () => {
    // arrange
    const mockRepos = createMockRepos({
      accounts: [],
      transactions: [],
    });

    (useRepository as jest.Mock).mockImplementation(() => mockRepos);

    const { result } = renderHook(() => useAccounts());

    // act
    await act(async () => {
      await result.current.addItem(mockAccount1);
    });

    // assert
    expect(mockRepos.accountRepo.add).toHaveBeenCalledWith(mockAccount1);
    expect(mockRepos.accountRepo.add).toHaveBeenCalledTimes(1);
    // expect(mockRepos.accountRepo.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual([mockAccount1]);
    expect(result.current.state[0].transactions).toEqual(mockAccount1.transactions);
  });

  it("should delete an account", async () => {
    // arrange
    const mockRepos = createMockRepos({
      accounts: [mockAccount1],
      transactions: [
        new TransactionBuilder().withSharedAccountId(mockAccount1.id).build(),
        new TransactionBuilder().withSharedAccountId(mockAccount2.id).build(),
        new TransactionBuilder().withSharedAccountId(mockAccount3.id).build(),
      ],
    });

    (useRepository as jest.Mock).mockImplementation(() => mockRepos);

    const { result } = renderHook(() => useAccounts());

    // act
    await act(async () => {
      await result.current.fetchItems();
    });

    await act(async () => {
      await result.current.deleteItem(mockAccount1.id);
    });

    // assert
    expect(mockRepos.accountRepo.delete).toHaveBeenCalledWith(mockAccount1.id);
    expect(mockRepos.accountRepo.delete).toHaveBeenCalledTimes(1);
    expect(mockRepos.accountRepo.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.state).toEqual([]);
  });

  it("should fetch accounts", async () => {
    // arrange
    const mockRepos = createMockRepos({
      accounts: [mockAccount1],
      transactions: [
        new TransactionBuilder().withSharedAccountId(mockAccount1.id).build(),
        new TransactionBuilder().withSharedAccountId(mockAccount1.id).build(),
      ],
    });

    (useRepository as jest.Mock).mockImplementation(() => mockRepos);

    // act
    const { result } = renderHook(() => useAccounts());

    await act(async () => {
      await result.current.fetchItems();
    });

    // assert
    expect(mockRepos.accountRepo.getAll).toHaveBeenCalledTimes(1);
    expect(mockRepos.transactionRepo.getAll).toHaveBeenCalledTimes(1);
    expect(result.current.state).toContainEqual(mockAccount1);
    expect(result.current.state[0].transactions).toEqual(mockAccount1.transactions);
  });

  it("should add a transaction", async () => {
    // arrange
    const mockTxn1 = new TransactionBuilder().withId("txn_1").withSharedAccountId(mockAccount1.id).build();
    const mockTxn2 = new TransactionBuilder().withId("txn_2").withSharedAccountId(mockAccount1.id).build();
    const mockRepos = createMockRepos({
      accounts: [mockAccount1],
      transactions: [mockTxn1, mockTxn2],
    });
    (useRepository as jest.Mock).mockImplementation(() => mockRepos);
    const { result } = renderHook(() => useAccounts());

    await act(async () => {
      await result.current.fetchItems();
    });

    // act
    await act(async () => {
      await result.current.addTransaction(mockTxn1, mockAccount1.id);
    });

    // assert
    expect(mockRepos.transactionRepo.add).toHaveBeenCalledWith(mockTxn1);
    expect(mockRepos.transactionRepo.add).toHaveBeenCalledTimes(1);
    expect(result.current.state[0].transactions).toContainEqual(mockTxn1);
    expect(result.current.state[0].transactions).toEqual([mockTxn1, mockTxn2]);
  });
});

describe("mergeAccounts", () => {
  it("should merge accounts correctly", () => {
    // arrange
    const previous = [
      new AccountBuilder().withId("acct_1").withTransactions([]).build(),
      new AccountBuilder().withId("acct_2").withTransactions([]).build(),
    ];
    const updates = [
      new AccountBuilder().withId("acct_1").withTransactions([]).build(),
      new AccountBuilder().withId("acct_2").withTransactions([]).build(),
    ];
    const expected = [
      new AccountBuilder().withId("acct_1").withTransactions([]).build(),
      new AccountBuilder().withId("acct_2").withTransactions([]).build(),
    ];
    // act
    const result = mergeAccounts(previous, updates);
    // assert
    expect(result).toEqual(expected);
  });
  it("should merge transactions correctly", () => {
    const mockAccountABefore = new AccountBuilder()
      .withId("acct_1")
      .withTransactions([
        new TransactionBuilder().withId("txn_1").withSharedAccountId("acct_1").build(),
        new TransactionBuilder().withId("txn_2").withSharedAccountId("acct_1").build(),
      ])
      .build();
    const mockAccountAAfter = new AccountBuilder(mockAccountABefore)
      .withTransactions([
        new TransactionBuilder().withId("txn_1").withSharedAccountId("acct_1").build(),
        new TransactionBuilder().withId("txn_2").withSharedAccountId("acct_1").build(),
        new TransactionBuilder().withId("txn_3").withSharedAccountId("acct_1").build(),
      ])
      .build();
    const mockAccountBBefore = new AccountBuilder()
      .withId("acct_2")
      .withTransactions([
        new TransactionBuilder().withId("txn_3").withSharedAccountId("acct_2").build(),
        new TransactionBuilder().withId("txn_4").withSharedAccountId("acct_2").build(),
      ])
      .build();
    const mockAccountBAfter = new AccountBuilder(mockAccountBBefore)
      .withId("acct_2")
      .withTransactions([new TransactionBuilder().withId("txn_3").withSharedAccountId("acct_2").build()])
      .build();

    // arrange
    const previous = [mockAccountABefore, mockAccountBBefore];
    const updates = [mockAccountAAfter, mockAccountBAfter];
    const expected = [mockAccountAAfter, mockAccountBAfter];

    // act
    const result = mergeAccounts(previous, updates);
    // assert
    expect(result).toEqual(expected);
  });
});

describe("selectCurrentAccount", () => {
  it("should set the current account and save to storage", async () => {
    const mockRepos = createMockRepos({
      accounts: [mockAccount1, mockAccount2],
      transactions: [],
    });
    (useRepository as jest.Mock).mockImplementation(() => mockRepos);

    const { result } = renderHook(() => useAccounts());

    // Simulate initial fetch to populate state
    await act(async () => {
      await result.current.fetchItems();
    });

    // act
    act(() => {
      result.current.selectCurrentAccount(mockAccount2);
    });

    // assert
    expect(result.current.currentAccount).toEqual(mockAccount2);
  });
});
