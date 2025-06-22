import type { BoundState } from "@stores/zustand/useStore";

/* simple selector functions for Zustand store */
export const selectAuth0Token = (state: BoundState) => state.authentication.token;

export const selectCurrentAccount = (state: BoundState) => state.account.account;

export const selectSetAccountSlice = (state: BoundState) => state.account;

export const selectCurrentUserId = (state: BoundState) => state.user.userId;

export const selectSetUserId = (state: BoundState) => state.user.setUserId;
