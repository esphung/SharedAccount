import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import AddAccountSheet from "./AddAccountSheet";

import type { Account } from "types/Account";

jest.mock("@components/AccountForm/AccountForm", () => {
  const MockButton = jest.requireActual("react-native").Button;
  return ({ onSubmit }: { onSubmit: (data: Partial<Account>) => void }) => (
    <MockButton
      testID="mock-account-form"
      onPress={() => onSubmit({ name: "Test Account" })}
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
    const { getByTestId } = render(
      <AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />,
    );
    expect(getByTestId("add-account-sheet")).toBeTruthy();
  });

  it("does not crash when modalVisible is false", () => {
    const { getByTestId } = render(
      <AddAccountSheet modalVisible={false} setModalVisible={setModalVisible} onSubmit={onSubmit} />,
    );
    expect(getByTestId("add-account-sheet")).toBeTruthy();
  });

  it("renders AccountForm inside SheetModal", () => {
    const { getByTestId } = render(
      <AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />,
    );
    expect(getByTestId("mock-account-form")).toBeTruthy();
  });

  it("calls onSubmit and closes modal when AccountForm submits", () => {
    const { getByTestId } = render(
      <AddAccountSheet modalVisible={true} setModalVisible={setModalVisible} onSubmit={onSubmit} />,
    );
    fireEvent.press(getByTestId("mock-account-form"));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Test Account" });
    expect(setModalVisible).toHaveBeenCalledWith(false);
  });
});
