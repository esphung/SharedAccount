import useTransactions from "@presentation/hooks/useTransactions";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import ExpensesScreen from "./ExpensesScreen";

jest.mock("@presentation/hooks/useTransactions");

// AwareScrollView is a mock component to avoid rendering issues in tests
jest.mock("@presentation/components/AwareScrollView/AwareScrollView", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => {
      return <>{children}</>;
    },
  };
});

describe("ExpensesScreen", () => {
  const mockStartListening = jest.fn(() => jest.fn());
  const mockFetchItems = jest.fn();
  const mockAddItem = jest.fn();
  const mockDeleteItem = jest.fn();

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
    const { toJSON } = render(<ExpensesScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders Add Expense button", () => {
    const { getByText } = render(<ExpensesScreen />);
    expect(getByText("Add an expense")).toBeTruthy();
  });

  it("calls startListening on mount and unsubscribes on unmount", () => {
    const unsubscribeMock = jest.fn();
    mockStartListening.mockReturnValue(unsubscribeMock);

    const { unmount } = render(<ExpensesScreen />);
    expect(mockStartListening).toHaveBeenCalled();

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it("shows AddExpenseSheet when Add Expense button is pressed", () => {
    const { getByText, getByTestId } = render(<ExpensesScreen />);
    fireEvent.press(getByText("Add an expense"));
    expect(getByTestId("add-expense-sheet")).toBeTruthy();
  });
});
