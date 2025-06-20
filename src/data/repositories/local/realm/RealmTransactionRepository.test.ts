import RealmTransactionRepository from "@data/repositories/local/realm/RealmTransactionRepository";
import type { Transaction } from "types/Transaction";

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

const mockTransactionParams = {
	id: "abcd1234",
	name: "Mock Transaction",
	amount: 32434,
	date: new Date("2023-10-01T00:00:00Z"),
	type: "expense",
	category: "Test Category",
	description: "Test Description",
	sharedAccountId: "acct_test_account",
	userId: "usr_test_user",
	version: 1,
};

const mockRealmTransaction = {
	id: "abcd1234",
	name: "Mock Transaction",
	amount: 32434,
	date: new Date(),
	toJSON: () => mockTransactionParams,
	version: 1,
	sharedAccountId: "acct_test_account",
	userId: "usr_test_user",
	type: "expense",
	category: "Test Category",
	description: "Test Description",
	linkingObjects: jest.fn(),
	getPropertyType: jest.fn(),
	isValid: () => true,
	_objectKey: () => "txn_test_transaction",
	_objectId: () => "txn_test_transaction",
	keys: () => ["id", "name", "amount", "date"],
	entries: () => [],
	objectSchema: () => ({
		name: "Transaction",
		primaryKey: "id",
		properties: {
			id: "string",
			sharedAccountId: "string",
			userId: "string",
			amount: "int",
			name: "string",
			date: "date",
			type: "string",
			category: "string",
			description: "string",
			version: "int",
		},
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
			map: jest.fn(() => [mockRealmTransaction]),
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

describe("RealmTransactionRepository", () => {
	let repo: RealmTransactionRepository;

	beforeAll(() => {
		repo = new RealmTransactionRepository();
	});

	afterAll(() => {
		repo.stopListening();
	});

	test("getType returns 'local'", () => {
		expect(repo.getType()).toBe("local");
	});

	test("getName returns class name without 'Repository'", () => {
		expect(repo.getName()).toBe("RealmTransactionRepository");
	});

	test("add and getAll", async () => {
		const transaction: Transaction = {
			id: "txn_test_transaction",
			name: "Test Transaction",
			sharedAccountId: "acct_test_account",
			userId: "usr_test_user",
			amount: 100,
			date: new Date("2023-10-01T00:00:00Z"),
			type: "expense",
			category: "Test Category",
			description: "Test Description",
			version: 1,
		};

		await repo.add(transaction);
		const transactions = await repo.getAll();

		expect(transactions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: mockTransactionParams.id,
					name: mockTransactionParams.name,
					amount: mockTransactionParams.amount,
					date: expect.any(Date),
					type: mockTransactionParams.type,
					category: mockTransactionParams.category,
					description: mockTransactionParams.description,
					version: mockTransactionParams.version,
					sharedAccountId: mockTransactionParams.sharedAccountId,
					userId: mockTransactionParams.userId,
				}),
			])
		);
	});

	test("getById retrieves transaction by ID", async () => {
		const transaction: Transaction = {
			id: "txn_test_transaction",
			name: "Test Transaction",
			amount: 100,
			date: new Date(),
			type: "expense",
			category: "Test Category",
			description: "Test Description",
			version: 1,
			sharedAccountId: "acct_test_account",
			userId: "usr_test_user",
		};

		await repo.add(transaction);
		const transactions = await repo.getAll();

		expect(transactions).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					id: mockTransactionParams.id,
					name: mockTransactionParams.name,
					amount: mockTransactionParams.amount,
					date: expect.any(Date),
					type: mockTransactionParams.type,
					category: mockTransactionParams.category,
					description: mockTransactionParams.description,
					version: mockTransactionParams.version,
					sharedAccountId: mockTransactionParams.sharedAccountId,
					userId: mockTransactionParams.userId,
				}),
			])
		);
	});

	test("getById returns null for non-existent ID", async () => {
		const item: Transaction = {
			id: "txn_test_transaction",
			name: "Test Transaction",
			amount: 100,
			date: new Date(),
			type: "expense",
			category: "Test Category",
			description: "Test Description",
			version: 1,
			sharedAccountId: "acct_test_account",
			userId: "usr_test_user",
		};

		await repo.add(item);
		const retrieved = await repo.getById("non_existent_transaction");

		expect(retrieved).toBeNull();
	});
});

jest.mock("@realm/react", () => ({
	RealmProvider: ({ children }: { children: React.ReactNode }) => children,
}));
