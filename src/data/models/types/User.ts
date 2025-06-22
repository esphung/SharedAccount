export type User = {
	id: string; // Unique user ID
	name: string; // User's full name
	email: string; // Unique email for login
	avatar?: string; // URL to user's avatar
	version: number; // Version for schema migrations
	status: "active" | "inactive"; // User status
};
