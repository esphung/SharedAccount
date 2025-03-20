import BaseBuilder from "@data/models/builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type { ScheduledTransaction } from "types/ScheduledTransaction";

export default class ScheduledTransactionBuilder extends BaseBuilder<ScheduledTransaction> {
  constructor(type: "credit" | "expense") {
    const initial: ScheduledTransaction = {
      id: `schd_${faker.database.mongodbObjectId()}`,
      sharedAccountId: `acct_${faker.database.mongodbObjectId()}`,
      amount: faker.number.int({ min: 1000, max: 100000 }),
      category: faker.lorem.word(),
      dayOfMonth: faker.number.int({ min: 1, max: 28 }),
      startDate: DateTime.fromJSDate(faker.date.recent())
        .plus({ days: 1 })
        .toJSDate(),
      endDate: faker.date.future(),
      repeatInterval: faker.helpers.arrayElement(["monthly"]),
      name: faker.company.name(),
      type,
      monthsOfYear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    };
    super(initial);
  }

  setId(id: `schd_${string}`): this {
    return this.set("id", id);
  }

  setSharedAccountId(sharedAccountId: `acct_${string}`): this {
    return this.set("sharedAccountId", sharedAccountId);
  }

  setAmount(amount: number): this {
    return this.set("amount", amount);
  }

  setName(name: string): this {
    return this.set("name", name);
  }

  setCategory(category: string): this {
    return this.set("category", category);
  }

  setRepeatInterval(repeatInterval: "monthly"): this {
    return this.set("repeatInterval", repeatInterval);
  }

  setEndDate(endDate: Date): this {
    return this.set("endDate", endDate);
  }

  setType(type: "expense"): this {
    return this.set("type", type);
  }

  setDayOfMonth(dayOfMonth: number): this {
    return this.set("dayOfMonth", dayOfMonth);
  }

  setStartDate(startDate: Date): this {
    return this.set("startDate", startDate);
  }

  setDescription(description: string): this {
    return this.set("description", description);
  }

  setMonthsOfYear(monthsOfYear: number[]): this {
    return this.set("monthsOfYear", monthsOfYear);
  }
}
