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
          types: "./src/types",
          "@builders": "./src/builders",
          "@themes": "./src/themes",
          "@helpers": "./src/helpers",
          "@screens": "./src/screens",
          "@navigators": "./src/navigators",
          "@models": "./src/models",
          "@repositories": "./src/repositories",
        },
      },
    ],
  ],
};
