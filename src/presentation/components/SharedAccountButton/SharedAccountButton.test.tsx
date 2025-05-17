import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import SharedAccountButton from "./SharedAccountButton";
import colors from "@config/themes/colors";
import { StyleSheet } from "react-native";

describe("SharedAccountButton", () => {
  const title = "Test Button";
  const onPress = jest.fn();

  it("renders with the given title", () => {
    const { getByText } = render(<SharedAccountButton title={title} onPress={onPress} />);
    expect(getByText(title)).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const { getByText } = render(<SharedAccountButton title={title} onPress={onPress} />);
    fireEvent.press(getByText(title));
    expect(onPress).toHaveBeenCalled();
  });

  it("applies primary styles by default", () => {
    const { getByTestId } = render(<SharedAccountButton title={title} onPress={onPress} />);
    const button = getByTestId("sharedAccountButton");
    expect(button.props.style).toEqual(
      expect.objectContaining({
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
      }),
    );
  });

  it("applies secondary styles when type is 'secondary'", () => {
    const { getByTestId } = render(<SharedAccountButton title={title} type="secondary" onPress={onPress} />);
    const button = getByTestId("sharedAccountButton");
    expect(button.props.style).toEqual(
      expect.objectContaining({
        borderColor: colors.secondary,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        height: 48,
        justifyContent: "center",
        paddingHorizontal: 16,
        paddingVertical: 8,
      }),
    );
  });

  it("applies suggestionItem styles when type is 'suggestionItem'", () => {
    const { getByTestId } = render(<SharedAccountButton title={title} type="suggestionItem" onPress={onPress} />);
    const button = getByTestId("sharedAccountButton");
    expect(button.props.style).toEqual(
      expect.objectContaining({
        alignItems: "flex-start",
        borderColor: colors.secondary,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 8,
      }),
    );
  });

  it("applies disabled styles when disabled", () => {
    const { getByTestId } = render(<SharedAccountButton title={title} disabled onPress={onPress} />);
    const button = getByTestId("sharedAccountButton");
    expect(button.props.style).toEqual(expect.objectContaining({ backgroundColor: colors.disabled, opacity: 0.4 }));
  });

  it("applies custom style", () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(<SharedAccountButton title={title} style={customStyle} onPress={onPress} />);
    const button = getByTestId("sharedAccountButton");
    expect(button.props.style).toEqual(expect.objectContaining({ marginTop: 20 }));
  });
});
