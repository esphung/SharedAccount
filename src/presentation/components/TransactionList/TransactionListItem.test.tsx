import React from "react";
import TransactionListItem from "./TransactionListItem";
import { render, fireEvent } from "@testing-library/react-native";

describe("TransactionListItem", () => {
  const mockTransaction = {
    id: "txn_1" as const,
    amount: 100,
    date: new Date(),
    userId: "usr_1" as const,
    category: "Food",
    sharedAccountId: "acct_1" as const,
    name: "Transaction 1",
    type: "credit" as const,
  };

  const mockUser = {
    avatar: "https://example.com/avatar.jpg",
    id: "usr_1" as const,
    name: "John Doe",
    email: "",
  };

  const mockOnPress = jest.fn();

  it("renders correctly with all props", () => {
    const { getByTestId, getByText } = render(
      <TransactionListItem
        item={mockTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByTestId("transaction-list-item")).toBeTruthy();
    expect(getByTestId("avatar-image").props.source.uri).toBe(mockUser.avatar);
    expect(getByText("$1.00")).toBeTruthy();
    expect(getByTestId("arrow-up-svg")).toBeTruthy();
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

  it("renders default avatar when user avatar is not provided", () => {
    const { getByTestId } = render(
      <TransactionListItem
        item={mockTransaction}
        user={undefined}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByTestId("avatar-image").props.source.uri).toBe("https://picsum.photos/200/300");
  });

  it("renders ArrowUpSvg for credit transactions", () => {
    const debitTransaction = { ...mockTransaction, type: "credit" as const };

    const { getByTestId } = render(
      <TransactionListItem
        item={debitTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByTestId("arrow-up-svg")).toBeTruthy();
  });

  it("renders ArrowDownSvg for credit transactions", () => {
    const creditTransaction = { ...mockTransaction, type: "expense" as const };

    const { getByTestId } = render(
      <TransactionListItem
        item={creditTransaction}
        user={mockUser}
        onPress={mockOnPress}
        itemHeight={60}
        isListReady={true}
      />,
    );

    expect(getByTestId("arrow-down-svg")).toBeTruthy();
  });
});
