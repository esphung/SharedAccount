import RemoteAccountRepository from "./RemoteRepository";
import type { ApiClient } from "@data/types/ApiClient";

type TestModel = {
	id: string;
	name: string;
};

describe("RemoteAccountRepository constructor", () => {
	const mockApiClient: ApiClient<Partial<TestModel>, TestModel> = {
		get: jest.fn(),
		post: jest.fn(),
		put: jest.fn(),
		delete: jest.fn(),
	};

	const route = "/test-route";
	const adapter = {
		remoteToState: jest.fn((remote: TestModel) => remote),
		stateToRemote: jest.fn((state: TestModel) => ({ id: state.id })),
	};

	it("should initialize with provided apiClient, route, and adapter", () => {
		const repo = new RemoteAccountRepository<TestModel>(
			mockApiClient,
			route,
			adapter,
			() => "mock-token"
		);

		// @ts-expect-error: accessing private properties for test
		expect(repo.apiClient).toBe(mockApiClient);
		// @ts-expect-error: accessing private properties for test
		expect(repo.route).toBe(route);
		// @ts-expect-error: accessing private properties for test
		expect(repo.adapter).toBe(adapter);
	});
});
