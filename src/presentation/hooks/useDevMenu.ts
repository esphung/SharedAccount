import React from "react";
import { DevSettings } from "react-native";
import { Dirs } from "react-native-file-access";

const useDevMenu = () => {
  // Debugging
  React.useEffect(() => {
    if (__DEV__) {
      DevSettings.addMenuItem("Show DB", () => {
        console.log("DB Path:", Dirs.DocumentDir);
      });
    }
  }, []);
};

export default useDevMenu;
