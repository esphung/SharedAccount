import BaseBuilder from "@data/models/builders/BaseBuilder";
import type { User } from "@data/models/types/User";
import { faker } from "@faker-js/faker";

export default class UserBuilder extends BaseBuilder<User> {
  constructor() {
    const initial: User = {
      id: faker.database.mongodbObjectId(),
      name: `${faker.person.fullName()}`,
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
    };
    super(initial);
  }

  setId(id: string): this {
    return this.set("id", id);
  }

  setName(name: string): this {
    return this.set("name", name);
  }

  setEmail(email: string): this {
    return this.set("email", email);
  }

  setAvatar(avatar: string): this {
    return this.set("avatar", avatar);
  }
}
