import ExpenseForm from "@components/ExpenseForm/ExpenseForm";
import SheetModal from "@components/SheetModal/SheetModal";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "@screens/HomeScreen/HomeScreen";
import SettingsScreen from "@screens/SettingsScreen/SettingsScreen";
import { useState } from "react";
import { Button, StyleSheet, View } from "react-native";

export enum AppTabsScreens {
  Home = "HomeScreen",
  Settings = "SettingsScreen",
}

export type AppTabsParamList = {
  [AppTabsScreens.Home]: undefined;
  [AppTabsScreens.Settings]: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

function AppTabs() {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <>
      <Tab.Navigator
        initialRouteName={AppTabsScreens.Home}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tab.Screen name={AppTabsScreens.Home} component={HomeScreen} />
        <Tab.Screen name={AppTabsScreens.Settings} component={SettingsScreen} />
      </Tab.Navigator>
      <Button title="Show Modal" onPress={() => setModalVisible(true)} />
      <SheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        presentationStyle="formSheet"
      >
        <View style={styles.modalSheetContainer}>
          <View style={styles.modalSheetContent}>
            <ExpenseForm
              onSubmit={(data) => {
                console.debug("[AppTabs] ExpenseForm onSubmit:", data);
                setModalVisible(!modalVisible);
              }}
            />
          </View>
        </View>
      </SheetModal>
    </>
  );
}

const styles = StyleSheet.create({
  modalSheetContainer: {
    flex: 1,
  },
  modalSheetContent: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
  },
});

export default AppTabs;
