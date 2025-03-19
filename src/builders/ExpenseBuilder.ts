import BaseBuilder from "@builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type { Expense } from "types/Expense";

export default class ExpenseBuilder extends BaseBuilder<Expense> {
  constructor() {
    const initial: Expense = {
      id: faker.database.mongodbObjectId(),
      sharedAccountId: faker.database.mongodbObjectId(),
      userId: faker.database.mongodbObjectId(),
      amount: faker.number.int({ min: 100, max: 10000 }),
      category: faker.commerce.department(),
      date: DateTime.now().toJSDate(),
      type: "expense",
    };
    super(initial);
  }

  setId(id: string): this {
    return this.set("id", id);
  }

  setSharedAccountId(sharedAccountId: string): this {
    return this.set("sharedAccountId", sharedAccountId);
  }

  setUserId(userId: string): this {
    return this.set("userId", userId);
  }

  setAmount(amount: number): this {
    return this.set("amount", amount);
  }

  setCategory(category: string): this {
    return this.set("category", category);
  }

  setDescription(description: string): this {
    return this.set("description", description);
  }

  setDate(date: Date): this {
    return this.set("date", date);
  }

  setType(type: "expense"): this {
    return this.set("type", type);
  }
}
