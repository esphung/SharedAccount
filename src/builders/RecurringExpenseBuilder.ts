import BaseBuilder from "@builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import type { RecurringExpense } from "types/RecurringExpense";

export default class RecurringExpenseBuilder extends BaseBuilder<RecurringExpense> {
  constructor() {
    const initial: RecurringExpense = {
      id: faker.database.mongodbObjectId(),
      sharedAccountId: faker.database.mongodbObjectId(), // 🔹 Add this field for account linking
      amount: faker.number.int({ min: 1000, max: 100000 }),
      name: faker.lorem.words(),
      category: faker.lorem.word(),
      startDate: faker.date.recent(),
      repeatInterval: faker.helpers.arrayElement([
        "weekly",
        "monthly",
        "yearly",
      ]),
    };
    super(initial);
  }

  setId(id: string): this {
    return this.set("id", id);
  }

  setSharedAccountId(sharedAccountId: string): this {
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

  setStartDate(startDate: Date): this {
    return this.set("startDate", startDate);
  }

  setRepeatInterval(repeatInterval: "weekly" | "monthly" | "yearly"): this {
    return this.set("repeatInterval", repeatInterval);
  }

  setEndDate(endDate: Date): this {
    return this.set("endDate", endDate);
  }
}
