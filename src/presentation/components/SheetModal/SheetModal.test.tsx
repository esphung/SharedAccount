import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import {fireEvent, render} from "@testing-library/react-native";
import React from "react";

import SheetModal from "./SheetModal";

describe("SheetModal", () => {
	const setModalVisibleMock = jest.fn();
	const onDismissMock = jest.fn();

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("renders children when modalVisible is true", () => {
		const {getByText} = render(
			<SheetModal modalVisible={true} setModalVisible={setModalVisibleMock}>
				<React.Fragment>
					<SharedAccountText>Modal Content</SharedAccountText>
				</React.Fragment>
			</SheetModal>,
		);
		expect(getByText("Modal Content")).toBeTruthy();
	});

	it("does not render children when modalVisible is false", () => {
		const {queryByText} = render(
			<SheetModal modalVisible={false} setModalVisible={setModalVisibleMock}>
				<SharedAccountText>Hidden Content</SharedAccountText>
			</SheetModal>,
		);
		expect(queryByText("Hidden Content")).toBeNull();
	});

	it("calls setModalVisible(false) when Close button is pressed", () => {
		const {getByText} = render(
			<SheetModal modalVisible={true} setModalVisible={setModalVisibleMock}>
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		fireEvent.press(getByText("Close"));
		expect(setModalVisibleMock).toHaveBeenCalledWith(false);
	});

	it("calls setModalVisible(!modalVisible) on onRequestClose", () => {
		const {getByTestId} = render(
			<SheetModal testID="sheet-modal" modalVisible={true} setModalVisible={setModalVisibleMock}>
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		// Simulate onRequestClose
		fireEvent(getByTestId("sheet-modal"), "requestClose");
		expect(setModalVisibleMock).toHaveBeenCalledWith(false);
	});

	it("calls setModalVisible(false) and onDismiss on onDismiss", () => {
		const {getByTestId} = render(
			<SheetModal
				testID="sheet-modal"
				modalVisible={true}
				setModalVisible={setModalVisibleMock}
				onDismiss={onDismissMock}>
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		// Simulate onDismiss
		fireEvent(getByTestId("sheet-modal"), "dismiss");
		expect(setModalVisibleMock).toHaveBeenCalledWith(false);
		expect(onDismissMock).toHaveBeenCalled();
	});

	it("passes presentationStyle prop to Modal", () => {
		const {getByTestId} = render(
			<SheetModal
				testID="sheet-modal"
				modalVisible={true}
				setModalVisible={setModalVisibleMock}
				presentationStyle="pageSheet">
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		const modal = getByTestId("sheet-modal");
		expect(modal.props.presentationStyle).toBe("pageSheet");
	});

	it("passes additional props to Modal", () => {
		const {getByTestId} = render(
			<SheetModal
				testID="sheet-modal"
				modalVisible={true}
				setModalVisible={setModalVisibleMock}
				hardwareAccelerated={true}>
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		const modal = getByTestId("sheet-modal");
		expect(modal.props.hardwareAccelerated).toBe(true);
	});

	it("does not call onRequestClose when nonDismissable is true", () => {
		const {getByTestId} = render(
			<SheetModal
				testID="sheet-modal"
				modalVisible={true}
				setModalVisible={setModalVisibleMock}
				nonDismissable={true}>
				<SharedAccountText>Content</SharedAccountText>
			</SheetModal>,
		);
		fireEvent(getByTestId("sheet-modal"), "requestClose");
		expect(setModalVisibleMock).not.toHaveBeenCalled();
	});
});
