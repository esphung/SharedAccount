import { handleCatchError } from "@presentation/utilities";
import { useCallback } from "react";
import type { Account } from "types/Account";
import { useRepository } from "../RepositoryProvider";

const useAccountSync = () => {
	const { localAccountRepo, remoteAccountRepo } = useRepository();

	const syncAccounts = useCallback(async () => {
		const [allLocalAccounts, allRemoteAccounts] = await Promise.all([
			localAccountRepo.getAll(),
			remoteAccountRepo.getAll(),
		]);

		const unsyncedAccounts = allLocalAccounts.filter(
			(localAccount) =>
				!allRemoteAccounts.some((remoteAccount) => remoteAccount.id === localAccount.id)
		);

		if (unsyncedAccounts.length) {
			await Promise.all(
				unsyncedAccounts.map((account: Account) => {
					return remoteAccountRepo
						.add(account)
						.catch(handleCatchError("useAccountSync:remoteAdd"));
				})
			);
		}

		const syncAccountsPromises = [...allRemoteAccounts].map((remoteAccount: Account) => {
			// Do sync logic here
			const local = allLocalAccounts.find(
				(localAccount) => localAccount.id === remoteAccount.id
			);
			if (!local) {
				// If the local account does not exist, return the remote account
				return localAccountRepo.add(remoteAccount).then(() => remoteAccount);
			} else if (local.version < remoteAccount.version) {
				// If the local account exists but is outdated, update it with remote data
				return localAccountRepo.update(remoteAccount).then(() => remoteAccount);
			} else if (local.version > remoteAccount.version) {
				return remoteAccountRepo.update(local).then(() => local);
			}
			// If the local account exists, return the local account
			return local;
		});

		const syncedAccounts = await Promise.all(syncAccountsPromises);

		if (__DEV__) {
			// eslint-disable-next-line no-console
			console.debug(
				"[useAccountSync] Syncing accounts: ",
				"Local Accounts: ",
				allLocalAccounts.length,
				"Remote Accounts: ",
				allRemoteAccounts.length
			);
		}
		return syncedAccounts;
	}, [localAccountRepo, remoteAccountRepo]);

	return { syncAccounts };
};

export default useAccountSync;
