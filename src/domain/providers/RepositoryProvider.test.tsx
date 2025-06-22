import RepositoryProvider, { useRepository } from "@domain/providers/RepositoryProvider";
import type { BoundState } from "@domain/stores/zustand/useStore";
import { render } from "@testing-library/react-native";
import React from "react";

// Mock RepositoryFactory and its methods
jest.mock("@data/repositories/RepositoryFactory", () => ({
	createTransactionRepository: jest.fn(() => "localTransactionRepoMock"),
	createAccountRepository: jest.fn(() => "localAccountRepoMock"),
	createRemoteAccountRepository: jest.fn(() => "remoteAccountRepoMock"),
	createRemoteTransactionRepository: jest.fn(() => "remoteTransactionRepoMock"),
	createRemoteAccountUsersRepository: jest.fn(() => "remoteAccountUsersRepoMock"),
}));

// Patch useStore.getState to return a token
jest.mock("@stores/zustand/useStore", () => ({
	useStore: {
		getState: () =>
			({
				authentication: { token: null, setToken: jest.fn() },
				user: { userId: "user123", setUserId: jest.fn() },
				account: {
					setAccount: jest.fn(),
					account: {
						id: "account123",
						name: "Test Account",
						startingBalance: 100,
						version: 1,
					},
				},
			}) satisfies BoundState,
	},
}));

describe("RepositoryProvider", () => {
	it("provides all repositories via useRepository", () => {
		let repos: ReturnType<typeof useRepository> | undefined;

		function TestComponent() {
			repos = useRepository();
			return null;
		}

		render(
			<RepositoryProvider>
				<TestComponent />
			</RepositoryProvider>
		);

		expect(repos).toBeDefined();
		expect(repos?.localTransactionRepo).toBe("localTransactionRepoMock");
		expect(repos?.localAccountRepo).toBe("localAccountRepoMock");
		expect(repos?.remoteAccountRepo).toBe("remoteAccountRepoMock");
		expect(repos?.remoteTransactionRepo).toBe("remoteTransactionRepoMock");
	});

	it("throws if useRepository is used outside of provider", () => {
		function TestComponent() {
			useRepository();
			return null;
		}
		// Suppress error boundary logs
		const spy = jest.spyOn(console, "error").mockImplementation(() => {});
		expect(() => render(<TestComponent />)).toThrow(
			"useRepository must be used within a RepositoryProvider"
		);
		spy.mockRestore();
	});

	it("calls getTokenCallback when creating remote repositories", () => {
		const mockUseStore = jest.requireMock("@stores/zustand/useStore");
		mockUseStore.useStore.getState = jest.fn(() => ({
			authentication: { token: "token" },
		}));
		const mockRepositoryFactory = jest.requireMock("@data/repositories/RepositoryFactory");
		let capturedGetToken: (() => string | null) | undefined;

		// Patch RepositoryFactory to capture the getTokenCallback
		mockRepositoryFactory.createRemoteAccountRepository.mockImplementation(
			(cb: () => string | null) => {
				capturedGetToken = cb;
				return "remoteAccountRepoMock";
			}
		);
		mockRepositoryFactory.createRemoteTransactionRepository.mockImplementation(
			(cb: () => string | null) => {
				capturedGetToken = cb;
				return "remoteTransactionRepoMock";
			}
		);

		const { unmount } = render(
			<RepositoryProvider>
				<></>
			</RepositoryProvider>
		);

		expect(typeof capturedGetToken).toBe("function");
		if (capturedGetToken) {
			expect(capturedGetToken()).toBe("token");
		}

		// Ensure the mock was called with the correct callback
		expect(mockRepositoryFactory.createRemoteAccountRepository).toHaveBeenCalledWith(
			expect.any(Function)
		);
		expect(mockRepositoryFactory.createRemoteTransactionRepository).toHaveBeenCalledWith(
			expect.any(Function)
		);
		// Clean up
		unmount();
	});
});
