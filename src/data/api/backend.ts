import type { ApiClient } from "@data/types/ApiClient";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

// const BASE_URL = "http://localhost:3000/"; // Change this to your actual API base URL
const BASE_URL = "https://calisthenics-fitness-server-05fab1519d7f.herokuapp.com/";

// TODO: Replace with actual remote repository implementation
export const remoteAccountApi: ApiClient<Partial<Account>, Account> = {
	get: async (url: string) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "GET",
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
		}
		// console.debug("[remoteAccountApi:get] response.data:", response.data);
		return response;
	},
	post: async (url: string, data: Partial<Account>) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "POST",
			data,
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to post to ${url}: ${response.statusText}`);
		}
	},
	put: async (url: string, data: Partial<Account>) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "PUT",
			data: JSON.stringify(data),
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to put to ${url}: ${response.statusText}`);
		}
	},
	delete: async (url: string) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "DELETE",
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to delete from ${url}: ${response.statusText}`);
		}
	},
};

// TODO: Replace with actual remote repository implementation
export const remoteTransactionsApi: ApiClient<Partial<Transaction>, Transaction> = {
	get: async (url: string) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "GET",
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to fetch from ${url}: ${response.statusText}`);
		}
		return response;
	},
	post: async (url: string, data: Partial<Transaction>) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "POST",
			data,
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to post to ${url}: ${response.statusText}`);
		}
	},
	put: async (url: string, data: Partial<Transaction>) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "PUT",
			data: JSON.stringify(data),
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to put to ${url}: ${response.statusText}`);
		}
	},
	delete: async (url: string) => {
		const config: AxiosRequestConfig = {
			headers: { "Content-Type": "application/json" },
			baseURL: BASE_URL,
			url,
			method: "DELETE",
		};
		const response = await axios(config);
		if (response.status !== 200) {
			throw new Error(`Failed to delete from ${url}: ${response.statusText}`);
		}
	},
};
