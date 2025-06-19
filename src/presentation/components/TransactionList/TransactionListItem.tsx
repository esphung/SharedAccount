import ArrowDownSvg from "@assets/svg/circle-arrow-down-svgrepo-com.svg";
import ArrowUpSvg from "@assets/svg/circle-arrow-up-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SkeletonLoader from "@components/SkeletonLoader/SkeletonLoader";
import colors from "@config/themes/colors";
import type { Transaction } from "@data/models/types/Transaction";
import type { User } from "@data/models/types/User";
import MoneyFunctions from "@utils/MoneyFunctions";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type TransactionListItemProps = {
	testID?: string;
	item: Transaction;
	user?: User;
	onPress: (id: Transaction["id"]) => void;
	itemHeight: number;
	isListReady?: boolean;
};

// Constants
const ICON_SIZE = 20;
const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const DEFAULT_AVATAR = "https://picsum.photos/200/300";

export default function TransactionListItem({
	testID,
	item,
	user,
	onPress,
	itemHeight,
	isListReady = true,
}: TransactionListItemProps) {
	const isCredit = useMemo(() => item.type === "credit", [item.type]);
	const formattedAmount = useMemo(
		() => MoneyFunctions.formatMoney(item.amount, 2),
		[item.amount]
	);
	const categoryValue = useMemo(() => item.category, [item.category]);
	const avatarUri = useMemo(() => user?.avatar || DEFAULT_AVATAR, [user?.avatar]);
	const transactionDate = useMemo(
		() => DateTime.fromJSDate(item.date).toFormat("MMM d, t"),
		[item.date]
	);
	const itemName = useMemo(() => item.name, [item.name]);

	if (!isListReady) {
		return (
			<View style={[styles.placeholderContainer, { height: itemHeight }]}>
				<SkeletonLoader width="60%" height={18} style={styles.skeletonTitle} />
				<SkeletonLoader width="100%" height={36} style={styles.skeletonSubtitle} />
			</View>
		);
	}

	return (
		<TouchableOpacity
			testID={testID || "transaction-list-item"}
			accessibilityLabel={testID || "transaction-list-item"}
			accessibilityRole="button"
			accessibilityState={{ selected: false }}
			style={[styles.container, { height: itemHeight }]}
			onPress={() => onPress(item.id)}
			activeOpacity={0.7}
		>
			<View style={styles.leftContainer}>
				<View style={styles.avatarContainer}>
					<SkeletonLoader
						testID="avatar-skeleton-placeholder"
						width={AVATAR_SIZE}
						height={AVATAR_SIZE}
						borderRadius={AVATAR_RADIUS}
						style={styles.skeleton}
					/>
					<Image
						testID="avatar-image"
						source={{ uri: avatarUri }}
						style={styles.avatar}
					/>
				</View>

				<View>
					{formattedAmount ? (
						<SharedAccountText type="listItemTitle">
							{formattedAmount}
						</SharedAccountText>
					) : (
						<SkeletonLoader
							testID="transaction-name-skeleton-placeholder"
							width="100%"
							style={styles.subtitleSkeleton}
						/>
					)}
					<SharedAccountText>
						{categoryValue ? (
							<>
								<SharedAccountText numberOfLines={1}>
									{categoryValue}
								</SharedAccountText>
								{itemName && (
									<SharedAccountText>
										<SharedAccountText
											numberOfLines={1}
											type="listItemSubtitle"
										>
											{" | "}
										</SharedAccountText>
										<SharedAccountText
											numberOfLines={1}
											type="listItemSubtitle"
										>
											{itemName}
										</SharedAccountText>
									</SharedAccountText>
								)}
							</>
						) : (
							<SkeletonLoader
								testID="transaction-category-skeleton-placeholder"
								width="90%"
							/>
						)}
					</SharedAccountText>
				</View>
			</View>

			<View style={styles.rightContainer}>
				{transactionDate ? (
					<SharedAccountText>{transactionDate}</SharedAccountText>
				) : (
					<SkeletonLoader width="80%" />
				)}
				{isCredit ? (
					<ArrowUpSvg
						width={ICON_SIZE}
						height={ICON_SIZE}
						testID="arrow-up-svg"
						fill={colors.green}
					/>
				) : (
					<ArrowDownSvg
						width={ICON_SIZE}
						height={ICON_SIZE}
						testID="arrow-down-svg"
						fill={colors.red}
					/>
				)}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	avatar: {
		borderColor: colors.dark,
		borderRadius: AVATAR_RADIUS,
		height: AVATAR_SIZE,
		width: AVATAR_SIZE,
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginHorizontal: 12,
	},
	container: {
		borderBottomColor: colors.light,
		borderBottomWidth: 1,
		flexDirection: "row",
		paddingHorizontal: 12,
	},
	leftContainer: {
		alignItems: "center",
		flex: 1,
		flexDirection: "row",
		height: 100,
		justifyContent: "flex-start",
		paddingVertical: 8,
	},
	placeholderContainer: {
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	rightContainer: {
		alignItems: "flex-end",
		gap: 4,
		height: 100,
		justifyContent: "center",
		paddingRight: 16,
		width: "50%",
	},
	skeleton: {
		left: 0,
		position: "absolute",
		top: 0,
	},
	skeletonSubtitle: {
		marginTop: 4,
	},
	skeletonTitle: {
		marginBottom: 8,
	},
	subtitleSkeleton: {
		marginBottom: 4,
	},
});
