import { realmSchema, realmSchemaVersion } from "@config/realmSchema";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import AppTabs from "@presentation/navigators/AppTabs/AppTabs";
import { RealmProvider } from "@realm/react";
import React from "react";

function RootStack() {
  return (
    <RepositoryProvider>
      <RealmProvider schema={realmSchema} schemaVersion={realmSchemaVersion}>
        <AppTabs />
      </RealmProvider>
    </RepositoryProvider>
  );
}

export default RootStack;
