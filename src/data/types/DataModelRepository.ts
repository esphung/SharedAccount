export type DataModelRepository<T> = {
	getLiveData(callback: (data: T[]) => void): void;
	stopListening(): void;
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | null>;
	add(data: T): Promise<void>;
	update(data: T): Promise<void>;
	delete(id: string): Promise<void>;
	getUnsynced(): Promise<T[]>;
	markAsSynced(id: string): Promise<void>;
};
