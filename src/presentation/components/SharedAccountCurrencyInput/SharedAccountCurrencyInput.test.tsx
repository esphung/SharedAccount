import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SharedAccountCurrencyInput from "./SharedAccountCurrencyInput";
import { StyleSheet } from "react-native";

describe("SharedAccountCurrencyInput", () => {
  it("renders with default value (0 cents)", () => {
    const { getByDisplayValue } = render(<SharedAccountCurrencyInput value={0} onChangeValue={jest.fn()} />);
    expect(getByDisplayValue("$0.00")).toBeTruthy();
  });

  it("renders with custom value and currency", () => {
    const { getByDisplayValue } = render(
      <SharedAccountCurrencyInput value={12345} currency="EUR" locale="de-DE" onChangeValue={jest.fn()} />,
    );
    // 123.45 EUR in de-DE locale
    expect(getByDisplayValue("123,45 €")).toBeTruthy();
  });

  it("calls onChangeValue with correct cents when input changes", () => {
    const onChangeValue = jest.fn();
    const { getByDisplayValue } = render(<SharedAccountCurrencyInput value={0} onChangeValue={onChangeValue} />);
    const input = getByDisplayValue("$0.00");
    fireEvent.changeText(input, "1234");
    // "1234" -> 1234 cents
    expect(onChangeValue).toHaveBeenCalledWith(1234);
  });

  it("formats input as currency when value changes", () => {
    const { getByDisplayValue, rerender } = render(<SharedAccountCurrencyInput value={0} onChangeValue={jest.fn()} />);
    rerender(<SharedAccountCurrencyInput value={999} onChangeValue={jest.fn()} />);
    expect(getByDisplayValue("$9.99")).toBeTruthy();
  });

  it("applies custom style", () => {
    const customStyle = { backgroundColor: "pink" };
    const { getByDisplayValue } = render(
      <SharedAccountCurrencyInput value={0} onChangeValue={jest.fn()} style={customStyle} />,
    );
    const input = getByDisplayValue("$0.00");
    expect(StyleSheet.flatten(input.props.style)).toEqual(expect.objectContaining({ backgroundColor: "pink" }));
  });

  it("calls onFocus prop when focused", () => {
    const onFocus = jest.fn();
    const { getByDisplayValue } = render(
      <SharedAccountCurrencyInput value={0} onChangeValue={jest.fn()} onFocus={onFocus} />,
    );
    const input = getByDisplayValue("$0.00");
    fireEvent(input, "focus");
    expect(onFocus).toHaveBeenCalled();
  });

  it("handles non-numeric input gracefully", () => {
    const onChangeValue = jest.fn();
    const { getByDisplayValue } = render(<SharedAccountCurrencyInput value={0} onChangeValue={onChangeValue} />);
    const input = getByDisplayValue("$0.00");
    fireEvent.changeText(input, "abc");
    expect(onChangeValue).toHaveBeenCalledWith(0);
  });

  it("keeps cursor at the end after value change", () => {
    const { getByDisplayValue } = render(<SharedAccountCurrencyInput value={1234} onChangeValue={jest.fn()} />);
    const input = getByDisplayValue("$12.34");
    expect(input.props.selection).toEqual({ start: "$12.34".length, end: "$12.34".length });
  });
});
