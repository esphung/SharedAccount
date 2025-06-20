import { realmSchema, realmSchemaVersion } from "@config/realmSchema";
import { AccountsProvider } from "@domain/providers/AccountsProvider";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import { TransactionsProvider } from "@domain/providers/TransactionsProvider";
import AppTabs from "@presentation/navigators/AppTabs/AppTabs";
import { RealmProvider } from "@realm/react";
import React from "react";

function RootStack() {
	return (
		<RealmProvider schema={realmSchema} schemaVersion={realmSchemaVersion}>
			<RepositoryProvider>
				<TransactionsProvider>
					<AccountsProvider>
						<AppTabs />
					</AccountsProvider>
				</TransactionsProvider>
			</RepositoryProvider>
		</RealmProvider>
	);
}

export default RootStack;
