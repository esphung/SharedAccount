export type RealmSubscription<T> = Realm.Results<Realm.Object<T, never> & T>;
