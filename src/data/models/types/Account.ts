import type { Transaction } from "@data/models/types/Transaction";

export type Account = {
  id: `acct_${string}`;
  name: string;
  startingBalance: number;
  transactions: Transaction[];
};
