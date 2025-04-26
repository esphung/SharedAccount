import useScheduledTransactions from "@hooks/useScheduledTransactions";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import ScheduledTransactionsScreen from "@screens/ScheduledTransactionsScreen/ScheduledTransactionsScreen";

jest.mock("@hooks/useScheduledTransactions");

describe("ScheduledTransactionsScreen", () => {
  const mockStartListening = jest.fn(() => jest.fn());
  const mockFetchItems = jest.fn();
  const mockDeleteItem = jest.fn();

  beforeEach(() => {
    (useScheduledTransactions as jest.Mock).mockReturnValue({
      state: [],
      startListening: mockStartListening,
      fetchItems: mockFetchItems,
      deleteItem: mockDeleteItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", () => {
    const { toJSON } = render(<ScheduledTransactionsScreen />);
    expect(toJSON).toMatchSnapshot();
  });

  it("renders add txn button", () => {
    const { getByText } = render(<ScheduledTransactionsScreen />);
    expect(getByText("Add Scheduled Transaction")).toBeTruthy();
  });

  it("renders BillsSectionList correctly", () => {
    const { getByTestId } = render(<ScheduledTransactionsScreen />);
    expect(getByTestId("bills-section-list")).toBeTruthy();
  });

  it("calls startListening on mount and unsubscribes on unmount", () => {
    const unsubscribeMock = jest.fn();
    mockStartListening.mockReturnValue(unsubscribeMock);

    const { unmount } = render(<ScheduledTransactionsScreen />);
    expect(mockStartListening).toHaveBeenCalled();

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });

  it("should set modalVisible to true when submit button pressed", () => {
    // setup
    const stateMock = false;
    const setStateMock = jest.fn();
    jest.spyOn(React, "useState").mockImplementationOnce(() => [stateMock, setStateMock]);
    const { getByText } = render(<ScheduledTransactionsScreen />);

    // act
    fireEvent.press(getByText("Add Scheduled Transaction"));

    // assert
    expect(setStateMock).toHaveBeenCalledWith(true);
    expect(setStateMock).toHaveBeenCalledTimes(1);
  });
});
