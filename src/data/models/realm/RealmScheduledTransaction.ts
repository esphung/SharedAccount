import type { ScheduledTransaction } from "@data/models/types/ScheduledTransaction";
import { Realm } from "@realm/react";

const initialDate = new Date();
const initialDayOfMonth = initialDate.getDate();
const initialMonthsOfYear = Array.from({ length: 12 }, (_, i) => i + 1);

export default class RealmScheduledTransaction extends Realm.Object implements ScheduledTransaction {
  id: `schd_${string}` = `schd_${Math.random().toString(36).substr(2, 9)}`;
  sharedAccountId: `acct_${string}` = `acct_${Math.random().toString(36).substr(2, 9)}`;
  amount: number = 0.0;
  name: string = "";
  category: string = "";
  description?: string;
  type: "credit" | "expense" = "expense";
  repeatInterval: "monthly" = "monthly" as const;
  startDate: Date = initialDate;
  endDate?: Date | undefined = undefined;
  dayOfMonth: number = initialDayOfMonth;
  monthsOfYear: number[] = initialMonthsOfYear;

  static schema = {
    name: "ScheduledTransaction",
    primaryKey: "id",
    properties: {
      id: "string",
      sharedAccountId: "string",
      amount: "int",
      name: "string",
      category: "string",
      description: "string?",
      type: "string",
      repeatInterval: "string",
      startDate: "date",
      endDate: "date?",
      dayOfMonth: "int",
      monthsOfYear: "int[]",
    },
  };
}
