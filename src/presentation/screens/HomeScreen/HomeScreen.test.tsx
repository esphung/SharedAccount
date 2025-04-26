import useTransactions from "@presentation/hooks/useTransactions";
import { render } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "./HomeScreen";

jest.mock("@presentation/hooks/useTransactions", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    state: [],
    startListening: jest.fn(() => jest.fn()),
  })),
}));

jest.mock("@components/SharedAccountScreen/SharedAccountScreen", () => {
  return {
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});

jest.mock("@components/SpendingStats/SpendingStats", () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react-native/no-raw-text
    default: () => <div>SpendingStats</div>,
  };
});

describe("HomeScreen", () => {
  const mockUnsubscribe = jest.fn();
  const mockStartListening = jest.fn(() => mockUnsubscribe);
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
    const { toJSON } = render(<HomeScreen />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("calls startListening on mount", () => {
    (useTransactions as jest.Mock).mockReturnValue({
      state: [],
      startListening: mockStartListening,
    });

    render(<HomeScreen />);
    expect(mockStartListening).toHaveBeenCalled();
  });

  it("unsubscribes from startListening on unmount", () => {
    const { unmount } = render(<HomeScreen />);
    unmount();
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
});
