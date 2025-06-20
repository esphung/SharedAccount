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
					"@components": "./src/presentation/components",
					types: "./src/types",
					"@builders": "./src/builders",
					"@helpers": "./src/helpers",
					"@screens": "./src/presentation/screens",
					"@navigators": "./src/presentation/navigators",
					"@hooks": "./src/presentation/hooks",
					"@data": "./src/data",
					"@config": "./src/config",
					"@domain": "./src/domain",
					"@presentation": "./src/presentation",
					"@utils": "./src/utils",
					"@assets": "./src/assets",
					"@constants": "./src/presentation/constants",
					"@stores": "./src/domain/stores",
				},
			},
		],
	],
};
