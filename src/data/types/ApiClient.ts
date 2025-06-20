export type ApiClient<TParams, TResponse> = {
	get: (
		url: string,
		headers?: Record<string, string>
	) => Promise<{
		data: { data: TResponse[]; message?: string; error?: string };
		status: number;
		statusText: string;
	}>;
	post: (url: string, data: TParams, headers?: Record<string, string>) => Promise<void>;
	put: (url: string, data: TParams, headers?: Record<string, string>) => Promise<void>;
	delete: (url: string, headers?: Record<string, string>) => Promise<void>;
};
