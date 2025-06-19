import AccountList from "@components/AccountList/AccountList";
import AccountBuilder from "@data/models/builders/AccountBuilder";
import { fireEvent, render, screen, userEvent } from "@testing-library/react-native";
import React from "react";

import type { TextInputProps } from "react-native";

const mockOnPress = jest.fn();

const accounts = [
	new AccountBuilder()
		.withId("acct_1")
		.withName("Account 1")
		.withStartingBalance(100)
		.withTransactions([])
		.build(),
	new AccountBuilder()
		.withId("acct_2")
		.withName("Account 2")
		.withStartingBalance(200)
		.withTransactions([])
		.build(),
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
		render(
			<AccountList
				accounts={accounts}
				onPressRemove={mockOnPressRemove}
				onPress={mockOnPress}
			/>
		);
		expect(screen.getByText("$1.00")).toBeTruthy();
		expect(screen.getByText("$2.00")).toBeTruthy();
	});

	it("calls onPress with correct account when item is pressed", () => {
		const onPress = jest.fn();
		render(
			<AccountList accounts={accounts} onPress={onPress} onPressRemove={mockOnPressRemove} />
		);
		fireEvent.press(screen.getByText("Account 2"));
		expect(onPress).toHaveBeenCalledWith(accounts[1]);
	});

	it("does not render checkmark svg icon when selectedAccount is not present", () => {
		render(
			<AccountList
				accounts={accounts}
				selectedAccount={accounts[1]}
				onPressRemove={mockOnPressRemove}
				onPress={mockOnPress}
			/>
		);
		const icon = screen.queryByTestId("checkmark-account-item-icon-acct_1");
		expect(icon).toBeNull();
	});

	it("calls onPressRemove with correct account when remove button is pressed", async () => {
		render(
			<AccountList
				accounts={accounts}
				selectedAccount={accounts[1]}
				onPressRemove={mockOnPressRemove}
				onPress={mockOnPress}
			/>
		);
		await userEvent.press(screen.getByTestId("account-item-remove-acct_2"));
		expect(mockOnPressRemove).toHaveBeenCalledWith(accounts[1]);
	});

	it("does not render remove accout svg icon when selectedAccount is not present", () => {
		render(
			<AccountList
				accounts={accounts}
				selectedAccount={undefined}
				onPressRemove={mockOnPressRemove}
				onPress={mockOnPress}
			/>
		);
		expect(screen.queryByTestId("account-item-remove-acct_2")).toBeNull();
	});

	it("renders remove account svg icon when selectedAccount is present", () => {
		render(
			<AccountList
				accounts={[
					{
						id: "acct_2",
						name: "Account 2",
						startingBalance: 200,
						transactions: [],
						version: 0,
					},
				]}
				onPressRemove={mockOnPressRemove}
				selectedAccount={{
					id: "acct_2",
					name: "Account 2",
					startingBalance: 200,
					transactions: [],
					version: 0,
				}}
				onPress={mockOnPress}
			/>
		);
		const elem = screen.getByTestId("account-item-icon-acct_2");
		expect(elem).toBeDefined();
	});
});
