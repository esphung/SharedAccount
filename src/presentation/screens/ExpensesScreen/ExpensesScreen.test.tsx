import AccountBuilder from "@data/models/builders/AccountBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import useAccounts from "@presentation/hooks/useAccounts";
import { render } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";

import ExpensesScreen, { calculateTotal, groupTransactionsByDate, showAsyncAlertPrompt } from "./ExpensesScreen";

// jest.mock("react", () => ({
//   ...jest.requireActual("react"),
//   useState: jest.fn(),
// }));

jest.mock("@presentation/hooks/useAccounts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// jest.mock("@components/TransactionList/TransactionList", () => "TransactionList");
jest.mock("@components/AddExpenseSheet/AddExpenseSheet", () => "AddExpenseSheet");
jest.mock(
  "@components/SharedAccountScreen/SharedAccountScreen",
  () =>
    ({ children }: { children: React.ReactNode }) => <>{children}</>,
);

describe("ExpensesScreen", () => {
  const mockUseAccounts = useAccounts as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAccounts.mockReturnValue({
      fetchItems: jest.fn(),
      addItem: jest.fn(),
      currentAccount: { id: "acct_1", startingBalance: 1000, transactions: [] },
      addTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
      startListening: jest.fn(() => () => jest.fn()),
    });
  });

  it("renders correctly", () => {
    // @ts-expect-error not a real navigation prop
    const { getByText } = render(<ExpensesScreen navigation={{ addListener: jest.fn() }} />);
    expect(getByText("Expenses")).toBeTruthy();
  });

  it("displays loading state when list is not ready", () => {
    // @ts-expect-error not a real navigation prop
    const { getByText } = render(<ExpensesScreen navigation={{ addListener: jest.fn() }} />);
    expect(getByText("Loading...")).toBeTruthy();
  });
});

describe("calculateTotal", () => {
  it("calculates the total balance correctly", () => {
    const account = new AccountBuilder()
      .withId("acct_1")
      .withStartingBalance(1000)
      .withTransactions([
        new TransactionBuilder().withAmount(100).build(),
        new TransactionBuilder().withAmount(-50).build(),
        new TransactionBuilder().withAmount(200).build(),
      ])
      .build();
    const result = calculateTotal(account);
    expect(result).toBe("$7.50");
  });
});

describe("groupTransactionsByDate", () => {
  it("groups transactions by date", () => {
    const mockTxn1 = new TransactionBuilder()
      .withDate(new Date("2023-01-01"))
      .withAmount(100)
      .withType("expense")
      .withId("txn_1")
      .build();
    const mockTxn2 = new TransactionBuilder()
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
        title: "Wed Jan 04 2023",
        data: [
          {
            id: "txn_2",
            sharedAccountId: "acct_1234567890",
            userId: "usr_1234567890",
            amount: 50,
            category: "Food",
            name: "Hello World",
            date: new Date("2023-01-05"),
            description: "Weekly groceries",
            type: "credit",
          },
        ],
      },
      {
        title: "Sat Dec 31 2022",
        data: [
          {
            id: "txn_1",
            sharedAccountId: "acct_1234567890",
            userId: "usr_1234567890",
            amount: 100,
            category: "Food",
            name: "Hello World",
            date: new Date("2023-01-01"),
            description: "Weekly groceries",
            type: "expense",
          },
        ],
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

    const result = await showAsyncAlertPrompt({ title: "Test", message: "Test message" });
    expect(result).toBe(true);
  });

  it("resolves false when Cancel is pressed", async () => {
    jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
      const cancelButton = buttons?.find((button) => button.text === "Cancel");
      cancelButton?.onPress?.();
    });

    const result = await showAsyncAlertPrompt({ title: "Test", message: "Test message" });
    expect(result).toBe(false);
  });
});
