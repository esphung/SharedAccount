import RealmTransactionRepository from "@repositories/RealmTransactionRepository";
import type { TransactionRepository } from "types/TransactionRepository";

export default class RepositoryFactory {
  static createTransactionRepository(): TransactionRepository {
    return new RealmTransactionRepository(); // Change here if switching databases
  }
}
