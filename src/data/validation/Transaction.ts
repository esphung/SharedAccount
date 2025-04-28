import type { Transaction } from "types/Transaction";

export const isExpenseTransaction = (transaction: Transaction): transaction is Transaction<"expense"> =>
  transaction.type === "expense";

export const isCreditTransaction = (transaction: Transaction): transaction is Transaction<"credit"> =>
  transaction.type === "credit";
