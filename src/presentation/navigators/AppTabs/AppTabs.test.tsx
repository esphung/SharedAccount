import React from "react";
import { render } from "@testing-library/react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppTabs, { AppTabsScreens } from "./AppTabs";

jest.mock("@domain/contexts/useRepository", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    transactionRepo: {
      getLiveData: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      stopListening: jest.fn(),
    },
    scheduledTransactionRepo: {
      getLiveData: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      stopListening: jest.fn(),
    },
  })),
}));

describe("AppTabs Navigator", () => {
  const renderWithNavigation = () =>
    render(
      <NavigationContainer>
        <AppTabs />
      </NavigationContainer>,
    );

  it("renders the AppTabs navigator", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText(AppTabsScreens.Home)).toBeTruthy();
    expect(getByText(AppTabsScreens.Expenses)).toBeTruthy();
    expect(getByText(AppTabsScreens.ScheduledTransactions)).toBeTruthy();
  });

  it("sets the initial route to HomeScreen", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText(AppTabsScreens.Home)).toBeTruthy();
  });

  it("hides the header for all screens", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText(AppTabsScreens.Home).props.style).not.toContain("headerShown");
    expect(getByText(AppTabsScreens.Expenses).props.style).not.toContain("headerShown");
    expect(getByText(AppTabsScreens.ScheduledTransactions).props.style).not.toContain("headerShown");
  });
});
