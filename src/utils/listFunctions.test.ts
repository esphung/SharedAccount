import { mergeRecords } from "./listFunctions";

type TestRecord = { id: string; version: number; value?: string };

const createRepo = () => {
	const updates: TestRecord[] = [];
	const adds: TestRecord[] = [];
	return {
		update: jest.fn(async (item: TestRecord) => {
			updates.push(item);
		}),
		add: jest.fn(async (item: TestRecord) => {
			adds.push(item);
		}),
		updates,
		adds,
	};
};

describe("mergeRecords", () => {
	it("merges two lists with different versions, updating the lower version", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		const local = [
			{ id: "1", version: 1, value: "A" },
			{ id: "2", version: 2, value: "B" },
		];
		const remote = [
			{ id: "1", version: 2, value: "A2" },
			{ id: "2", version: 1, value: "B1" },
		];

		const merged = await mergeRecords<TestRecord>({
			local: { list: local, update: localRepo.update, add: localRepo.add },
			remote: { list: remote, update: remoteRepo.update, add: remoteRepo.add },
		});

		// Should update local[0] with remote[0] (higher version)
		expect(localRepo.update).toHaveBeenCalledWith(remote[0]);
		// Should update remote[1] with local[1] (higher version)
		expect(remoteRepo.update).toHaveBeenCalledWith(local[1]);
		// Merged should contain the highest versions
		expect(merged).toEqual([
			{ id: "1", version: 2, value: "A2" },
			{ id: "2", version: 2, value: "B" },
		]);
	});

	it("adds missing remote items to local", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		const local = [{ id: "1", version: 1 }];
		const remote = [
			{ id: "1", version: 1 },
			{ id: "2", version: 1 },
		];

		const merged = await mergeRecords<TestRecord>({
			local: { list: local, update: localRepo.update, add: localRepo.add },
			remote: { list: remote, update: remoteRepo.update, add: remoteRepo.add },
		});

		expect(localRepo.add).toHaveBeenCalledWith({ id: "2", version: 1 });
		expect(merged).toEqual([
			{ id: "1", version: 1 },
			{ id: "2", version: 1 },
		]);
	});

	it("adds missing local items to remote", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		const local = [
			{ id: "1", version: 1 },
			{ id: "2", version: 1 },
		];
		const remote = [{ id: "1", version: 1 }];

		const merged = await mergeRecords<TestRecord>({
			local: { list: local, update: localRepo.update, add: localRepo.add },
			remote: { list: remote, update: remoteRepo.update, add: remoteRepo.add },
		});

		expect(remoteRepo.add).toHaveBeenCalledWith({ id: "2", version: 1 });
		expect(merged).toEqual([
			{ id: "1", version: 1 },
			{ id: "2", version: 1 },
		]);
	});

	it("handles identical lists without unnecessary updates or adds", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		const items = [
			{ id: "1", version: 1 },
			{ id: "2", version: 2 },
		];

		const merged = await mergeRecords<TestRecord>({
			local: { list: items, update: localRepo.update, add: localRepo.add },
			remote: { list: items, update: remoteRepo.update, add: remoteRepo.add },
		});

		expect(localRepo.update).not.toHaveBeenCalled();
		expect(localRepo.add).not.toHaveBeenCalled();
		expect(remoteRepo.update).not.toHaveBeenCalled();
		expect(remoteRepo.add).not.toHaveBeenCalled();
		expect(merged).toEqual(items);
	});

	it("throws if local or remote lists are missing", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		await expect(
			mergeRecords<TestRecord>({
				// @ts-expect-error Testing missing list
				local: { list: undefined, update: localRepo.update, add: localRepo.add },
				remote: { list: [], update: remoteRepo.update, add: remoteRepo.add },
			})
		).rejects.toThrow();

		await expect(
			mergeRecords<TestRecord>({
				local: { list: [], update: localRepo.update, add: localRepo.add },
				// @ts-expect-error Testing missing list
				remote: { list: undefined, update: remoteRepo.update, add: remoteRepo.add },
			})
		).rejects.toThrow();
	});

	it("deduplicates items by id and keeps the highest version", async () => {
		const localRepo = createRepo();
		const remoteRepo = createRepo();

		const local = [
			{ id: "1", version: 1 },
			{ id: "1", version: 2 },
		];
		const remote = [
			{ id: "1", version: 2 },
			{ id: "1", version: 3 },
		];

		const merged = await mergeRecords<TestRecord>({
			local: { list: local, update: localRepo.update, add: localRepo.add },
			remote: { list: remote, update: remoteRepo.update, add: remoteRepo.add },
		});

		expect(merged).toEqual([{ id: "1", version: 3 }]);
	});
});
