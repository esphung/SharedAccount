import type { DataModelRepository } from "@data/types/DataModelRepository";

/**
 * Abstract class for local repositories.
 * Provides a common interface for local data storage operations.
 * @template T Type of the items stored in the repository.
 */
export default abstract class AbstractLocalRepository<T>
	implements DataModelRepository<T, "local">
{
	/**
	 * Get live data from the repository.
	 * @param callback Callback to notify UI of changes.
	 */
	abstract getLiveData(callback: (_: T[]) => void): void;

	/**
	 * Stop listening for live data changes.
	 */
	abstract stopListening(): void;

	/**
	 * Get all items from the repository.
	 * @returns Promise resolving to an array of items.
	 */
	abstract getAll(): Promise<T[]>;

	/**
	 * Get an item by its ID.
	 * @param id The ID of the item.
	 * @returns Promise resolving to the item or null if not found.
	 */
	abstract getById(id: string): Promise<T | null>;

	/**
	 * Add a new item to the repository.
	 * @param item The item to add.
	 * @returns Promise resolving when the item is added.
	 */
	abstract add(item: T): Promise<void>;

	/**
	 * Update an existing item in the repository.
	 * @param item The item to update.
	 * @returns Promise resolving when the item is updated.
	 */
	abstract update(item: T): Promise<void>;

	/**
	 * Delete an item from the repository.
	 * @param id The ID of the item to delete.
	 * @returns Promise resolving when the item is deleted.
	 */
	abstract delete(id: string): Promise<void>;

	/**
	 * Get unsynced items from the repository.
	 * @returns Promise resolving to an array of unsynced items.
	 */
	abstract getUnsynced(): Promise<T[]>;

	/**
	 * Get the repository type.
	 * @returns The type of the repository.
	 */
	getType(): "local" {
		return "local";
	}
	/**
	 * Get the repository name.
	 * @returns The name of the repository.
	 */
	getName(): string {
		return this.constructor.name.replace("Repository", "");
	}
}
