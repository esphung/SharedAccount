import axios from "axios";
import { remoteAccountApi, remoteTransactionsApi } from "./backend";
import type { Account } from "types/Account";
import type { Transaction } from "types/Transaction";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ApiClientFactory", () => {
	const mockAccount: Account = {
		id: "acct_1",
		name: "Test Account",
		startingBalance: 1000,
		version: 1,
		// add other required Account fields if needed
	};

	const mockTransaction: Transaction = {
		id: "txn_1",
		version: 1,
		sharedAccountId: "acct_1",
		userId: "usr_1",
		amount: 100,
		name: "Test Transaction",
		category: "Test Category",
		description: "Test Description",
		date: new Date("2023-10-01"),
		type: "expense", // assuming 'expense' is a valid type
		// add other required Transaction fields if needed
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("remoteAccountApi", () => {
		it("should GET data successfully", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 200,
				data: mockAccount,
			});
			const response = await remoteAccountApi.get("/accounts/1");
			expect(mockedAxios).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: "/accounts/1",
				})
			);
			expect(response.data).toEqual(mockAccount);
		});

		it("should throw on GET failure", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 404,
				statusText: "Not Found",
			});
			await expect(remoteAccountApi.get("/accounts/1")).rejects.toThrow(
				"Failed to fetch from /accounts/1: Not Found"
			);
		});

		it("should POST data successfully", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({ status: 200 });
			await expect(
				remoteAccountApi.post("/accounts", { id: "acct_2", version: 1 })
			).resolves.toBeUndefined();
			expect(mockedAxios).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: "/accounts",
				})
			);
		});

		it("should throw on POST failure", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 500,
				statusText: "Server Error",
			});
			await expect(
				remoteAccountApi.post("/accounts", { id: "acct_2", version: 1 })
			).rejects.toThrow("Failed to post to /accounts: Server Error");
		});

		it("should PUT data successfully", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({ status: 200 });
			await expect(
				remoteAccountApi.put("/accounts/1", { version: 2 })
			).resolves.toBeUndefined();
			expect(mockedAxios).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: "/accounts/1",
				})
			);
		});

		it("should throw on PUT failure", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 400,
				statusText: "Bad Request",
			});
			await expect(remoteAccountApi.put("/accounts/1", { version: 2 })).rejects.toThrow(
				"Failed to put to /accounts/1: Bad Request"
			);
		});

		it("should DELETE data successfully", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({ status: 200 });
			await expect(remoteAccountApi.delete("/accounts/1")).resolves.toBeUndefined();
			expect(mockedAxios).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "DELETE",
					url: "/accounts/1",
				})
			);
		});

		it("should throw on DELETE failure", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 403,
				statusText: "Forbidden",
			});
			await expect(remoteAccountApi.delete("/accounts/1")).rejects.toThrow(
				"Failed to delete from /accounts/1: Forbidden"
			);
		});
	});

	describe("remoteTransactionsApi", () => {
		it("should GET data successfully", async () => {
			(mockedAxios as unknown as jest.Mock).mockResolvedValueOnce({
				status: 200,
				data: mockTransaction,
			});
			const response = await remoteTransactionsApi.get("/transactions/1");
			expect(mockedAxios).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: "/transactions/1",
				})
			);
			expect(response.data).toEqual(mockTransaction);
		});

		// Additional tests for post, put, delete can be added similarly as above
	});
});
