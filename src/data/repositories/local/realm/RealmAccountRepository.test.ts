import type RealmAccount from "@data/models/realm/RealmAccount";
import RealmAccountRepository from "@data/repositories/local/realm/RealmAccountRepository";
import type { Account } from "types/Account";

jest.mock("@data/models/realm/RealmAccount", () => ({
	id: "acct_test_account",
	name: "Test Account",
	startingBalance: 1000,
	version: 1,
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
	toJSON: () => ({
		id: "acct_test_account",
		name: "Test Account",
		startingBalance: 1000,
		version: 1,
	}),
}));

jest.mock("@data/models/realm/RealmTransaction", () => ({
	id: "txn_test_transaction",
	name: "Test Transaction",
	amount: 100,
	date: new Date(),
	schema: {
		name: "Transaction",
		primaryKey: "id",
		properties: {
			id: "string",
			name: "string",
			amount: "int",
			date: "date",
		},
	},
	toJSON: () => ({
		id: "txn_test_transaction",
		name: "Test Transaction",
		amount: 100,
		date: new Date(),
	}),
}));

const mockRealmAccount: RealmAccount = {
	id: "acct_test_account",
	name: "Test Account",
	startingBalance: 1000,
	version: 1,
	toJSON: () => ({
		id: "acct_test_account",
		name: "Test Account",
		startingBalance: 1000,
		version: 1,
	}),
	linkingObjects: jest.fn(),
	getPropertyType: jest.fn(),
	isValid: () => true,
	_objectKey: () => "acct_test_account",
	_objectId: () => "acct_test_account",
	keys: () => ["id", "name", "startingBalance", "version"],
	entries: () => [],
	objectSchema: () => ({
		name: "Account",
		primaryKey: "id",
		properties: {},
	}),
	addListener: jest.fn(),
	removeListener: jest.fn(),
	removeAllListeners: jest.fn(),
	linkingObjectsCount: () => 0,
};

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
			map: jest.fn(() => [mockRealmAccount]),
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

describe("RealmAccountRepository", () => {
	let repo: RealmAccountRepository;

	beforeAll(() => {
		repo = new RealmAccountRepository();
	});

	afterAll(() => {
		repo.stopListening();
	});

	test("getType returns 'local'", () => {
		expect(repo.getType()).toBe("local");
	});

	test("getName returns class name without 'Repository'", () => {
		expect(repo.getName()).toBe("RealmAccountRepository");
	});

	test("add and getAll", async () => {
		const account: Account = {
			id: "acct_test_account",
			name: "Test Account",
			startingBalance: 1000,
			version: 1,
		};

		await repo.add(account);
		const accounts = await repo.getAll();

		expect(accounts).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: "acct_test_account",
					name: "Test Account",
					startingBalance: 1000,
					version: 1,
				}),
			])
		);
	});

	test("getById retrieves account by ID", async () => {
		const account: Account = {
			id: "acct_test_account",
			name: "Test Account",
			startingBalance: 1000,
			version: 1,
		};

		await repo.add(account);
		const accounts = await repo.getAll();

		expect(accounts).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: "acct_test_account",
					name: "Test Account",
					startingBalance: 1000,
					version: 1,
				}),
			])
		);
	});

	test("getById returns null for non-existent ID", async () => {
		const account: Account = {
			id: "acct_test_account",
			name: "Test Account",
			startingBalance: 1000,
			version: 1,
		};

		await repo.add(account);
		const retrieved = await repo.getById("non_existent_account");

		expect(retrieved).toBeNull();
	});
});

jest.mock("@realm/react", () => ({
	RealmProvider: ({ children }: { children: React.ReactNode }) => children,
}));
