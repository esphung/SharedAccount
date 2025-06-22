export const selectAuth0SetToken = (state: {
	authentication: { setToken: (token: string | null) => void };
}) => state.authentication.setToken;
