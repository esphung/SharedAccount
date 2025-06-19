export type ApiClient<TParams, TResponse> = {
	get: (url: string) => Promise<{
		data: { data: TResponse[]; message?: string; error?: string };
		status: number;
		statusText: string;
	}>;
	post: (url: string, data: TParams) => Promise<void>;
	put: (url: string, data: TParams) => Promise<void>;
	delete: (url: string) => Promise<void>;
};
