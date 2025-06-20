import RepositoryProvider, { useRepository } from "@domain/providers/RepositoryProvider";
import { render } from "@testing-library/react-native";
import React from "react";

// Mock RepositoryFactory and its methods
jest.mock("@data/repositories/RepositoryFactory", () => ({
	createTransactionRepository: jest.fn(() => "localTransactionRepoMock"),
	createAccountRepository: jest.fn(() => "localAccountRepoMock"),
	createRemoteAccountRepository: jest.fn(() => "remoteAccountRepoMock"),
	createRemoteTransactionRepository: jest.fn(() => "remoteTransactionRepoMock"),
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
});
