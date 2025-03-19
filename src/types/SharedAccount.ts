export type SharedAccount = {
  id: string;
  name: string;
  users: string[]; // Array of user IDs
  balance: number; // Updated balance after transactions
};
