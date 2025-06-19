import BaseBuilder from "@data/models/builders/BaseBuilder";
import type { User } from "@data/models/types/User";

export default class UserBuilder extends BaseBuilder<User> {
	constructor(initialInstance?: Partial<User>, fakerSeed?: number) {
		if (!initialInstance) {
			initialInstance = {
				id: "usr_1234567890" as `usr_${string}`,
				name: "John Doe",
				email: "foo@gmail.com",
				avatar: "https://example.com/avatar.jpg",
			};
		}
		super(initialInstance as User, fakerSeed);
	}

	withId(id: `usr_${string}`): UserBuilder {
		// Ensure the ID starts with "usr_"
		this.instance.id = id;
		return this;
	}

	withName(name: string): UserBuilder {
		this.instance.name = name;
		return this;
	}

	withEmail(email: string): UserBuilder {
		this.instance.email = email;
		return this;
	}

	withAvatar(avatar: string): UserBuilder {
		this.instance.avatar = avatar;
		return this;
	}
}
