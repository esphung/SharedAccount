import BaseBuilder from "@data/models/builders/BaseBuilder";

import type { Transaction } from "@data/models/types/Transaction";

export default class TransactionBuilder extends BaseBuilder<Transaction> {
  constructor(initialInstance?: Partial<Transaction>, fakerSeed?: number) {
    const result: Transaction = {
      id: "txn_1234567890",
      sharedAccountId: "acct_1234567890",
      userId: "usr_1234567890",
      amount: 100,
      category: "Food",
      name: "Groceries",
      date: new Date("2023-10-01"),
      description: "Weekly groceries",
      type: "expense" as const,
      ...initialInstance,
    };
    super(result, fakerSeed);
  }

  withId(id: `txn_${string}`): TransactionBuilder {
    // Ensure the ID starts with "txn_"
    this.instance.id = id;
    return this;
  }

  withSharedAccountId(sharedAccountId: `acct_${string}`): TransactionBuilder {
    this.instance.sharedAccountId = sharedAccountId;
    return this;
  }

  withUserId(userId: `usr_${string}`): TransactionBuilder {
    this.instance.userId = userId;
    return this;
  }

  withAmount(amount: number): TransactionBuilder {
    this.instance.amount = amount;
    return this;
  }

  withCategory(category: string): TransactionBuilder {
    this.instance.category = category;
    return this;
  }

  withName(name: string): TransactionBuilder {
    this.instance.name = name;
    return this;
  }

  withDate(date: Date): TransactionBuilder {
    this.instance.date = date;
    return this;
  }

  withDescription(description: string): TransactionBuilder {
    this.instance.description = description;
    return this;
  }

  withType(type: "expense" | "credit"): TransactionBuilder {
    this.instance.type = type;
    return this;
  }

  withTransaction(transaction: Transaction): TransactionBuilder {
    this.instance = transaction;
    return this;
  }

  build(): Transaction {
    return this.instance;
  }
}
