import UpcomingBillsSectionListHeader from "@components/UpcomingBillsSectionList/UpcomingBillsSectionListHeader";
import UpcomingBillsSectionListItem from "@components/UpcomingBillsSectionList/UpcomingBillsSectionListItem";
import { DateTime } from "luxon";
import React from "react";
import { SectionList } from "react-native";
import type { ScheduledTransaction } from "types/ScheduledTransaction";
import UpcomingBillsSectionListFooter from "./UpcomingBillsSectionListFooter";

type SectionData = {
  title: string;
  data: ScheduledTransaction[];
};

// Function to add recurrence to a date
const getNextDate = (date: Date, interval: "weekly" | "monthly" | "yearly") => {
  if (interval === "weekly") {
    return DateTime.fromJSDate(date).plus({ days: 7 }).toJSDate();
  }
  if (interval === "monthly") {
    return DateTime.fromJSDate(date).plus({ months: 1 }).toJSDate();
  }
  return DateTime.fromJSDate(date).plus({ years: 1 }).toJSDate();
};

// Generate upcoming expenses for the next 6 months
const generateUpcomingBills = (
  expenses: ScheduledTransaction[],
  monthsAhead: number = 6,
): ScheduledTransaction[] => {
  const upcomingBills: ScheduledTransaction[] = [];
  const today = new Date();
  const endLimit = new Date();
  endLimit.setMonth(today.getMonth() + monthsAhead);

  expenses.forEach((expense) => {
    let nextDate = new Date(expense.startDate);
    const endDate = expense.endDate ? new Date(expense.endDate) : null;

    while (nextDate < endLimit && (!endDate || nextDate < endDate)) {
      upcomingBills.push({ ...expense, startDate: new Date(nextDate) });
      nextDate = getNextDate(nextDate, expense.repeatInterval);
    }
  });

  return upcomingBills;
};

// Group expenses by month
const groupBillsByMonth = (expenses: ScheduledTransaction[]): SectionData[] => {
  const grouped: {
    [key: string]: ScheduledTransaction[];
  } = {};

  // sort expenses by year - so that we can group them by month
  const sortedExpenses = expenses.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime(),
  );

  sortedExpenses.forEach((expense) => {
    const date = expense.startDate;
    const monthYear = DateTime.fromJSDate(date).toFormat("LLLL yyyy");

    if (!grouped[monthYear]) {
      grouped[monthYear] = [];
    }
    grouped[monthYear].push({
      ...expense,
    });
  });

  return Object.keys(grouped)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map((month) => ({
      title: month,
      data: grouped[month].sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime(),
      ),
    }));
};

const UpcomingBillsSectionList = ({
  scheduledTransactions,
}: {
  scheduledTransactions: ScheduledTransaction[];
}) => {
  const upcomingBills = React.useMemo(
    () => generateUpcomingBills(scheduledTransactions),
    [scheduledTransactions],
  );
  const sections = React.useMemo(
    () => groupBillsByMonth(upcomingBills),
    [upcomingBills],
  );

  return (
    <SectionList
      stickySectionHeadersEnabled={false}
      sections={sections}
      keyExtractor={(item) =>
        item.id + DateTime.fromJSDate(item.startDate).toMillis().toString()
      }
      renderSectionHeader={({ section: { title } }) => (
        <UpcomingBillsSectionListHeader title={title} />
      )}
      renderItem={({ item }) => {
        const isPast =
          item.startDate <=
          DateTime.now()
            .plus({ minute: -1 })
            // .endOf("day") // count all items as NOT past until the end of the day
            .toJSDate();

        const isSameMonth =
          DateTime.fromJSDate(item.startDate).toFormat("LLLL yyyy") ===
          DateTime.now().toFormat("LLLL yyyy");
        return (
          <UpcomingBillsSectionListItem
            item={item}
            isPast={isPast}
            isSameMonth={isSameMonth}
          />
        );
      }}
      ListFooterComponent={UpcomingBillsSectionListFooter}
    />
  );
};

export default UpcomingBillsSectionList;
