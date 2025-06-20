import type { ApiClient } from "@data/types/ApiClient";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

const BASE_URL = "http://localhost:3000/"; // Change this to your actual API base URL
// const BASE_URL = "https://calisthenics-fitness-server-05fab1519d7f.herokuapp.com/";

const ApiClientFactory = <T extends { id: string; version: number }>(): ApiClient<
	Partial<T>,
	T
> => {
	// Factory function to create an API client for a specific URL
	return {
		get: async (endpoint: string) => {
			const config: AxiosRequestConfig = {
				headers: { "Content-Type": "application/json" },
				baseURL: BASE_URL,
				url: endpoint,
				method: "GET",
			};
			const response = await axios(config);
			if (response.status !== 200) {
				throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
			}
			return response;
		},
		post: async (endpoint: string, data: Partial<T>) => {
			const config: AxiosRequestConfig = {
				headers: { "Content-Type": "application/json" },
				baseURL: BASE_URL,
				url: endpoint,
				method: "POST",
				data,
			};
			const response = await axios(config);
			if (response.status !== 200) {
				throw new Error(`Failed to post to ${endpoint}: ${response.statusText}`);
			}
		},
		put: async (endpoint: string, data: Partial<T>) => {
			const config: AxiosRequestConfig = {
				headers: { "Content-Type": "application/json" },
				baseURL: BASE_URL,
				url: endpoint,
				method: "PUT",
				data: JSON.stringify(data),
			};
			const response = await axios(config);
			if (response.status !== 200) {
				throw new Error(`Failed to put to ${endpoint}: ${response.statusText}`);
			}
		},
		delete: async (endpoint: string) => {
			const config: AxiosRequestConfig = {
				headers: { "Content-Type": "application/json" },
				baseURL: BASE_URL,
				url: endpoint,
				method: "DELETE",
			};
			const response = await axios(config);
			if (response.status !== 200) {
				throw new Error(`Failed to delete from ${endpoint}: ${response.statusText}`);
			}
		},
	};
};

export const remoteAccountApi = ApiClientFactory<Account>();

export const remoteTransactionsApi = ApiClientFactory<Transaction>();
