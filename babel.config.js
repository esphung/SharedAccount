module.exports = {
  presets: ["module:@react-native/babel-preset"],
  plugins: [
    "react-native-reanimated/plugin",
    [
      "module-resolver",
      {
        root: ["./src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
        alias: {
          "@components": "./src/components",
        },
      },
    ],
  ],
};
