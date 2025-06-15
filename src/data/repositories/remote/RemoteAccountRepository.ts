import AccountAdapter from "@data/adapters/AccountAdapter";
import remoteAccountApi from "@data/api/remoteAccountApi";
import type {ApiClient} from "@data/types/ApiClient";
import type {DataModelRepository} from "@data/types/DataModelRepository";
import type {Account} from "types/Account";

export default class RemoteAccountRepository implements DataModelRepository<Account> {
	private apiClient: ApiClient<Record<string, unknown>, Account>;

	constructor(apiClient?: ApiClient<Record<string, unknown>, Account>) {
		if (!apiClient) {
			this.apiClient = remoteAccountApi;
			return;
		}
		this.apiClient = apiClient;
	}
	getLiveData(_callback: (data: Account[]) => void): void {
		throw new Error("Method not implemented.");
	}
	stopListening(): void {
		throw new Error("Method not implemented.");
	}
	getUnsynced(): Promise<Account[]> {
		throw new Error("Method not implemented.");
	}
	markAsSynced(_id: string): Promise<void> {
		throw new Error("Method not implemented.");
	}

	async getAll(): Promise<Account[]> {
		try {
			const {data: responseData} = await this.apiClient.get("/accounts");
			return responseData.data.map(AccountAdapter.remoteToState);
		} catch (error) {
			console.error("[RemoteAccountRepository] Error fetching accounts:", error);
			return [];
		}
	}

	async getById(id: string): Promise<Account | null> {
		try {
			const {data: responseData} = await this.apiClient.get(`/accounts/${id}`);
			return AccountAdapter.remoteToState(responseData.data[0]);
		} catch (error) {
			console.warn(`[RemoteAccountRepository] Account not found: ${id}`);
			return null;
		}
	}

	async add(account: Account): Promise<void> {
		await this.apiClient.post("/accounts", AccountAdapter.stateToRemote(account));
	}

	async update(account: Account): Promise<void> {
		await this.apiClient.put(`/accounts/${account.id}`, AccountAdapter.stateToRemote(account));
	}

	async delete(id: string): Promise<void> {
		await this.apiClient.delete(`/accounts/${id}`);
	}
}
