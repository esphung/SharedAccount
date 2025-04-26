import TransactionListHeader from "@components/TransactionList/TransactionListHeader";
import TransactionListItem from "@components/TransactionList/TransactionListItem";

import type { Transaction } from "@data/models/types/Transaction";
import type { User } from "@data/models/types/User";
import { getUserById } from "@utils/UserFunctions";
import React, { forwardRef, useCallback } from "react";
import { SectionList } from "react-native";

const ITEM_HEIGHT = 100; // List item height

// Props
type Props = {
  users?: User[];
  onPress: (id: string) => void;
  data: {
    title: string;
    data: Transaction[];
  }[];
  onContentSizeChange: () => void;
  isListReady: boolean;
};

// Main Component
const TransactionList = forwardRef<SectionList, Props>((props, ref) => {
  const { onContentSizeChange, data = [], users = [], onPress, isListReady } = props;

  const renderItemCallback = useCallback(
    ({ item }: { item: Transaction }) => {
      const user = getUserById(item.userId, users);
      return (
        <TransactionListItem
          isListReady={isListReady}
          itemHeight={ITEM_HEIGHT}
          item={item}
          user={user}
          onPress={onPress}
        />
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, isListReady],
  );

  return (
    <SectionList
      ref={ref}
      // inverted
      sections={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItemCallback}
      renderSectionHeader={({ section: { title } }) => <TransactionListHeader title={title} />}
      stickySectionHeadersEnabled={false}
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
      onContentSizeChange={onContentSizeChange} // <-- This triggers after rendering
    />
  );
});

export default TransactionList;
