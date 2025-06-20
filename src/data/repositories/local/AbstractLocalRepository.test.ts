import AbstractLocalRepository from "@data/repositories/local/AbstractLocalRepository";

// Dummy type for testing
type Dummy = { id: string; value: string };

// Concrete implementation for testing abstract class
class DummyLocalRepository extends AbstractLocalRepository<Dummy> {
	private items: Dummy[] = [];
	private liveCallback: ((_: Dummy[]) => void) | null = null;

	getLiveData(callback: (_: Dummy[]) => void): void {
		this.liveCallback = callback;
		callback(this.items);
	}

	stopListening(): void {
		this.liveCallback = null;
	}

	async getAll(): Promise<Dummy[]> {
		return this.items;
	}

	async getById(id: string): Promise<Dummy | null> {
		return this.items.find((item) => item.id === id) || null;
	}

	async add(item: Dummy): Promise<void> {
		this.items.push(item);
		this.liveCallback?.(this.items);
	}

	async update(item: Dummy): Promise<void> {
		const idx = this.items.findIndex((i) => i.id === item.id);
		if (idx !== -1) {
			this.items[idx] = item;
			this.liveCallback?.(this.items);
		}
	}

	async delete(id: string): Promise<void> {
		this.items = this.items.filter((item) => item.id !== id);
		this.liveCallback?.(this.items);
	}

	async getUnsynced(): Promise<Dummy[]> {
		// For test, return all items as unsynced
		return this.items;
	}
}

describe("AbstractLocalRepository", () => {
	let repo: DummyLocalRepository;

	beforeEach(() => {
		repo = new DummyLocalRepository();
	});

	test("getType returns 'local'", () => {
		expect(repo.getType()).toBe("local");
	});

	test("getName returns class name without 'Repository'", () => {
		expect(repo.getName()).toBe("DummyLocal");
	});

	test("add and getAll", async () => {
		await repo.add({ id: "1", value: "a" });
		await repo.add({ id: "2", value: "b" });
		const all = await repo.getAll();
		expect(all).toEqual([
			{ id: "1", value: "a" },
			{ id: "2", value: "b" },
		]);
	});

	test("getById returns correct item or null", async () => {
		await repo.add({ id: "1", value: "a" });
		expect(await repo.getById("1")).toEqual({ id: "1", value: "a" });
		expect(await repo.getById("notfound")).toBeNull();
	});

	test("update modifies existing item", async () => {
		await repo.add({ id: "1", value: "a" });
		await repo.update({ id: "1", value: "updated" });
		expect(await repo.getById("1")).toEqual({ id: "1", value: "updated" });
	});

	test("delete removes item", async () => {
		await repo.add({ id: "1", value: "a" });
		await repo.delete("1");
		expect(await repo.getById("1")).toBeNull();
	});

	test("getUnsynced returns all items", async () => {
		await repo.add({ id: "1", value: "a" });
		const unsynced = await repo.getUnsynced();
		expect(unsynced).toEqual([{ id: "1", value: "a" }]);
	});

	test("getLiveData and stopListening", () => {
		const callback = jest.fn();
		repo.getLiveData(callback);
		expect(callback).toHaveBeenCalledWith([]);
		repo.add({ id: "1", value: "a" });
		expect(callback).toHaveBeenCalledWith([{ id: "1", value: "a" }]);
		repo.stopListening();
		repo.add({ id: "2", value: "b" });
		// Callback should not be called after stopListening
		expect(callback).toHaveBeenCalledTimes(2); // Called twice: once for initial data, once for first add
	});
});
