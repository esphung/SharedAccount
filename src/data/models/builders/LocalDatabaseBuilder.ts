import BaseBuilder from "@data/models/builders/BaseBuilder";
import ScheduledTransactionBuilder from "@data/models/builders/ScheduledTransactionBuilder";
import TransactionBuilder from "@data/models/builders/TransactionBuilder";
import UserBuilder from "@data/models/builders/UserBuilder";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import type { Transaction } from "types/Transaction";
import type { User } from "types/User";

type LocalDatabase = {
  users: User[];
  transactions: Transaction[];
  scheduledTransactions: ScheduledTransaction[];
};

export default class LocalDatabaseBuilder extends BaseBuilder<LocalDatabase> {
  constructor() {
    const fakeSharedAccountId: `acct_${string}` = `acct_${faker.database.mongodbObjectId()}`;
    const fakeUserId1: `usr_${string}` = `usr_${faker.database.mongodbObjectId()}`;
    const fakeUserId2: `usr_${string}` = `usr_${faker.database.mongodbObjectId()}`;

    // For adding userIds to transactions
    const users: User[] = [
      new UserBuilder().setId(fakeUserId1).build(),
      new UserBuilder().setId(fakeUserId2).build(),
    ];

    const transactions: Transaction[] = [
      ...Array.from({ length: 80 }, (_, i) => {
        const fakeUserId: `usr_${string}` = `usr_${faker.helpers.arrayElement(users).id.replace("usr_", "")}`;
        return new TransactionBuilder(
          faker.helpers.arrayElement(["credit", "expense"]),
        )
          .setSharedAccountId(fakeSharedAccountId)
          .setDate(
            DateTime.fromJSDate(faker.date.recent())
              .plus({ days: i })
              .toJSDate(),
          )
          .setUserId(fakeUserId)
          .build();
      }),
    ];
    const scheduledTransactions: ScheduledTransaction[] = [];
    Array.from({ length: 4 }, () => {
      const transaction = new ScheduledTransactionBuilder(
        // faker.helpers.arrayElement(["credit", "expense"]),
        // every other transaction is a credit
        faker.helpers.arrayElement(["credit", "expense"]),
      )
        .setSharedAccountId(fakeSharedAccountId)
        .setStartDate(faker.date.recent())
        .setAmount(faker.number.int({ min: 100, max: 10000 }))
        .build();
      scheduledTransactions.push(transaction);
    });
    scheduledTransactions.push(
      new ScheduledTransactionBuilder("expense")
        .setSharedAccountId(fakeSharedAccountId)
        .setName("NEW TEST DEBUG")
        .setStartDate(DateTime.now().toJSDate())
        .setAmount(100)
        .build(),
    );
    const initial: LocalDatabase = {
      users,
      transactions,
      scheduledTransactions,
    };
    super(initial);
  }
}
