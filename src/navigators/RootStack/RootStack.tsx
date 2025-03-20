import { realmSchema, realmSchemaVerison } from "@config/realmSchema";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import AppTabs from "@navigators/AppTabs/AppTabs";
import { RealmProvider } from "@realm/react";
import React from "react";

function RootStack() {
  return (
    <RepositoryProvider>
      <RealmProvider schema={realmSchema} schemaVersion={realmSchemaVerison}>
        <AppTabs />
      </RealmProvider>
    </RepositoryProvider>
  );
}

export default RootStack;
