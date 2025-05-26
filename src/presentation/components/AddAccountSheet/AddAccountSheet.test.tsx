import {render, screen, userEvent} from "@testing-library/react-native";
import React from "react";
import type {Account} from "types/Account";
import AddAccountSheet from "@components/AddAccountSheet/AddAccountSheet";

jest.mock("@components/AccountForm/AccountForm", () => {
	const MockButton = jest.requireActual("react-native").Button;
	return ({onSubmit}: {onSubmit: (data: Partial<Account>) => void}) => (
		<MockButton
			testID="mock-account-form"
			onPress={() => onSubmit({name: "Test Account"})}
			title="Mock AccountForm"
		/>
	);
});

jest.mock("@components/SheetModal/SheetModal", () => {
	return ({
		children,
		...props
	}: {
		children: React.ReactNode;
		modalVisible: boolean;
		setModalVisible: (modalVisible: boolean) => void;
		presentationStyle?: string;
		nonDismissable?: boolean;
		testID?: string;
	}) => <div {...props}>{children}</div>;
});

describe("AddAccountSheet", () => {
	const setModalVisible = jest.fn();
	const onSubmit = jest.fn();

	beforeEach(() => {
		setModalVisible.mockClear();
		onSubmit.mockClear();
	});

	it("renders SheetModal when modalVisible is true", () => {
		render(<AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />);
		expect(screen.getByTestId("add-account-sheet")).toBeVisible();
	});

	it("does not crash when modalVisible is false", () => {
		render(
			<AddAccountSheet modalVisible={false} setModalVisible={setModalVisible} onSubmit={onSubmit} />,
		);
		expect(screen.getByTestId("add-account-sheet")).toBeVisible();
	});

	it("renders AccountForm inside SheetModal", () => {
		render(<AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />);
		expect(screen.getByTestId("mock-account-form")).toBeVisible();
	});

	it("calls onSubmit and closes modal when AccountForm submits", async () => {
		render(<AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />);
		await userEvent.press(screen.getByTestId("mock-account-form"));
		expect(onSubmit).toHaveBeenCalledWith({name: "Test Account"});
		expect(setModalVisible).toHaveBeenCalledWith(false);
	});
});
