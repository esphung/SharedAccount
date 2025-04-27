import { faker } from "@faker-js/faker";

export default class BaseBuilder<T> {
  protected instance: T;

  constructor(initialInstance: T, fakerSeed?: number) {
    this.instance = initialInstance;
    faker.seed(fakerSeed);
  }

  /**
   * Returns the built object.
   */
  build(): T {
    return this.instance;
  }
}
