import type { Transaction } from "types/Transaction";
import AccountAdapter from "./AccountAdapter";
import TransactionAdapter from "./TransactionAdapter";

jest.mock("./TransactionAdapter", () => ({
  __esModule: true,
  default: {
    localToState: jest.fn((txn: Transaction) => ({ ...txn, adapted: true })),
  },
}));

describe("AccountAdapter.localToState", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should convert a local account with all fields to state", () => {
    const local = {
      toJSON: () => ({
        id: "acct_1",
        name: "Checking",
        startingBalance: 100,
        transactions: [{ id: "txn_1" }, { id: "txn_2" }],
      }),
    };

    const result = AccountAdapter.localToState(local);

    expect(result.id).toBe("acct_1");
    expect(result.name).toBe("Checking");
    expect(result.startingBalance).toBe(100);
    expect(TransactionAdapter.localToState).toHaveBeenCalledTimes(2);
    expect(result.transactions).toEqual([
      { id: "txn_1", adapted: true },
      { id: "txn_2", adapted: true },
    ]);
  });

  it("should handle missing optional fields and default them", () => {
    const local = {
      toJSON: () => ({
        id: "acct_2",
        transactions: [],
      }),
    };

    const result = AccountAdapter.localToState(local);

    expect(result.id).toBe("acct_2");
    expect(result.name).toBe("");
    expect(result.startingBalance).toBe(0);
    expect(result.transactions).toEqual([]);
  });

  it("should throw if id is missing", () => {
    const local = {
      toJSON: () => ({
        name: "No ID",
        transactions: [],
      }),
    };

    expect(() => AccountAdapter.localToState(local)).toThrow("[AccountAdapter] Missing id");
  });

  it("should handle missing transactions as empty array", () => {
    const local = {
      toJSON: () => ({
        id: "acct_4",
        name: "No Txns",
      }),
    };

    const result = AccountAdapter.localToState(local);

    expect(result.id).toBe("acct_4");
    expect(result.transactions).toEqual([]);
  });
});
