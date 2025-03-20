import BaseBuilder from "@data/models/builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import type { Transaction } from "types/Transaction";

export default class TransactionBuilder extends BaseBuilder<Transaction> {
  constructor(type: "expense" | "credit") {
    const initial: Transaction = {
      id: `txn_${faker.database.mongodbObjectId()}`,
      sharedAccountId: `acct_${faker.database.mongodbObjectId()}`,
      userId: `usr_${faker.database.mongodbObjectId()}`,
      amount: faker.number.int({ min: 100, max: 10000 }),
      category: faker.commerce.department(),
      name: faker.company.name(),
      date: faker.date.recent(),
      type,
    };
    super(initial);
  }

  setId(id: `txn_${string}`): this {
    return this.set("id", id);
  }

  setSharedAccountId(sharedAccountId: `acct_${string}`): this {
    return this.set("sharedAccountId", sharedAccountId);
  }

  setUserId(userId: `usr_${string}`): this {
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

  setName(name: string): this {
    return this.set("name", name);
  }
}
