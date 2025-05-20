import AccountList from "@components/AccountList/AccountList";
import colors from "@config/themes/colors";
import AccountBuilder from "@data/models/builders/AccountBuilder";
import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import type { TextInputProps } from "react-native";
import { StyleSheet } from "react-native";

const accounts = [
  new AccountBuilder().withId("acct_1").withName("Account 1").withStartingBalance(100).withTransactions([]).build(),
  new AccountBuilder().withId("acct_2").withName("Account 2").withStartingBalance(200).withTransactions([]).build(),
];

// mock the userDefaultsStorage
jest.mock("@domain/storage/userDefaultsStorage", () => ({
  __esModule: true,
  default: {
    getItem: () => Promise.resolve(null),
    saveItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  },
}));

jest.mock("@components/SharedAccountText/SharedAccountText", () => {
  const MockText = jest.requireActual("react-native").Text;
  return ({ children, ...props }: TextInputProps) => <MockText {...props}>{children}</MockText>;
});

const mockOnPressRemove = jest.fn();

describe("AccountList", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders all accounts", () => {
    const { getByText } = render(<AccountList accounts={accounts} onPressRemove={mockOnPressRemove} />);
    expect(getByText("Account 1")).toBeTruthy();
    expect(getByText("Account 2")).toBeTruthy();
  });

  it("renders account balances using calculateTotal", () => {
    const { getByText } = render(<AccountList accounts={accounts} onPressRemove={mockOnPressRemove} />);
    expect(getByText("$1.00")).toBeTruthy();
    expect(getByText("$2.00")).toBeTruthy();
  });

  it("calls onPress with correct account when item is pressed", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AccountList accounts={accounts} onPress={onPress} onPressRemove={mockOnPressRemove} />,
    );
    fireEvent.press(getByText("Account 2"));
    expect(onPress).toHaveBeenCalledWith(accounts[1]);
  });

  it("applies selected style to selectedAccount", () => {
    const { getAllByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={accounts[1]} onPressRemove={mockOnPressRemove} />,
    );

    // Add testID to TouchableOpacity for selection
    const selected = getAllByTestId("account-item-acct_2")[0];

    // We'll check by style instead
    render(<AccountList accounts={accounts} selectedAccount={accounts[1]} onPressRemove={mockOnPressRemove} />);

    // const selected = getByText("Account 2").parent;
    expect(selected.props.style).toEqual(
      expect.objectContaining({
        borderRadius: 12,
        borderWidth: StyleSheet.hairlineWidth,
      }),
    );
  });

  it("applies correct styles to balance text", () => {
    const { getByText } = render(<AccountList accounts={accounts} onPressRemove={mockOnPressRemove} />);
    const balance = getByText("$1.00");
    expect(balance.props.style).toEqual(expect.objectContaining({ color: colors.green }));
  });

  it("renders checkmark svg icon when selectedAccount is present", () => {
    const { getByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={accounts[0]} onPressRemove={mockOnPressRemove} />,
    );
    const icon = getByTestId("checkmark-account-item-icon-acct_1");
    expect(icon).toBeTruthy();
  });

  it("does not render checkmark svg icon when selectedAccount is not present", () => {
    const { queryByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={accounts[1]} onPressRemove={mockOnPressRemove} />,
    );
    const icon = queryByTestId("checkmark-account-item-icon-acct_1");
    expect(icon).toBeNull();
  });

  it("renders account svg icon", () => {
    const { getByTestId } = render(<AccountList accounts={accounts} onPressRemove={mockOnPressRemove} />);
    const icon = getByTestId("account-item-icon-acct_1");
    expect(icon).toBeTruthy();
  });

  it("calls onPressRemove with correct account when remove button is pressed", () => {
    const { getByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={accounts[1]} onPressRemove={mockOnPressRemove} />,
    );
    fireEvent.press(getByTestId("account-item-remove-acct_2"));
    expect(mockOnPressRemove).toHaveBeenCalledWith(accounts[1]);
  });

  it("does not render remove accout svg icon when selectedAccount is not present", () => {
    const { queryByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={undefined} onPressRemove={mockOnPressRemove} />,
    );
    expect(queryByTestId("account-item-remove-acct_2")).toBeNull();
  });

  it("renders remove account svg icon when selectedAccount is present", () => {
    const { getByTestId } = render(
      <AccountList accounts={accounts} selectedAccount={accounts[1]} onPressRemove={mockOnPressRemove} />,
    );
    const icon = getByTestId("account-item-remove-acct_2");
    expect(icon).toBeTruthy();
  });
});
