/**
 * @format
 */

import { AppRegistry } from "react-native";
import { default as Storybook } from "./.storybook";
import { name as appName } from "./app.json";
import { showStorybook } from "./package.json";
import App from "./src/App";

AppRegistry.registerComponent(appName, () => (showStorybook ? Storybook : App));
