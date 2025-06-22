import type { ApiClient } from "@data/types/ApiClient";
import type { DataModelRepository } from "@data/types/DataModelRepository";

type EndpointURL = "/accounts" | "/transactions" | "/account_users";

export default class RemoteRepository<T> implements DataModelRepository<T, "remote"> {
	private apiClient: ApiClient<Partial<T>, T>;
	private route: EndpointURL; // The route for the API, e.g., "/accounts"
	private adapter: {
		remoteToState: (remote: T) => T;
		stateToRemote: (state: T) => Partial<T>;
	};
	private getToken: () => string | null; // Function to retrieve the token for authentication

	constructor(
		apiClient: ApiClient<Partial<T>, T>,
		route: EndpointURL,
		adapter: {
			remoteToState: (remote: T) => T;
			stateToRemote: (state: T) => Partial<T>;
		},
		getToken: () => string | null // Optional token retrieval function for authentication
	) {
		this.apiClient = apiClient;
		this.route = route;
		this.adapter = adapter;
		this.getToken = getToken;
	}

	private getAuthHeaders(): Record<string, string> {
		const token = this.getToken();
		return token ? { Authorization: `Bearer ${token}` } : {};
	}

	async getAll(): Promise<T[]> {
		try {
			const headers = this.getAuthHeaders();
			const { data: responseData } = await this.apiClient.get(this.route, headers);
			return responseData.data.map((item: T) => this.adapter.remoteToState(item));
		} catch (error) {
			console.error("[RemoteRepository] Error fetching items:", error);
			return [];
		}
	}

	async getById(id: string): Promise<T | null> {
		try {
			const headers = this.getAuthHeaders();
			const { data: responseData } = await this.apiClient.get(`${this.route}/${id}`, headers);
			return this.adapter.remoteToState(responseData.data?.[0]) || null;
		} catch (error) {
			console.warn(`[RemoteRepository] Item not found: ${id}`);
			return null;
		}
	}

	async add(item: T): Promise<void> {
		try {
			const headers = this.getAuthHeaders();
			const payload = this.adapter.stateToRemote(item);
			await this.apiClient.post(this.route, payload, headers);
		} catch (error) {
			console.error("[RemoteRepository] Error adding item:", error);
			throw error;
		}
	}

	async update(item: T): Promise<void> {
		try {
			const headers = this.getAuthHeaders();
			const payload = this.adapter.stateToRemote(item);
			await this.apiClient.put(
				`${this.route}/${(item as { id: string }).id}`,
				payload,
				headers
			);
		} catch (error) {
			console.error("[RemoteRepository] Error updating item:", error);
			throw error;
		}
	}

	async delete(id: string): Promise<void> {
		try {
			const headers = this.getAuthHeaders();
			await this.apiClient.delete(`${this.route}/${id}`, headers);
		} catch (error) {
			console.error("[RemoteRepository] Error deleting item:", error);
			throw error;
		}
	}
}
