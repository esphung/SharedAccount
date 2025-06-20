import RepositoryFactory from "./RepositoryFactory";
import RealmAccountRepository from "@data/repositories/local/realm/RealmAccountRepository";
import RealmTransactionRepository from "@data/repositories/local/realm/RealmTransactionRepository";
import RemoteRepository from "@data/repositories/remote/RemoteRepository";
import { remoteAccountApi, remoteTransactionsApi } from "@data/api/backend";
import AccountAdapter from "@data/adapters/AccountAdapter";
import TransactionAdapter from "@data/adapters/TransactionAdapter";

jest.mock("@data/repositories/local/realm/RealmAccountRepository");
jest.mock("@data/repositories/local/realm/RealmTransactionRepository");
jest.mock("@data/repositories/remote/RemoteRepository");

// mock zustand store
jest.mock("@stores/zustand/useStore", () => ({
	getState: jest.fn(() => ({
		authentication: { token: "test_token" },
	})),
	setState: jest.fn(),
	subscribe: jest.fn(),
	destroy: jest.fn(),
}));

jest.mock("realm", () => ({
	__esModule: true,
	default: jest.fn().mockImplementation(() => ({
		write: jest.fn(),
		create: jest.fn(),
		delete: jest.fn(),
		objects: jest.fn(() => ({
			filtered: jest.fn(() => []),
			sorted: jest.fn(() => []),
			addListener: jest.fn(),
			removeListener: jest.fn(),
			map: jest.fn(() => []),
		})),
		objectForPrimaryKey: jest.fn(() => null),
		close: jest.fn(),
	})),
	Realm: {
		open: jest.fn().mockResolvedValue({}),
		deleteFile: jest.fn(),
		schemaVersion: jest.fn().mockReturnValue(0),
	},
}));

jest.mock("@data/models/realm/RealmTransaction", () => ({
	id: `txn_${Math.random().toString(36).substr(2, 9)}`,
	sharedAccountId: `txn_${Math.random().toString(36).substr(2, 9)}`,
	userId: `usr_${Math.random().toString(36).substr(2, 9)}`,
	amount: Math.random() * 1000,
	name: "Test Transaction",
	category: "Test Category",
	description: "Test Description",
	date: new Date(),
	type: "credit",
	version: 1,
	toJSON: () => ({
		id: "txn_test_transaction",
		version: 1,
		sharedAccount: "txn_test_account",
		name: "Test Transaction",
		userId: "usr_test_user",
		amount: 100,
		date: new Date(),
		type: "expense",
		category: "Test Category",
		description: "Test Description",
	}),
	schema: {
		name: "Transaction",
		primaryKey: "id",
		properties: {
			id: "string",
			sharedAccountId: "string",
			userId: "string",
			amount: "int",
			name: "string",
			category: "string",
			description: "string?",
			date: "date",
			type: "string",
			version: "int",
		},
	},
}));

jest.mock("@data/models/realm/RealmAccount", () => ({
	id: `acct_${Math.random().toString(36).substr(2, 9)}`,
	name: "Test Account",
	startingBalance: 1000,
	version: 1,
	toJSON: () => ({
		id: "acct_test_account",
		name: "Test Account",
		startingBalance: 1000,
		version: 1,
	}),
	schema: {
		name: "Account",
		primaryKey: "id",
		properties: {
			id: "string",
			name: "string",
			startingBalance: "int",
			version: "int",
		},
	},
}));

jest.mock("@realm/react", () => ({
	RealmProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockGetToken = jest.fn(() => "test_token");

describe("RepositoryFactory", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create a local transaction repository", () => {
		RepositoryFactory.createTransactionRepository();
		expect(RealmTransactionRepository).toHaveBeenCalledTimes(1);
	});

	it("should create a local account repository", () => {
		RepositoryFactory.createAccountRepository();
		expect(RealmAccountRepository).toHaveBeenCalledTimes(1);
	});

	it("should create a remote account repository with correct params", () => {
		RepositoryFactory.createRemoteAccountRepository(mockGetToken);
		expect(RemoteRepository).toHaveBeenCalledWith(
			remoteAccountApi,
			"/accounts",
			AccountAdapter,
			mockGetToken
		);
	});

	it("should create a remote transaction repository with correct params", () => {
		RepositoryFactory.createRemoteTransactionRepository(mockGetToken);
		expect(RemoteRepository).toHaveBeenCalledWith(
			remoteTransactionsApi,
			"/transactions",
			TransactionAdapter,
			mockGetToken
		);
	});
});
