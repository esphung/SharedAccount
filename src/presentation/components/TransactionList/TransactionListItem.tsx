import ArrowDownSvg from "@assets/svg/circle-arrow-down-svgrepo-com.svg";
import ArrowUpSvg from "@assets/svg/circle-arrow-up-svgrepo-com.svg";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SkeletonLoader from "@components/SkeletonLoader/SkeletonLoader";
import colors from "@config/themes/colors";
import type { Transaction } from "@data/models/types/Transaction";
import { padding } from "@presentation/constants/layout";
import MoneyFunctions from "@utils/MoneyFunctions";
import { generateTestIDs } from "@utils/testUtils/generateTestIDs";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

type TransactionListItemProps = {
	testID?: string;
	item: Transaction;
	user: { avatar?: string; id: string };
	onPress: (id: Transaction["id"]) => void;
	itemHeight: number;
	isListReady?: boolean;
};

// Constants
const ICON_SIZE = 16;
const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const DEFAULT_AVATAR = "https://picsum.photos/200/300";

export default function TransactionListItem({
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
			accessibilityState={{ selected: false }}
			{...generateTestIDs("transaction-list-item", "button")}
			style={[
				styles.container,
				{ height: itemHeight },
				{
					paddingLeft: padding.screen.horizontal.xSmall,
					paddingRight: padding.screen.horizontal.xSmall,
				},
			]}
			onPress={() => onPress(item.id)}
			activeOpacity={0.7}
		>
			<View
				style={[
					styles.leftContainer,
					styles.row,
					{
						marginVertical: padding.screen.vertical.large,
					},
				]}
			>
				<View style={styles.avatarContainer}>
					<SkeletonLoader
						{...generateTestIDs("avatar-skeleton-placeholder")}
						width={AVATAR_SIZE}
						height={AVATAR_SIZE}
						borderRadius={AVATAR_RADIUS}
						style={styles.skeleton}
					/>
					<Image
						{...generateTestIDs("avatar-image", "image")}
						source={{ uri: avatarUri }}
						style={styles.avatar}
					/>
				</View>
				<View>
					<View style={styles.amountViewPadding}>
						{formattedAmount ? (
							<SharedAccountText type="listItemTitle">
								{formattedAmount}
							</SharedAccountText>
						) : (
							<SkeletonLoader
								{...generateTestIDs("transaction-name-skeleton-placeholder")}
								width="100%"
								style={styles.subtitleSkeleton}
							/>
						)}
					</View>
					<View style={styles.categoryViewPadding}>
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
			</View>

			<View
				style={[
					styles.rightContainer,
					{
						marginVertical: padding.screen.vertical.large,
					},
				]}
			>
				<View style={styles.dateViewPadding}>
					{transactionDate ? (
						<SharedAccountText>{transactionDate}</SharedAccountText>
					) : (
						<SkeletonLoader width="80%" />
					)}
				</View>
				<View style={styles.circleArrowViewPadding}>
					{isCredit ? (
						<ArrowUpSvg
							width={ICON_SIZE}
							height={ICON_SIZE}
							{...generateTestIDs("arrow-up-svg", "image")}
							color={colors.green}
						/>
					) : (
						<ArrowDownSvg
							{...generateTestIDs("arrow-down-svg", "image")}
							width={ICON_SIZE}
							height={ICON_SIZE}
							color={colors.red}
						/>
					)}
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	amountViewPadding: {
		alignItems: "flex-start",
		flex: 1,
		justifyContent: "center",
		paddingLeft: padding.screen.horizontal.xSmall,
		width: "100%",
	},
	avatar: {
		borderColor: colors.dark,
		borderRadius: AVATAR_RADIUS,
		height: AVATAR_SIZE,
		width: AVATAR_SIZE,
	},
	avatarContainer: {
		alignItems: "center",
		justifyContent: "center",
	},
	categoryViewPadding: {
		alignItems: "flex-start",
		flex: 1,
		justifyContent: "center",
		paddingLeft: padding.screen.horizontal.xSmall,
	},
	circleArrowViewPadding: {
		alignItems: "flex-end",
		flex: 1,
		justifyContent: "center",
	},
	container: {
		borderBottomColor: colors.light,
		borderBottomWidth: 1,
		flexDirection: "row",
	},
	dateViewPadding: {
		alignItems: "flex-end",
		flexGrow: 1,
		justifyContent: "center",
		width: "100%",
	},
	leftContainer: {
		alignItems: "center",
		flex: 1,
		// flexDirection: "row",
		justifyContent: "flex-start",
	},
	placeholderContainer: {
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	rightContainer: {
		alignItems: "flex-end",
		justifyContent: "space-between",
		// justifyContent: "center",
		paddingRight: 16,
		width: "50%",
	},
	row: {
		flexDirection: "row",
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
