import AsyncStorage from "@react-native-async-storage/async-storage";

const asyncStorage = {
	getItem: async <T>(key: string): Promise<T | null> => {
		const value = await AsyncStorage.getItem(key);
		return value ? (JSON.parse(value) as T) : null;
	},
	setItem: async (key: string, value: unknown): Promise<void> => {
		await AsyncStorage.setItem(key, JSON.stringify(value));
	},
	removeItem: async (key: string): Promise<void> => {
		await AsyncStorage.removeItem(key);
	},
	clear: async (): Promise<void> => {
		await AsyncStorage.clear();
	},
};

export default asyncStorage;
