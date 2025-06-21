export type Transaction<T = "credit" | "expense"> = {
	id: string;
	sharedAccountId: string;
	userId: string; // who created the transaction
	amount: number; // in cents
	name: string;
	category: string; // e.g., "Food", "Transport", "Entertainment"
	description?: string; // Optional
	date: Date; // when the transaction occurred
	type: T; // To differentiate between credits and expenses
	version: number; // For optimistic updates and conflict resolution
};
