import { fireEvent, render } from "@testing-library/react-native";
import React from "react";

import ExpenseForm from "./ExpenseForm";

// AwareScrollView
jest.mock("@presentation/components/AwareScrollView/AwareScrollView", () => {
  return ({ children }: { children: React.ReactNode }) => <div data-testid="aware-scroll-view">{children}</div>;
});

describe("ExpenseForm", () => {
  const mockOnSubmit = jest.fn();
  const mockListRef = { current: { scrollToIndex: jest.fn() } };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    // @ts-expect-error not typing the ref
    const { getByText, getByPlaceholderText } = render(<ExpenseForm onSubmit={mockOnSubmit} listRef={mockListRef} />);

    expect(getByText("Amount:")).toBeTruthy();
    expect(getByText("Category:")).toBeTruthy();
    expect(getByPlaceholderText("Type a category...")).toBeTruthy();
    expect(getByText("Save Expense")).toBeTruthy();
  });

  it("validates amount and category inputs", () => {
    // @ts-expect-error not typing the ref
    const { getByText, getByPlaceholderText } = render(<ExpenseForm onSubmit={mockOnSubmit} listRef={mockListRef} />);

    fireEvent.press(getByText("Save Expense"));

    expect(getByText("Amount must be greater than 0")).toBeTruthy();
    expect(getByText("Category is required")).toBeTruthy();

    fireEvent.changeText(getByPlaceholderText("Type a category..."), "123");
    fireEvent.press(getByText("Save Expense"));

    expect(getByText("Category must be a single word")).toBeTruthy();
  });

  it("renders default and custom suggestions", () => {
    const customItems = [{ label: "Travel", value: "" }];
    const { getByPlaceholderText, getByDisplayValue } = render(
      // @ts-expect-error not typing the ref
      <ExpenseForm onSubmit={mockOnSubmit} items={customItems} listRef={mockListRef} />,
    );

    fireEvent.changeText(getByPlaceholderText("Type a category..."), "Travel");

    expect(getByDisplayValue("Travel")).toBeTruthy();
  });
});
