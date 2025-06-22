import type { ApiClient } from "@data/types/ApiClient";
// import { CALISTHENICS_API_BASE_URL } from "@env";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";
import PKG_JSON from "../../../package.json";
import type { AccountUsers } from "./../types/AccountUsers";

const { debugLocalHost } = PKG_JSON;

const baseURL =
	debugLocalHost === true
		? "http://localhost:3000"
		: process.env.CALISTHENICS_API_BASE_URL || "https://api.calistenics.app";

console.info(`[ApiClient] Using base URL: ${baseURL}`);

const axiosInstance = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

const ApiClientFactory = <T>(): ApiClient<Partial<T>, T> => {
	return {
		get: async (endpoint: string, options: AxiosRequestConfig["headers"]) => {
			const response = await axiosInstance.get(endpoint, {
				headers: {
					Accept: "application/json",
					...options,
				},
			});

			if (response.status !== 200) {
				throw new Error(`Failed to fetch from ${endpoint}: ${response.statusText}`);
			}
			return response;
		},
		post: async (
			endpoint: string,
			data: Partial<T>,
			options: AxiosRequestConfig["headers"]
		) => {
			const response = await axiosInstance.post(endpoint, data, {
				headers: {
					Accept: "application/json",
					...options,
				},
			});

			if (response.status !== 200 && response.status !== 201) {
				throw new Error(`Failed to post to ${endpoint}: ${response.statusText}`);
			}
		},
		put: async (endpoint: string, data: Partial<T>, options: AxiosRequestConfig["headers"]) => {
			const response = await axiosInstance.put(endpoint, data, {
				headers: {
					Accept: "application/json",
					...options,
				},
			});

			if (response.status !== 200) {
				throw new Error(`Failed to put to ${endpoint}: ${response.statusText}`);
			}
		},
		delete: async (endpoint: string, options: AxiosRequestConfig["headers"]) => {
			const response = await axiosInstance.delete(endpoint, {
				headers: {
					Accept: "application/json",
					...options,
				},
			});

			if (response.status !== 200 && response.status !== 204) {
				throw new Error(`Failed to delete from ${endpoint}: ${response.statusText}`);
			}
		},
	};
};

export const remoteAccountApi = ApiClientFactory<Account>();
export const remoteTransactionsApi = ApiClientFactory<Transaction>();
export const remoteAccountUsersApi = ApiClientFactory<AccountUsers>();
