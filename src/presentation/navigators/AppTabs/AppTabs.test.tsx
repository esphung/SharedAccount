import { NavigationContainer } from "@react-navigation/native";
import { render } from "@testing-library/react-native";
import React from "react";
import AppTabs from "./AppTabs";

jest.mock("@presentation/screens/HomeScreen/HomeScreen", () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react-native/no-raw-text
    default: () => <div>Home</div>,
  };
});
jest.mock("@presentation/screens/ExpensesScreen/ExpensesScreen", () => {
  return {
    __esModule: true,
    // eslint-disable-next-line react-native/no-raw-text
    default: () => <div>Expenses</div>,
  };
});

jest.mock("@domain/contexts/useRepository", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    transactionRepo: {
      getLiveData: jest.fn(),
      stopListening: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getUnsynced: jest.fn(),
      markAsSynced: jest.fn(),
    },
    accountRepo: {
      getLiveData: jest.fn(),
      stopListening: jest.fn(),
      getAll: jest.fn(),
      getById: jest.fn(),
      add: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getUnsynced: jest.fn(),
      markAsSynced: jest.fn(),
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

  it("matches the snapshot", () => {
    const { toJSON } = renderWithNavigation();
    expect(toJSON()).toMatchSnapshot();
  });

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

  it("sets the initial route to ExpensesScreen", () => {
    const { getByText } = renderWithNavigation();

    expect(getByText("Expenses")).toBeTruthy();
  });
});
