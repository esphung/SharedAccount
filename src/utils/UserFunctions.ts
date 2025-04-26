import type { User } from "@data/models/types/User";

export const getUserById = (userId: string, users: User[] = []) => users.find((user) => user.id === userId);
