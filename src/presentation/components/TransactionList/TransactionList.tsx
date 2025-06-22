import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import TransactionListItem from "@components/TransactionList/TransactionListItem";
import colors from "@config/themes/colors";
import type { Transaction } from "@data/models/types/Transaction";
import { padding } from "@presentation/constants/layout";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import React, { forwardRef, useCallback } from "react";
import { SectionList, StyleSheet, View } from "react-native";

const ITEM_HEIGHT = 100; // List item height

type TransactionListProps = {
	users: { avatar?: string; id: string }[];
	onPress: (id: Transaction["id"]) => void;
	data: {
		title: string;
		data: Transaction[];
	}[];
	onContentSizeChange: () => void;
	isListReady: boolean;
};

const getUserById = (userId: string, users: { avatar?: string; id: string }[]) =>
	users.find((user) => user.id === userId);

// Main Component
const TransactionList = forwardRef<SectionList, TransactionListProps>((props, ref) => {
	const { onContentSizeChange, data = [], users = [], onPress, isListReady } = props;

	const renderItemCallback = useCallback(
		({ item }: { item: Transaction }) => {
			const user = getUserById(item.userId, users) || {
				avatar: "https://picsum.photos/200/300",
				id: "usr_default",
			};
			return (
				<TransactionListItem
					testID={`transaction-list-item-${item.id}`}
					isListReady={isListReady}
					itemHeight={ITEM_HEIGHT}
					item={item}
					user={user}
					onPress={onPress}
				/>
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[users, isListReady]
	);

	return (
		<SectionList
			{...generateTestIDs("transactions-list")}
			ref={ref}
			sections={data}
			keyExtractor={(item) => item.id}
			renderItem={renderItemCallback}
			renderSectionHeader={({ section: { title } }) => (
				<SharedAccountText type="listSectionHeader" style={styles.header}>
					{title}
				</SharedAccountText>
			)}
			stickySectionHeadersEnabled
			getItemLayout={(_, index) => ({
				length: ITEM_HEIGHT,
				offset: ITEM_HEIGHT * index,
				index,
			})}
			onContentSizeChange={onContentSizeChange} // <-- This triggers after rendering
			ListEmptyComponent={
				<View style={styles.emptyContainer}>
					<SharedAccountText
						{...generateTestIDs("transactions-list-empty-text", "text")}
						type="listItemTitle"
					>
						No transactions available.
					</SharedAccountText>
				</View>
			}
		/>
	);
});

const styles = StyleSheet.create({
	emptyContainer: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
		padding: padding.screen.horizontal.large,
	},
	header: {
		backgroundColor: colors.white,
		borderBottomColor: colors.light,
		borderBottomWidth: StyleSheet.hairlineWidth,
		paddingHorizontal: padding.screen.horizontal.small,
		paddingVertical: padding.screen.vertical.small,
	},
});

export default TransactionList;
