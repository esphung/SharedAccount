export type Transaction<T = "credit" | "expense"> = {
	id: `txn_${string}`;
	sharedAccountId: `acct_${string}`;
	userId: `usr_${string}`; // who created the transaction
	amount: number; // in cents
	name: string;
	category: string; // e.g., "Food", "Transport", "Entertainment"
	description?: string; // Optional
	date: Date; // when the transaction occurred
	type: T; // To differentiate between credits and expenses
	version: number; // For optimistic updates and conflict resolution
};
