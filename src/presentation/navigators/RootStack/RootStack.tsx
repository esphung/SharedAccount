import { realmSchema, realmSchemaVersion } from "@config/realmSchema";
import { AccountUsersProvider } from "@domain/providers/AccountUsersProvider";
import { AccountsProvider } from "@domain/providers/AccountsProvider";
import RepositoryProvider from "@domain/providers/RepositoryProvider";
import { TransactionsProvider } from "@domain/providers/TransactionsProvider";
import { selectAuth0SetToken } from "@domain/stores/zustand/actions";
import { selectAuth0Token } from "@domain/stores/zustand/selectors";
import SplashStack from "@navigators/SplashStack/SplashStack";
import AppTabs from "@presentation/navigators/AppTabs/AppTabs";
import { RealmProvider } from "@realm/react";
import LoginScreen from "@screens/LoginScreen/LoginScreen";
import type { BoundState } from "@stores/zustand/useStore";
import { useStore } from "@stores/zustand/useStore";
import React, { useEffect } from "react";
import { useAuth0 } from "react-native-auth0";

const selectUserId = (state: BoundState) => state.user?.userId;
const setUserIdAction = (state: BoundState) => state.user.setUserId;

const AllRemoteLocalRepositoriesWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<RepositoryProvider>
			<TransactionsProvider>
				<AccountsProvider>
					<AccountUsersProvider>{children}</AccountUsersProvider>
				</AccountsProvider>
			</TransactionsProvider>
		</RepositoryProvider>
	);
};

function RootStack() {
	const { user: auth0User, getCredentials } = useAuth0();
	// Zustand store selectors
	const token = useStore(selectAuth0Token);
	const userId = useStore(selectUserId);
	const setUserId = useStore(setUserIdAction);
	const setToken = useStore(selectAuth0SetToken);

	const memoizedStack = React.useMemo(() => {
		if (!token) {
			return <LoginScreen />;
		}
		// If the user is not logged in, show the splash stack
		if (!userId || (!!userId && !token)) {
			return <SplashStack />;
		}
		return (
			<AllRemoteLocalRepositoriesWrapper>
				<AppTabs />
			</AllRemoteLocalRepositoriesWrapper>
		);
	}, [token, userId]);

	useEffect(() => {
		if (!!token && !userId && !!auth0User?.sub) {
			// set the userId in Zustand store if token is set but userId is not
			setUserId(auth0User.sub);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [token, userId, auth0User]);

	useEffect(
		() => {
			const bootstrapUser = async () => {
				if (!auth0User?.sub) {
					return;
				}

				// Set the token in Zustand store first
				try {
					const credentials = await getCredentials();
					if (credentials?.idToken) {
						setToken(credentials?.idToken);
					}
				} catch (error) {
					console.error("[RootStack] Error fetching credentials:", error);
				}
			};

			bootstrapUser();
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[auth0User?.sub]
	);

	return (
		<RealmProvider schema={realmSchema} schemaVersion={realmSchemaVersion}>
			{memoizedStack}
		</RealmProvider>
	);
}

export default RootStack;
