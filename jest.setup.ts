jest.mock("react-native-keyboard-controller", () => {
	return {
		KeyboardProvider: ({children}: {children: React.ReactNode}) => children,
	};
});
