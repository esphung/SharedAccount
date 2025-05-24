import asyncStorage from "./asyncStorage";

const USER_DEFAULTS_KEY = "user-defaults";

const userDefaultsStorage = {
	saveItem: (key: "account", value: string | undefined) => {
		return asyncStorage.setItem(`${USER_DEFAULTS_KEY}-${key}`, value);
	},
	getItem: (key: "account") => {
		return asyncStorage.getItem<string>(`${USER_DEFAULTS_KEY}-${key}`);
	},
	removeItem: (key: "account") => {
		return asyncStorage.removeItem(`${USER_DEFAULTS_KEY}-${key}`);
	},
};

export default userDefaultsStorage;
