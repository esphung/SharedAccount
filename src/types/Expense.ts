export type Expense = {
  id: string;
  sharedAccountId: string;
  userId: string; // Who added the expense
  amount: number; // in cents
  category: string;
  description?: string;
  date: Date;
  type: "expense"; // To differentiate from credits
};
