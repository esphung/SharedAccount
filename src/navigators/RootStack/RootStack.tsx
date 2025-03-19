import { RepositoryProvider } from "@contexts/RepositoryProvider";
import AppTabs from "@navigators/AppTabs/AppTabs";
import { RealmProvider } from "@realm/react";
import RealmTransaction from "@services/realm/models/RealmTransaction";
import React from "react";

function RootStack() {
  return (
    <RepositoryProvider>
      <RealmProvider schema={[RealmTransaction]} schemaVersion={1}>
        <AppTabs />
      </RealmProvider>
    </RepositoryProvider>
  );
}

export default RootStack;
