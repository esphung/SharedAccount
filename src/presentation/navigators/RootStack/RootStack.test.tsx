import RootStack from "@presentation/navigators/RootStack/RootStack";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@realm/react", () => ({ RealmProvider: jest.fn() }));

jest.mock("@config/realmSchema", () => {
  return { realmSchemaVersion: 2 };
});

jest.mock("@domain/providers/RepositoryProvider", () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

// mock the userDefaultsStorage
jest.mock("@domain/storage/userDefaultsStorage", () => ({
  __esModule: true,
  default: {
    getItem: () => Promise.resolve(null),
    saveItem: () => Promise.resolve(),
    removeItem: () => Promise.resolve(),
  },
}));

describe("RootStack", () => {
  it("renders", () => {
    const tree = render(<RootStack />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
