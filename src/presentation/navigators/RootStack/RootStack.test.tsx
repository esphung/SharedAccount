import RootStack from "@presentation/navigators/RootStack/RootStack";
import { render } from "@testing-library/react-native";
import React from "react";

jest.mock("@presentation/navigators/AppTabs/AppTabs", () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

jest.mock("@realm/react", () => ({ RealmProvider: jest.fn() }));

jest.mock("@config/realmSchema", () => {
  return { realmSchemaVerison: 2 };
});

jest.mock("@domain/providers/RepositoryProvider", () => ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
));

describe("RootStack", () => {
  it("renders", () => {
    const tree = render(<RootStack />);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
