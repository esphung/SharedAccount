import { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: ["./stories/**/*.stories.?(ts|tsx|js|jsx)", "./../src/components/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: ["@storybook/addon-ondevice-controls"],
};

export default main;
