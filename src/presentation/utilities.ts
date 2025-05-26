export const handleCatchError = (methodName: string) => (error: Error) => {
	console.warn(`[AppTabs:${methodName}] Error occurred:`, error);
	return Promise.reject(error);
};
