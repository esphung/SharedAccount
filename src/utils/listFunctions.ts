import type { DataModelRepository } from "@data/types/DataModelRepository";

/**
 * Compares two item objects.
 * @param a The first item to compare.
 * @param b The second item to compare.
 * @returns A negative number if a < b, a positive number if a > b, and 0 if they are equal.
 */
const compareVersions = <T extends { id: string; version: number }>(a: T, b: T): number => {
	if (a.version < b.version) {
		return -1;
	}
	if (a.version > b.version) {
		return 1;
	}
	return 0;
};

const deduplicateItems = <T extends { id: string; version: number }>(items: T[]): T[] => {
	const map = new Map<string, T>();
	for (const item of items) {
		const existing = map.get(item.id);
		if (!existing || compareVersions(item, existing) > 0) {
			map.set(item.id, item);
		}
	}
	return Array.from(map.values());
};

/**
 * Synchronizes two lists of items by updating, adding, or merging as needed.
 * Returns promises that resolve to the merged list of items.
 */
export const mergeRecords = async <T extends { id: string; version: number }>({
	local: { list: localItems, update: localUpdate, add: localAdd },
	remote: { list: remoteItems, update: remoteUpdate, add: remoteAdd },
}: {
	local: {
		list: T[];
		update: DataModelRepository<T, "local">["update"];
		add: DataModelRepository<T, "local">["add"];
	};
	remote: {
		list: T[];
		update: DataModelRepository<T, "remote">["update"];
		add: DataModelRepository<T, "remote">["add"];
	};
}): Promise<T[]> => {
	if (!localItems || !remoteItems) {
		throw new Error("Both local and remote item lists must be provided.");
	}

	// Deduplicate items to ensure no duplicates exist in either list
	const localMap = new Map(deduplicateItems(localItems).map((acc) => [acc.id, acc]));
	const remoteMap = new Map(deduplicateItems(remoteItems).map((acc) => [acc.id, acc]));
	const merged: T[] = [];
	const promises: Promise<void>[] = [];

	// Process remote records
	for (const [id, remoteAcc] of remoteMap) {
		const localAcc = localMap.get(id);
		if (localAcc) {
			const cmp = compareVersions<T>(localAcc, remoteAcc);
			if (cmp < 0) {
				promises.push(
					localUpdate(remoteAcc).catch((error) => {
						console.error(`[mergeRecords] Error updating remote item ${id}:`, error);
					})
				);
				merged.push(remoteAcc);
			} else if (cmp > 0) {
				promises.push(
					remoteUpdate(localAcc).catch((error) => {
						console.error(`[mergeRecords] Error updating local item ${id}:`, error);
					})
				);
				merged.push(localAcc);
			} else {
				merged.push(localAcc);
			}
			localMap.delete(id);
		} else {
			promises.push(
				localAdd(remoteAcc).catch((error) => {
					console.error(`[mergeRecords] Error adding remote item ${id}:`, error);
				})
			);
			merged.push(remoteAcc);
		}
	}

	// Process remaining local items that are not in remote
	for (const localAcc of localMap.values()) {
		promises.push(
			remoteAdd(localAcc).catch((error) => {
				console.error("[mergeRecords] :", {
					item: localAcc,
					error,
				});
				console.error(`[mergeRecords] Error adding local item ${localAcc.id}:`, error);
			})
		);
		merged.push(localAcc);
	}

	// Execute all async operations at once
	await Promise.all(promises);

	return merged;
};
