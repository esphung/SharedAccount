export type Credit = {
  id: string;
  sharedAccountId: string;
  userId: string; // Who added the credit
  amount: number;
  source?: string; // e.g., "Salary", "Gift", "Reimbursement"
  description?: string;
  date: Date;
  type: "credit"; // To differentiate from expenses
};
