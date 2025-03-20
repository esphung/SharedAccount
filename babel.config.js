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
          "@helpers": "./src/helpers",
          "@screens": "./src/screens",
          "@navigators": "./src/navigators",
          "@hooks": "./src/hooks",
          "@data": "./src/data",
          "@config": "./src/config",
          "@domain": "./src/domain",
          "@presentation": "./src/presentation",
        },
      },
    ],
  ],
};
