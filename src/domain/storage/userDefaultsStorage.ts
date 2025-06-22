import asyncStorage from "./asyncStorage";

const USER_DEFAULTS_KEY = "user-defaults";

type UserDefaultsKey = "account" | "language";

const userDefaultsStorage = {
	saveItem: (key: UserDefaultsKey, value: string | undefined) => {
		return asyncStorage.setItem(`${USER_DEFAULTS_KEY}-${key}`, value);
	},
	getItem: (key: UserDefaultsKey) => {
		return asyncStorage.getItem<string>(`${USER_DEFAULTS_KEY}-${key}`);
	},
	removeItem: (key: UserDefaultsKey) => {
		return asyncStorage.removeItem(`${USER_DEFAULTS_KEY}-${key}`);
	},
};

export default userDefaultsStorage;
