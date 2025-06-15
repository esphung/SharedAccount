// type TransformFunction<TInput, TOutput> = (input: TInput) => TOutput;

export type DataModelAdapter<TState, TLocal, TRemote> = {
	localToState(local: TLocal): TState;
	stateToRemote(state: TState): TRemote;
	remoteToState(remote: TRemote): TState;
};
