import useTransactions from "@presentation/hooks/useTransactions";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import ExpensesScreen, { groupTransactionsByDate } from "./ExpensesScreen";

jest.mock("@presentation/hooks/useTransactions");

jest.mock("@presentation/components/AwareScrollView/AwareScrollView", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

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

  beforeEach(() => {
    (useTransactions as jest.Mock).mockReturnValue({
      state: [],
      startListening: mockStartListening,
      fetchItems: mockFetchItems,
      addItem: mockAddItem,
      deleteItem: mockDeleteItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", () => {
    // @ts-expect-error not typing the navigation prop
    const { toJSON } = render(<ExpensesScreen navigation={mockNavigation} />);
    expect(toJSON()).toMatchSnapshot();
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

  it("shows AddExpenseSheet when Add Expense button is pressed", () => {
    const { getByText, getByTestId } = render(
      <ExpensesScreen
        // @ts-expect-error not typing the navigation prop
        navigation={mockNavigation}
      />,
    );
    fireEvent.press(getByText("Add an expense"));
    expect(getByTestId("add-expense-sheet")).toBeTruthy();
  });

  it("calls startListening on mount", () => {
    // @ts-expect-error not typing the navigation prop
    render(<ExpensesScreen navigation={mockNavigation} />);
    expect(mockStartListening).toHaveBeenCalled();
  });
});

describe("groupTransactionsByDate", () => {
  it("groups transactions by date and sorts them in descending order", () => {
    const expenses = [
      { id: "1", type: "expense", date: new Date("2023-03-01"), amount: 50 },
      { id: "2", type: "expense", date: new Date("2023-03-02"), amount: 30 },
    ];
    const credits = [
      { id: "3", type: "credit", date: new Date("2023-03-01"), amount: 20 },
      { id: "4", type: "credit", date: new Date("2023-03-03"), amount: 40 },
    ];

    // @ts-expect-error not typing the date prop
    const result = groupTransactionsByDate(expenses, credits);

    expect(result).toEqual([
      {
        title: new Date("2023-03-03").toDateString(),
        data: [{ id: "4", type: "credit", date: new Date("2023-03-03"), amount: 40 }],
      },
      {
        title: new Date("2023-03-02").toDateString(),
        data: [{ id: "2", type: "expense", date: new Date("2023-03-02"), amount: 30 }],
      },
      {
        title: new Date("2023-03-01").toDateString(),
        data: [
          { id: "1", type: "expense", date: new Date("2023-03-01"), amount: 50 },
          { id: "3", type: "credit", date: new Date("2023-03-01"), amount: 20 },
        ],
      },
    ]);
  });

  it("returns an empty array when no transactions are provided", () => {
    const result = groupTransactionsByDate([], []);
    expect(result).toEqual([]);
  });

  it("handles transactions with the same date correctly", () => {
    const expenses = [{ id: "1", type: "expense", date: new Date("2023-03-01T10:00:00"), amount: 50 }];
    const credits = [{ id: "2", type: "credit", date: new Date("2023-03-01T12:00:00"), amount: 20 }];

    // @ts-expect-error not typing the date prop
    const result = groupTransactionsByDate(expenses, credits);

    expect(result).toEqual([
      {
        title: "Wed Mar 01 2023",
        data: [
          { id: "2", type: "credit", date: new Date("2023-03-01T12:00:00"), amount: 20 },
          { id: "1", type: "expense", date: new Date("2023-03-01T10:00:00"), amount: 50 },
        ],
      },
    ]);
  });

  it("sorts transactions within the same date by time in descending order", () => {
    const expenses = [{ id: "1", type: "expense", date: new Date("2023-03-01T08:00:00"), amount: 50 }];
    const credits = [{ id: "2", type: "credit", date: new Date("2023-03-01T10:00:00"), amount: 20 }];

    // @ts-expect-error not typing the date prop
    const result = groupTransactionsByDate(expenses, credits);

    expect(result).toEqual([
      {
        title: "Wed Mar 01 2023",
        data: [
          { id: "2", type: "credit", date: new Date("2023-03-01T10:00:00"), amount: 20 },
          { id: "1", type: "expense", date: new Date("2023-03-01T08:00:00"), amount: 50 },
        ],
      },
    ]);
  });
});
