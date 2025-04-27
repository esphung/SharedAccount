import React, { useMemo } from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { DateTime } from "luxon";

import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SkeletonLoader from "@components/SkeletonLoader/SkeletonLoader";
import ArrowDownSvg from "@assets/svg/circle-arrow-down-svgrepo-com.svg";
import ArrowUpSvg from "@assets/svg/circle-arrow-up-svgrepo-com.svg";
import colors from "@config/themes/colors";
import MoneyFunctions from "@utils/MoneyFunctions";

import type { Transaction } from "@data/models/types/Transaction";
import type { User } from "@data/models/types/User";

type Props = {
  item: Transaction;
  user?: User;
  onPress: (id: string) => void;
  itemHeight: number;
  isListReady?: boolean;
};

// Constants
const ICON_SIZE = 20;
const AVATAR_SIZE = 40;
const AVATAR_RADIUS = AVATAR_SIZE / 2;
const DEFAULT_AVATAR = "https://picsum.photos/200/300";

export default function TransactionListItem({ item, user, onPress, itemHeight, isListReady = true }: Props) {
  const isCredit = useMemo(() => item.type === "credit", [item.type]);
  const formattedAmount = useMemo(() => MoneyFunctions.formatMoney(item.amount, 2), [item.amount]);
  const avatarUri = useMemo(() => user?.avatar || DEFAULT_AVATAR, [user?.avatar]);
  const transactionDate = useMemo(() => DateTime.fromJSDate(item.date).toFormat("MMM d, t"), [item.date]);

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
      testID="transaction-list-item"
      style={[styles.container, { height: itemHeight }]}
      onPress={() => onPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.avatarContainer}>
        <SkeletonLoader
          testID="avatar-skeleton-placeholder"
          width={AVATAR_SIZE}
          height={AVATAR_SIZE}
          borderRadius={AVATAR_RADIUS}
          style={styles.skeleton}
        />
        <Image testID="avatar-image" source={{ uri: avatarUri }} style={styles.avatar} />
      </View>

      <View style={styles.detailsContainer}>
        {formattedAmount ? (
          <SharedAccountText type="transactionType">{formattedAmount}</SharedAccountText>
        ) : (
          <SkeletonLoader testID="transaction-name-skeleton-placeholder" width="60%" style={styles.subtitleSkeleton} />
        )}
      </View>

      <View style={styles.rightContainer}>
        <SharedAccountText type="transactionType">{transactionDate}</SharedAccountText>
        {isCredit ? (
          <ArrowUpSvg width={ICON_SIZE} height={ICON_SIZE} testID="arrow-up-svg" />
        ) : (
          <ArrowDownSvg width={ICON_SIZE} height={ICON_SIZE} testID="arrow-down-svg" />
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
    marginRight: 12,
    position: "relative",
  },
  container: {
    alignItems: "center",
    borderBottomColor: colors.light,
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingHorizontal: 12,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
  },
  placeholderContainer: {
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rightContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
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
