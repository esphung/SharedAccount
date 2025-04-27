import BaseBuilder from "@data/models/builders/BaseBuilder";

import type { Transaction } from "@data/models/types/Transaction";

export default class TransactionBuilder extends BaseBuilder<Transaction> {
  constructor(initialInstance?: Partial<Transaction>, fakerSeed?: number) {
    if (!initialInstance) {
      initialInstance = {
        id: "txn_1234567890" as `txn_${string}`,
        sharedAccountId: "acct_1234567890" as `acct_${string}`,
        userId: "usr_1234567890" as `usr_${string}`,
        amount: 100,
        category: "Food",
        name: "Groceries",
        date: new Date(),
        description: "Weekly groceries",
        type: "expense" as const,
      };
    }
    super(initialInstance as Transaction, fakerSeed);
  }

  withId(id: `txn_${string}`): TransactionBuilder {
    // Ensure the ID starts with "txn_"
    this.instance.id = id;
    return this;
  }

  withSharedAccountId(sharedAccountId: `acct_${string}`): TransactionBuilder {
    // Ensure the shared account ID starts with "acct_"
    this.instance.sharedAccountId = sharedAccountId;
    return this;
  }

  withUserId(userId: `usr_${string}`): TransactionBuilder {
    // Ensure the user ID starts with "usr_"
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
