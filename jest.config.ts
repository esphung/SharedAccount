import type { Config } from "jest";

export default async (): Promise<Config> => {
  return {
    verbose: true,
    preset: "react-native",
    collectCoverage: true,
    coverageProvider: "babel",
    coverageThreshold: {
      global: {},
      "src/config": {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      "src/presentation/navigators": {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
      "src/presentation/screens/ScheduledTransactionsScreen": {
        statements: 100,
        branches: 100,
        functions: 100,
        lines: 100,
      },
    },
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
    transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  };
};
