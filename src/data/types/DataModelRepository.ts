export type BaseDataModelRepository<T> = {
	getAll(): Promise<T[]>;
	getById(id: string): Promise<T | null>;
	add(data: T): Promise<void>;
	update(data: T): Promise<void>;
	delete(id: string): Promise<void>;
};

export type DataModelRepository<T, K extends "local" | "remote"> = K extends "local"
	? {
			getLiveData(callback: (data: T[]) => void): void;
			stopListening(): void;
		} & BaseDataModelRepository<T>
	: BaseDataModelRepository<T>;
