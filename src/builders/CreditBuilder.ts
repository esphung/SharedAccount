import BaseBuilder from "@builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type { Credit } from "types/Credit";

export default class CreditBuilder extends BaseBuilder<Credit> {
  constructor() {
    const initial: Credit = {
      id: faker.database.mongodbObjectId(),
      sharedAccountId: faker.database.mongodbObjectId(),
      userId: faker.database.mongodbObjectId(),
      amount: faker.number.int({ min: 100, max: 10000 }),
      source: faker.commerce.department(),
      date: DateTime.now().toJSDate(),
      type: "credit",
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

  setCategory(source: string): this {
    return this.set("source", source);
  }

  setDescription(description: string): this {
    return this.set("description", description);
  }

  setDate(date: Date): this {
    return this.set("date", date);
  }

  setType(type: "credit"): this {
    return this.set("type", type);
  }
}
