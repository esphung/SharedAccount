import type { Account } from "types/Account";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

export type BoundState = {
	authentication: {
		token: string | null;
		setToken: (token: string | null) => void;
	};
	account: {
		account: Account | null;
		setAccount: (account: Account | null) => void;
	};
	user: {
		userId: string | null;
		setUserId: (userId: string | null) => void;
	};
};

export const useStore = create((set) => ({
	authentication: {
		token: null, // Auth0 token, null if not authenticated
		setToken: (token: string | null) =>
			set((prevState: BoundState) => {
				return {
					...prevState,
					authentication: {
						...prevState.authentication,
						token,
					},
				};
			}),
	},
	account: {
		account: null,
		setAccount: (account: Account | null) =>
			set((prevState: BoundState) => {
				return {
					...prevState,
					account: {
						...prevState.account,
						account,
					},
				};
			}),
	},
	user: {
		userId: null, // User ID, null if not logged in
		setUserId: (userId: string | null) =>
			set((prevState: BoundState) => {
				return {
					...prevState,
					user: {
						...prevState.user,
						userId,
					},
				};
			}),
	},
})) as UseBoundStore<StoreApi<BoundState>>;
