import BaseBuilder from "@builders/BaseBuilder";
import { faker } from "@faker-js/faker";
import { DateTime } from "luxon";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import type { Transaction } from "types/Transaction";
import type { User } from "types/User";
import ScheduledTransactionBuilder from "./ScheduledTransactionBuilder";
import TransactionBuilder from "./TransactionBuilder";
import UserBuilder from "./UserBuilder";

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
      ...Array.from({ length: 40 }, (_, i) => {
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
    Array.from({ length: 40 }, () => {
      const transaction = new ScheduledTransactionBuilder(
        faker.helpers.arrayElement(["credit", "expense"]),
      )
        .setSharedAccountId(fakeSharedAccountId)
        .setStartDate(faker.date.recent())
        .setAmount(faker.number.int({ min: 100, max: 10000 }))
        .build();
      scheduledTransactions.push(transaction);
    });
    const initial: LocalDatabase = {
      users,
      transactions,
      scheduledTransactions,
    };
    super(initial);
  }
}
