import BillsSectionList from "@components/BillsSectionList/BillsSectionList";
import SharedAccountScreen from "@components/SharedAccountScreen/SharedAccountScreen";
import SheetModal from "@components/SheetModal/SheetModal";
import type {
  AppTabsParamList,
  AppTabsScreens,
} from "@navigators/AppTabs/AppTabs";
import useScheduledTransactions from "@presentation/hooks/useScheduledTransactions";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import React from "react";
import { Alert, Button } from "react-native";

type Props = BottomTabScreenProps<AppTabsParamList, AppTabsScreens.Bills>;

export default function BillsScreen(_: Props) {
  // hooks
  const {
    state: scheduledTransactions,
    startListening,
    fetchItems: fetchScheduledTransactions,
    // addItem: addScheduledTransaction,
    deleteItem: deleteScheduledTransaction,
  } = useScheduledTransactions();

  // local state
  const [modalVisible, setModalVisible] = React.useState(false);

  // effects
  React.useEffect(() => {
    const sub = startListening();
    return () => {
      sub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SharedAccountScreen>
      <Button
        title="Add Scheduled Transaction"
        onPress={() => {
          setModalVisible(true);
          // const sharedAccountId: `acct_${string}` = `acct_${Math.random().toString(36).substr(2, 9)}`;
          // const id: `schd_${string}` = `schd_${Math.random().toString(36).substr(2, 9)}`;
          // addScheduledTransaction({
          //   amount: 10000,
          //   category: "Rent",
          //   startDate: new Date(),
          //   endDate: undefined,
          //   dayOfMonth: 31,
          //   description: "Rent for the month of July",
          //   id,
          //   sharedAccountId,
          //   type: "expense",
          //   name: "Rent",
          //   monthsOfYear: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
          //   repeatInterval: "monthly",
          // })
          //   .then(() => {
          //     Alert.alert(
          //       "Scheduled Transaction Added",
          //       "Check the console for the new transaction",
          //     );
          //     fetchScheduledTransactions();
          //   })
          //   .catch((error) => {
          //     console.error(
          //       "[BillsScreen] Error adding scheduled transaction:",
          //       error,
          //     );
          //   });
          console.debug(
            "[BillsScreen] Add Scheduled Transaction Button Pressed",
          );
        }}
      />
      <BillsSectionList
        onPressAddNew={() => {
          setModalVisible(true);
        }}
        scheduledTransactions={scheduledTransactions}
        onPress={(id) => {
          Alert.alert(
            "Would you like to delete this scheduled transaction?",
            undefined,
            [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => {
                  deleteScheduledTransaction(id)
                    .then(() => {
                      Alert.alert("Scheduled Transaction Deleted");
                      fetchScheduledTransactions();
                    })
                    .catch((error) => {
                      console.error(
                        "[BillsScreen] Error deleting scheduled transaction:",
                        error,
                      );
                    });
                  console.debug(
                    "[BillsScreen] Delete Scheduled Transaction Button Pressed",
                  );
                },
              },
            ],
          );
        }}
      />
      <SheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </SharedAccountScreen>
  );
}
