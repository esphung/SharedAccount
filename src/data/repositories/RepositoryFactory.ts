import type { Transaction } from "@data/models/types/Transaction";
import RealmTransactionRepository from "@data/repositories/realm/RealmTransactionRepository";
import type { DataModelRepository } from "@data/types/DataModelRepository";
import type { Account } from "types/Account";
import RealmAccountRepository from "./realm/RealmAccountRepository";

export default class RepositoryFactory {
  static createTransactionRepository(): DataModelRepository<Transaction> {
    return new RealmTransactionRepository(); // Change here if switching databases
  }
  static createAccountRepository(): DataModelRepository<Account> {
    return new RealmAccountRepository(); // Change here if switching databases
  }
}
