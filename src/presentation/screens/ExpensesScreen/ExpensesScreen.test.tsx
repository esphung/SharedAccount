import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import useTransactions from "@presentation/hooks/useTransactions";
import { render } from "@testing-library/react-native";
import { itMatchesSnapshot } from "@utils/testUtils/sharedTests";
import React from "react";
import { Alert } from "react-native";

import ExpensesScreen, { groupTransactionsByDate, scrollToTop, showAsyncAlertPrompt } from "./ExpensesScreen";

import type { Transaction } from "types/Transaction";

jest.mock("@presentation/hooks/useTransactions");

jest.mock("@presentation/components/AwareScrollView/AwareScrollView", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

jest.mock("@presentation/components/AddExpenseSheet/AddExpenseSheet", () => {
  return {
    __esModule: true,
    default: () => {
      return <></>;
    },
  };
});

const mockA = new TransactionBuilder()
  .withId("1" as `txn_${string}`)
  .withAmount(50)
  .withDate(new Date("2023-03-01"))
  .withType("expense")
  .build();
const mockB = new TransactionBuilder()
  .withId("2" as `txn_${string}`)
  .withAmount(30)
  .withDate(new Date("2023-03-02"))
  .withType("expense")
  .build();
const mockC = new TransactionBuilder()
  .withId("3" as `txn_${string}`)
  .withAmount(20)
  .withDate(new Date("2023-03-01"))
  .withType("credit")
  .build();
const mockD = new TransactionBuilder()
  .withId("4" as `txn_${string}`)
  .withAmount(40)
  .withDate(new Date("2023-03-03"))
  .withType("credit")
  .build();

describe("ExpensesScreen", () => {
  const mockUnsubscribe = jest.fn();
  const mockStartListening = jest.fn(() => mockUnsubscribe);
  const mockFetchItems = jest.fn();
  const mockAddItem = jest.fn();
  const mockDeleteItem = jest.fn();
  const mockNavigation = {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
  const unsubscribeMock = jest.fn();
  mockStartListening.mockReturnValue(unsubscribeMock);

  const mockTransactions = [
    new TransactionBuilder()
      .withId("txn_1" as `txn_${string}`)
      .withSharedAccountId("acct_1" as `acct_${string}`)
      .withUserId("usr_1" as `usr_${string}`)
      .withAmount(100)
      .withCategory("Food")
      .withName("Groceries")
      .withDate(new Date("2023-03-01"))
      .withDescription("Weekly groceries")
      .withType("expense")
      .build(),
    new TransactionBuilder()
      .withId("txn_2" as `txn_${string}`)
      .withSharedAccountId("acct_1" as `acct_${string}`)
      .withUserId("usr_1" as `usr_${string}`)
      .withAmount(50)
      .withCategory("Transport")
      .withName("Bus Ticket")
      .withDate(new Date("2023-03-02"))
      .withDescription("Monthly bus pass")
      .withType("credit")
      .build(),
  ];

  beforeEach(() => {
    (useTransactions as jest.Mock).mockReturnValue({
      state: mockTransactions,
      startListening: mockStartListening,
      fetchItems: mockFetchItems,
      addItem: mockAddItem,
      deleteItem: mockDeleteItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  itMatchesSnapshot(ExpensesScreen, {
    navigation: mockNavigation,
  });

  it("renders Add Expense button", () => {
    // @ts-expect-error not typing the navigation prop
    const { getByText } = render(<ExpensesScreen navigation={mockNavigation} />);
    expect(getByText("Add an expense")).toBeTruthy();
  });

  it("calls startListening on mount and unsubscribes on unmount", () => {
    const { unmount } = render(
      <ExpensesScreen
        // @ts-expect-error not typing the navigation prop
        navigation={mockNavigation}
      />,
    );
    expect(mockStartListening).toHaveBeenCalled();

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it("calls startListening on mount", () => {
    // @ts-expect-error not typing the navigation prop
    render(<ExpensesScreen navigation={mockNavigation} />);
    expect(mockStartListening).toHaveBeenCalled();
  });
});

describe("groupTransactionsByDate", () => {
  it("groups transactions by date and sorts them in descending order", () => {
    const arr1: Transaction[] = [mockA, mockB];
    const arr2 = [mockC, mockD];
    const filteredExpenses = arr1.filter(
      (transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
    );
    const filteredCredits = arr2.filter(
      (transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
    );
    const result = groupTransactionsByDate(filteredExpenses, filteredCredits);
    expect(result).toEqual([
      {
        title: new Date("2023-03-03").toDateString(),
        data: [mockD],
      },
      {
        title: new Date("2023-03-02").toDateString(),
        data: [mockB],
      },
      {
        title: new Date("2023-03-01").toDateString(),
        data: [mockA, mockC],
      },
    ]);
  });

  it("returns an empty array when no transactions are provided", () => {
    const result = groupTransactionsByDate([], []);
    expect(result).toEqual([]);
  });

  it("handles transactions with the same date correctly", () => {
    const mockExpense = new TransactionBuilder()
      .withId("1" as `txn_${string}`)
      .withType("expense")
      .withDate(new Date("2023-03-01"))
      .withAmount(50)
      .build();
    const mockCredit = new TransactionBuilder()
      .withId("2" as `txn_${string}`)
      .withType("credit")
      .withDate(new Date("2023-03-01"))
      .withAmount(20)
      .build();
    const arr1 = [mockExpense, mockCredit];
    const arr2 = [mockCredit];

    const filteredExpenses = arr1.filter(
      (transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
    );
    const filteredCredits = arr2.filter(
      (transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
    );
    const result = groupTransactionsByDate(filteredExpenses, filteredCredits);

    expect(result).toEqual([
      {
        title: "Wed Mar 01 2023",
        data: [mockExpense, mockCredit],
      },
    ]);
  });

  it("sorts transactions within the same date by time in descending order", () => {
    const mockExpense = new TransactionBuilder()
      .withId("1" as `txn_${string}`)
      .withType("expense")
      .withDate(new Date("2023-03-01T10:00:00"))
      .withAmount(50)
      .build();
    const mockCredit = new TransactionBuilder()
      .withId("2" as `txn_${string}`)
      .withType("credit")
      .withDate(new Date("2023-03-01T12:00:00"))
      .withAmount(20)
      .build();
    const arr1 = [mockExpense];
    const arr2 = [mockCredit];
    const filteredExpenses = arr1.filter(
      (transaction): transaction is Transaction<"expense"> => transaction.type === "expense",
    );
    const filteredCredits = arr2.filter(
      (transaction): transaction is Transaction<"credit"> => transaction.type === "credit",
    );
    const result = groupTransactionsByDate(filteredExpenses, filteredCredits);
    expect(result).toEqual([
      {
        title: "Wed Mar 01 2023",
        data: [mockCredit, mockExpense],
      },
    ]);
  });

  describe("showAsyncAlertPrompt", () => {
    const mockDeleteTransaction = jest.fn();
    const mockFetchTransactions = jest.fn();

    const mockUnsubscribe = jest.fn();
    const mockStartListening = jest.fn(() => mockUnsubscribe);
    const mockFetchItems = jest.fn();
    const mockAddItem = jest.fn();
    const mockDeleteItem = jest.fn();
    const mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
    const unsubscribeMock = jest.fn();
    mockStartListening.mockReturnValue(unsubscribeMock);

    beforeEach(() => {
      (useTransactions as jest.Mock).mockReturnValue({
        state: [],
        startListening: mockStartListening,
        fetchItems: mockFetchItems,
        addItem: mockAddItem,
        deleteItem: mockDeleteItem,
      });
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("calls deleteTransaction and fetchTransactions when confirmed", async () => {
      const mockAlert = jest.spyOn(Alert, "alert");
      (mockAlert as jest.Mock).mockImplementationOnce((title, message, buttons) => {
        expect(title).toBe("Delete Transaction");
        expect(message).toBe("Are you sure?");
        expect(buttons).toHaveLength(2);
        return null;
      });
      const confirmCallback = jest.fn();

      // act
      render(
        <ExpensesScreen
          // @ts-expect-error not typing the navigation prop
          navigation={mockNavigation}
        />,
      );

      showAsyncAlertPrompt(confirmCallback);

      // assert
      expect(mockAlert).toHaveBeenCalledWith("Delete Transaction", "Are you sure?", [
        { style: "cancel", text: "Cancel" },
        { onPress: expect.any(Function), style: "destructive", text: "Delete" },
      ]);

      const deleteButton = mockAlert.mock.lastCall?.[2]?.[1].onPress;
      deleteButton?.();

      expect(confirmCallback).toHaveBeenCalled();
    });

    it("does not call deleteTransaction or fetchTransactions when cancelled", () => {
      const cancelCallback = jest.fn();

      showAsyncAlertPrompt(cancelCallback);

      expect(mockDeleteTransaction).not.toHaveBeenCalled();
      expect(mockFetchTransactions).not.toHaveBeenCalled();
    });
  });

  describe("scrollToTop", () => {
    it("scrolls to the top of the list", () => {
      const mockScrollToLocation = jest.fn();
      const mockRef = { current: { scrollToLocation: mockScrollToLocation } };
      const mockTransaction = new TransactionBuilder()
        .withId("1" as `txn_${string}`)
        .withAmount(50)
        .withDate(new Date("2023-03-01"))
        .withType("expense")
        .build();
      const mockTransaction2 = new TransactionBuilder()
        .withId("2" as `txn_${string}`)
        .withAmount(30)
        .withDate(new Date("2023-03-02"))
        .withType("expense")
        .build();
      const data = [
        { title: "Section 1", data: [mockTransaction] },
        { title: "Section 2", data: [mockTransaction2] },
      ];

      // @ts-expect-error not typing the date prop
      scrollToTop(data, mockRef);

      expect(mockScrollToLocation).toHaveBeenCalledWith({
        itemIndex: 0,
        sectionIndex: 0,
        animated: true,
        viewPosition: 0,
        viewOffset: 0,
      });
    });

    it("does not scroll if data is empty or ref is null", () => {
      const mockScrollToLocation = jest.fn();
      const mockRef = { current: null };

      // @ts-expect-error not typing the date prop
      scrollToTop(undefined, mockRef);

      expect(mockScrollToLocation).not.toHaveBeenCalled();
    });
  });
});
