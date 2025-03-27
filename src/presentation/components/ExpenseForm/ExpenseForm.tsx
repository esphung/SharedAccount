import AutoSuggestInput from "@components/AutoSuggestInput/AutoSuggestInput";
import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { TextInput } from "react-native";
import { StyleSheet, View } from "react-native";

const defaultItems = [
  { label: "Food", value: "Food" },
  { label: "Transportation", value: "Transportation" },
  { label: "Entertainment", value: "Entertainment" },
  { label: "Bills", value: "Bills" },
  { label: "Other", value: "Other" },
];

const removeDuplicates = (items: { label: string; value: string }[]) => {
  const seen = new Set();
  return items.filter((item) => {
    const duplicate = seen.has(item.value);
    seen.add(item.value);
    return !duplicate;
  });
};

const ExpenseForm = ({
  onSubmit,
  items = [],
}: {
  onSubmit: (data: { amount: number; category: string; date: Date }) => void;
  items?: {
    label: string;
    value: string;
  }[];
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ amount: number; category: string; date: Date }>({
    defaultValues: {
      date: new Date(),
    },
  });

  const currencyInputRef = React.useRef<TextInput>(null);
  const autoSuggestInputRef = React.useRef<TextInput>(null);
  const datePickerRef = React.useRef(null);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const submitExpense = React.useCallback(
    (data: { amount: number; category: string; date: Date }) => {
      onSubmit(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <AwareScrollView>
      <View style={styles.container}>
        {/* Amount Input */}
        <SharedAccountText type="expenseFormLabel">Amount:</SharedAccountText>
        <Controller
          control={control}
          name="amount"
          rules={{
            required: "Amount is required",
            min: {
              value: 0.01,
              message: "Amount must be greater than 0",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <SharedAccountCurrencyInput
                ref={currencyInputRef}
                value={value}
                returnKeyType="done"
                onChangeValue={(cents) => {
                  onChange(cents);
                }}
              />
            );
          }}
        />
        {errors.amount && <SharedAccountText type="expenseFormError">{errors.amount.message}</SharedAccountText>}

        {/* Category Picker */}
        <SharedAccountText type="expenseFormLabel">Category:</SharedAccountText>
        <Controller
          control={control}
          name="category"
          rules={{
            required: "Category is required",
            // only one word
            pattern: {
              value: /^[a-zA-Z]+$/,
              message: "Category must be a single word",
            },
          }}
          render={({ field: { onChange, value } }) => {
            return (
              <AutoSuggestInput
                ref={autoSuggestInputRef}
                value={value}
                suggestions={removeDuplicates([...items, ...defaultItems]).map((item) => item.value)}
                onSelect={(val) => {
                  onChange(val);
                }}
                autoComplete="off"
                placeholder="Type a category..."
              />
            );
          }}
        />
        {errors.category && <SharedAccountText type="expenseFormError">{errors.category.message}</SharedAccountText>}

        {/* Date Picker */}
        <SharedAccountText type="expenseFormLabel">Date:</SharedAccountText>
        <Controller
          control={control}
          name="date"
          render={({ field: { onChange, value } }) => (
            <DateTimePicker
              ref={datePickerRef}
              selectedDate={value}
              onChangeDate={onChange}
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerVisibilityChange={setDatePickerVisible}
              mode="datetime"
            />
          )}
        />
      </View>

      {/* Submit Button */}
      <SharedAccountButton
        style={styles.submitButtonContainer}
        title="Save Expense"
        onPress={handleSubmit(submitExpense)}
      />
    </AwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  submitButtonContainer: {
    marginTop: 20,
  },
});

export default ExpenseForm;
