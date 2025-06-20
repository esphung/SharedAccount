import { create } from "zustand";

/* types */
type AuthenticationState = {
	token: string | null;
	setToken: (token: string | null) => void;
};

export type StoreState = {
	authentication: AuthenticationState;
};

/* Simple selectors */
export const selectAuth0Token = (state: StoreState) => state.authentication.token;

/* Action creators */
export const setAuth0Token = (state: StoreState) => state.authentication.setToken;

// store
export const useStore = create<StoreState>((set) => ({
	authentication: {
		token: null,

		setToken: (token: string | null) =>
			set((state) => {
				if (state.authentication.token === token) {
					return state;
				}
				return {
					...state,
					authentication: {
						...state.authentication,
						token,
					},
				};
			}),
	},
}));
