/* eslint-disable no-restricted-imports */
import { render, screen, userEvent } from "@testing-library/react-native";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React from "react";
import { Button, Text, View } from "react-native";
import { SheetModalProvider, useSheetModalContext } from "./SheetModalProvider";

// Helper component to consume the context
const Consumer: React.FC = () => {
	const {
		transactionModalVisible,
		openTransactionModal,
		closeTransactionModal,
		accountModalVisible,
		openAccountModal,
		closeAccountModal,
	} = useSheetModalContext();

	return (
		<>
			<View {...generateTestIDs("transactionModalVisible")}>
				{transactionModalVisible ? "true" : "false"}
			</View>
			<View {...generateTestIDs("accountModalVisible")}>
				{accountModalVisible ? "true" : "false"}
			</View>
			<Button onPress={openTransactionModal} title="Open Transaction Modal" />
			<Button onPress={closeTransactionModal} title="Close Transaction Modal" />
			<Button onPress={openAccountModal} title="Open Account Modal" />
			<Button onPress={closeAccountModal} title="Close Account Modal" />

			{/* Example sheets */}
			<View {...generateTestIDs("transactionModal")}>
				<Text>Transaction Modal</Text>
			</View>
			<View {...generateTestIDs("accountModal")}>
				<Text>Account Modal</Text>
			</View>
		</>
	);
};

describe("SheetModalProvider", () => {
	it("provides default modal visibility as false", () => {
		render(
			<SheetModalProvider>
				<Consumer />
			</SheetModalProvider>
		);

		const transactionModalVisible = screen.getByTestId("transactionModalVisible");
		expect(transactionModalVisible).toHaveTextContent("false");
		const accountModalVisible = screen.getByTestId("accountModalVisible");
		expect(accountModalVisible).toHaveTextContent("false");
	});

	it("opens and closes transaction modal", async () => {
		render(
			<SheetModalProvider>
				<Consumer />
			</SheetModalProvider>
		);

		const elem = screen.getByText("Open Transaction Modal");
		await userEvent.press(elem);
		expect(screen.getByTestId("transactionModalVisible")).toHaveTextContent("true");

		const closeElem = screen.getByText("Close Transaction Modal");
		await userEvent.press(closeElem);
		expect(screen.getByTestId("transactionModalVisible")).toHaveTextContent("false");
	});

	it("opens and closes account modal", async () => {
		render(
			<SheetModalProvider>
				<Consumer />
			</SheetModalProvider>
		);

		const openElem = screen.getByText("Open Account Modal");
		await userEvent.press(openElem);
		expect(screen.getByTestId("accountModalVisible")).toHaveTextContent("true");

		const closeElem = screen.getByText("Close Account Modal");
		await userEvent.press(closeElem);
		expect(screen.getByTestId("accountModalVisible")).toHaveTextContent("false");
	});

	it("throws error if useSheetModalContext is used outside provider", () => {
		const BrokenConsumer = () => {
			useSheetModalContext();
			return null;
		};
		// Suppress error output for this test
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		expect(() => render(<BrokenConsumer />)).toThrow(
			"useSheetModalContext must be used within a SheetModalProvider"
		);
		spy.mockRestore();
	});
});
