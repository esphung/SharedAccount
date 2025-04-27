export type UseDataSource<T> = () => {
  state: T[];
  fetchItems: () => Promise<T[]>;
  startListening: () => () => void;
  addItem: (params: Partial<T>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
};
