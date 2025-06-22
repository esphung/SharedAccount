export const DEFAULT_EXTRA_KEYBOARD_SPACE = 50 as const satisfies number;
export const DEFAULT_KEYBOARD_BOTTOM_OFFSET = 50 as const satisfies number;

export const padding = {
	screen: {
		horizontal: {
			xSmall: 8 as const satisfies number,
			small: 12 as const satisfies number,
			medium: 16 as const satisfies number,
			large: 24 as const satisfies number,
			xLarge: 32 as const satisfies number,
		},
		vertical: {
			xSmall: 8 as const satisfies number,
			small: 12 as const satisfies number,
			medium: 16 as const satisfies number,
			large: 24 as const satisfies number,
			xLarge: 32 as const satisfies number,
		},
	},
	header: {
		height: 80 as const satisfies number,
	},
	footer: {
		height: 80 as const satisfies number,
	},

	northPanel: {
		height: 90 as const satisfies number,
	},
	southPanel: {
		height: 90 as const satisfies number,
	},
};
