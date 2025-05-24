import type {Config} from "jest";

export default async (): Promise<Config> => {
	return {
		verbose: true,
		preset: "react-native",
		collectCoverage: true,
		collectCoverageFrom: [
			"!src/utils/testUtils/*",
			"src/**/*.{ts,tsx}",
			"!src/**/*.test.{ts,tsx}",
			"!src/**/*.stories.{ts,tsx}",
			"!src/**/*.d.ts",
			"!src/**/index.ts",
			"!src/**/types.ts",
			"!src/**/types.d.ts",
			"!src/**/types/*",
			"!src/__mocks__/*",
			"!src/config/*",
			"!src/utils/testUtils/*",
			"!src/data/models/builders/*",
		],
		coverageProvider: "babel",
		coverageReporters: ["text", "lcov", "html"],
		coverageDirectory: "coverage",
		coverageThreshold: {
			global: {},
		},
		setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
		transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
		moduleNameMapper: {
			"\\.svg": "<rootDir>/src/__mocks__/svgMock.ts",
		},
	};
};
