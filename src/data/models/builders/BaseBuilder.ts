export default class BaseBuilder<T> {
  protected instance: Partial<T> = {};

  constructor(base?: Partial<T>) {
    if (base) {
      this.instance = { ...base };
    }
  }

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.instance[key] = value;
    return this;
  }

  build(): T {
    return this.instance as T;
  }
}
