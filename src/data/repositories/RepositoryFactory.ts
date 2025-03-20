import RealmScheduledTransactionRepository from "@data/repositories/realm/RealmScheduledTransactionRepository";
import RealmTransactionRepository from "@data/repositories/realm/RealmTransactionRepository";
import type { DataModelRepository } from "types/DataModelRepository";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import type { Transaction } from "types/Transaction";

export default class RepositoryFactory {
  static createTransactionRepository(): DataModelRepository<Transaction> {
    return new RealmTransactionRepository(); // Change here if switching databases
  }
  static createScheduledTransactionRepository(): DataModelRepository<ScheduledTransaction> {
    return new RealmScheduledTransactionRepository(); // Change here if switching databases
  }
}
