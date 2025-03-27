export type ScheduledTransaction<T = "credit" | "expense"> = {
  id: `schd_${string}`; // Unique ID
  sharedAccountId: `acct_${string}`;
  name: string; // Name of the scheduled transaction
  repeatInterval: "monthly"; // Only monthly is supported
  startDate: Date; // When the scheduled transaction should start
  endDate?: Date; // When the scheduled transaction should stop
  dayOfMonth: number; // 1 to (28, 30, 31)
  amount: number; // In cents
  category: string; // Category ID
  description?: string; // Optional
  monthsOfYear: number[]; // 1-12
  type: T; // To differentiate between credits and expenses
};
