import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import TransactionListItem from "./TransactionListItem";

describe("TransactionListItem", () => {
  const mockOnPress = jest.fn();
  const mockTransaction = {
    id: "txn_1" as const,
    type: "credit" as const,
    amount: 100,
    name: "Test Transaction",
    category: "Test Category",
    date: new Date(),
    sharedAccountId: "acct_1" as const,
    userId: "usr_1" as const,
  };
  const mockUser = {
    name: "John Doe",
    avatar: "https://example.com/avatar.jpg",
    email: "",
    id: "usr_1" as const,
  };

  it("renders correctly when isListReady is true", () => {
    const { getByText } = render(
      <TransactionListItem
        item={mockTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByText("John Doe")).toBeTruthy();
    expect(getByText("+ $1.00 (from Test Transaction)")).toBeTruthy();
    expect(getByText("↑")).toBeTruthy();
  });

  it("calls onPress with the correct id when pressed", () => {
    const { getByTestId } = render(
      <TransactionListItem
        item={mockTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    fireEvent.press(getByTestId("transaction-list-item"));
    expect(mockOnPress).toHaveBeenCalledWith(mockTransaction.id);
  });

  it("displays default avatar when user avatar is not provided", () => {
    const { getByTestId } = render(
      <TransactionListItem
        item={mockTransaction}
        user={{ ...mockUser, name: "John Doe" }}
        onPress={mockOnPress}
        itemHeight={100}
        isListReady={true}
      />,
    );

    const avatar = getByTestId("avatar-image");
    expect(avatar.props.source.uri).toBe(mockUser.avatar);
  });

  it("displays correct transaction type and amount for expense", () => {
    const expenseTransaction = { ...mockTransaction, type: "expense" as const, amount: 50 };
    const { getByText } = render(
      <TransactionListItem
        item={expenseTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByText("- $0.50 (Test Category)")).toBeTruthy();
    expect(getByText("↓")).toBeTruthy();
  });
});
