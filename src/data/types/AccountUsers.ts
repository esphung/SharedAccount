// For the shared account users table
export type AccountUsers = {
	id: number; // auto-incremented ID
	userId: string;
	sharedAccountId: string;
	role: "admin" | "editor" | "viewer"; // controls access
	accepted: boolean;
};
