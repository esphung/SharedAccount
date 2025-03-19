module.exports = {
  root: true,
  plugins: ["@typescript-eslint"],
  extends: ["plugin:@typescript-eslint/recommended", "@react-native"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    quotes: ["error", "double"],
    "@typescript-eslint/consistent-type-imports": "error",
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
  },
};
