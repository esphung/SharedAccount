import RealmAccount from "@data/models/realm/RealmAccount";
import RealmTransaction from "@data/models/realm/RealmTransaction";

export const realmSchemaVersion = 2;

export const realmSchema = [RealmTransaction, RealmAccount];
