import TransactionAdapter from "./TransactionAdapter";

describe("TransactionAdapter.localToState", () => {
  it("should convert a local transaction with all fields to state", () => {
    const local = {
      toJSON: () => ({
        id: "txn_1",
        amount: 50,
        date: "2024-06-01T12:00:00.000Z",
        description: "Test transaction",
      }),
    };

    const result = TransactionAdapter.localToState(local);

    expect(result.id).toBe("txn_1");
    expect(result.amount).toBe(50);
    expect(result.description).toBe("Test transaction");
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.toISOString()).toBe("2024-06-01T12:00:00.000Z");
  });

  it("should handle local object without toJSON", () => {
    const local = {
      id: "txn_2",
      amount: 100,
      date: "2024-06-02T10:00:00.000Z",
      description: "No toJSON",
    };

    const result = TransactionAdapter.localToState(local as unknown as { toJSON: () => object });

    expect(result.id).toBe("txn_2");
    expect(result.amount).toBe(100);
    expect(result.description).toBe("No toJSON");
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date.toISOString()).toBe("2024-06-02T10:00:00.000Z");
  });

  it("should deeply clone the input object", () => {
    const input = {
      id: "txn_4",
      amount: 75,
      date: "2024-06-03T08:00:00.000Z",
      meta: { tag: "test" },
    };
    const local = { toJSON: () => input };
    const result = TransactionAdapter.localToState(local);

    expect(result).not.toBe(input);
  });
});
