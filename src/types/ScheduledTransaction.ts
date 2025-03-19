import type { Transaction } from "types/Transaction";

export type ScheduledTransaction<T = "credit" | "expense"> = {
  id: `scheduled_${string}`;
  repeatInterval: "monthly";
  startDate: Date;
  endDate?: Date; // Optional
  dayOfMonth: number; // 1-28 (or 31)
} & Omit<Transaction<T>, "id" | "date" | "userId">;
