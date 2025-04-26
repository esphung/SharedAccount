module.exports = {
  root: true,
  plugins: ["@typescript-eslint", "react-native", "react"],
  extends: ["plugin:@typescript-eslint/recommended", "@react-native", "plugin:react-native/all"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    "react-native/react-native": true,
  },
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/consistent-type-imports": [
      "error",
      {
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/consistent-type-definitions": ["error", "type"],
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "react-native",
            importNames: ["Text"],
            message: "Please use SharedAccountText instead.",
          },
        ],
      },
    ],
    "react-native/no-raw-text": ["error", { skip: ["SharedAccountText"] }],

    // no console
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
  },
};
