import type { DataModelAdapter } from "@data/types/DataModelAdapter";
import type { Account } from "types/Account";
import TransactionAdapter from "./TransactionAdapter";

type LocalAccount = { toJSON(): object };

const AccountAdapter: DataModelAdapter<Account, LocalAccount> = {
  localToState(local): Account {
    const json = local.toJSON ? local.toJSON() : local;
    const parsed = JSON.parse(JSON.stringify(json));
    const id = parsed.id;
    if (!id) {
      throw new Error("[AccountAdapter] Missing id");
    }

    const transactions = [...(parsed.transactions || [])].map(TransactionAdapter.localToState);
    return {
      ...parsed,
      startingBalance: parsed.startingBalance || 0,
      transactions,
      name: parsed.name || "",
      id,
    };
  },
};

export default AccountAdapter;
