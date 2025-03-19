export type RecurringExpense = {
  id: string;
  sharedAccountId: string; // 🔹 Add this field for account linking
  name: string;
  amount: number;
  category: string;
  startDate: Date;
  repeatInterval: "weekly" | "monthly" | "yearly";
  endDate?: Date; // Optional
};
