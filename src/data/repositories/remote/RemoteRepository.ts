import type { ApiClient } from "@data/types/ApiClient";
import type { DataModelRepository } from "@data/types/DataModelRepository";

export default class RemoteAccountRepository<T> implements DataModelRepository<T, "remote"> {
	private apiClient: ApiClient<Partial<T>, T>;
	private route: string; // The route for the API, e.g., "/accounts"
	private adapter: {
		remoteToState: (remote: T) => T;
		stateToRemote: (state: T) => Partial<T>;
	};

	constructor(
		apiClient: ApiClient<Partial<T>, T>,
		route: string,
		adapter: {
			remoteToState: (remote: T) => T;
			stateToRemote: (state: T) => Partial<T>;
		}
	) {
		this.apiClient = apiClient;
		this.route = route;
		this.adapter = adapter;
	}

	async getAll(): Promise<T[]> {
		try {
			const { data: responseData } = await this.apiClient.get(this.route);
			return responseData.data.map((item: T) => this.adapter.remoteToState(item));
		} catch (error) {
			console.error("[RemoteAccountRepository] Error fetching items:", error);
			return [];
		}
	}

	async getById(id: string): Promise<T | null> {
		try {
			const { data: responseData } = await this.apiClient.get(`${this.route}/${id}`);
			return this.adapter.remoteToState(responseData.data?.[0]) || null;
		} catch (error) {
			console.warn(`[RemoteAccountRepository] Item not found: ${id}`);
			return null;
		}
	}

	async add(item: T): Promise<void> {
		await this.apiClient.post(this.route, this.adapter.stateToRemote(item));
	}

	async update(item: T): Promise<void> {
		await this.apiClient.put(
			`${this.route}/${(item as unknown as { id: string }).id}`,
			this.adapter.stateToRemote(item)
		);
	}

	async delete(id: string): Promise<void> {
		await this.apiClient.delete(`${this.route}/${id}`);
	}
}
