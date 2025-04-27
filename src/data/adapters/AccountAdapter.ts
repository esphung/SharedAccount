import type { DataModelAdapter } from "@data/types/DataModelAdapter";
import type { Account } from "types/Account";

type LocalAccount = { toJSON(): object };

const TransactionAdapter: DataModelAdapter<Account, LocalAccount> = {
  localToState(local): Account {
    const json = JSON.parse(JSON.stringify(local));
    const parsed = JSON.parse(JSON.stringify(json));
    const id = parsed.id;
    if (!id) {
      throw new Error("[AccountAdapter] Missing id");
    }

    return {
      ...parsed,
      startingBalance: parsed.startingBalance || 0,
      transactions: parsed.transactions || [],
      name: parsed.name || "",
      id,
    };
  },
};

export default TransactionAdapter;
