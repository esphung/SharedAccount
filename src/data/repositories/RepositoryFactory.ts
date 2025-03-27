import type { ScheduledTransaction } from "@data/models/types/ScheduledTransaction";
import type { Transaction } from "@data/models/types/Transaction";
import RealmScheduledTransactionRepository from "@data/repositories/realm/RealmScheduledTransactionRepository";
import RealmTransactionRepository from "@data/repositories/realm/RealmTransactionRepository";
import type { DataModelRepository } from "@data/types/DataModelRepository";

export default class RepositoryFactory {
  static createTransactionRepository(): DataModelRepository<Transaction> {
    return new RealmTransactionRepository(); // Change here if switching databases
  }
  static createScheduledTransactionRepository(): DataModelRepository<ScheduledTransaction> {
    return new RealmScheduledTransactionRepository(); // Change here if switching databases
  }
}
