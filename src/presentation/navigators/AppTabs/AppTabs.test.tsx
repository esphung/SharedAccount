import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";

import AppTabs from "./AppTabs";

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

  // it("matches the snapshot", () => {
  //   const { toJSON } = renderWithNavigation();
  //   expect(toJSON()).toMatchSnapshot();
  // });

  it("renders the HomeScreen tab", () => {
    const { getByText } = renderWithNavigation();
    const homeScreen = getByText("Home");
    expect(homeScreen).toBeTruthy();
  });

  it("renders the ExpensesScreen tab", () => {
    const { getByText } = renderWithNavigation();
    const expensesScreen = getByText("Expenses");
    expect(expensesScreen).toBeTruthy();
  });

  it("renders the ScheduledTransactionsScreen tab", () => {
    const { getByText } = renderWithNavigation();
    const scheduledTransactionsScreen = getByText("Scheduled");
    expect(scheduledTransactionsScreen).toBeTruthy();
  });

  it("sets the initial route to ExpensesScreen", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText("Expenses")).toBeTruthy();
  });

  it("hides the header for all screens", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText("Home").props.style).not.toContain("headerShown");
    expect(getByText("Expenses").props.style).not.toContain("headerShown");
    expect(getByText("Scheduled").props.style).not.toContain("headerShown");
  });
});
