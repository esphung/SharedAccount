// type TransformFunction<TInput, TOutput> = (input: TInput) => TOutput;

export type DataModelAdapter<TState, TLocal> = {
	// localToState: TransformFunction<TLocal, TState>;
	localToState(local: TLocal): TState;
};
