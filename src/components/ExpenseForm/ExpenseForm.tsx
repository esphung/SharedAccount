import AutoSuggestInput from "@components/AutoSuggestInput/AutoSuggestInput";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { TextInput } from "react-native";
import { StyleSheet, View } from "react-native";

const ExpenseForm = ({
  onSubmit,
  items = [
    // TODO: Add from store
    { label: "Food", value: "Food" },
    { label: "Transportation", value: "Transportation" },
    { label: "Entertainment", value: "Entertainment" },
    { label: "Bills", value: "Bills" },
    { label: "Other", value: "Other" },
  ],
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
    formState: { errors, isValid },
  } = useForm<{ amount: number; category: string; date: Date }>({
    defaultValues: {
      amount: 0,
      date: new Date(),
    },
  });

  const currencyInputRef = React.useRef<TextInput>(null);
  const autoSuggestInputRef = React.useRef<TextInput>(null);
  const datePickerRef = React.useRef(null);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  const submitExpense = (data: {
    amount: number;
    category: string;
    date: Date;
  }) => {
    onSubmit(data);
  };

  return (
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
      {errors.amount && (
        <SharedAccountText type="expenseFormError">
          {errors.amount.message}
        </SharedAccountText>
      )}

      {/* Category Picker */}
      <SharedAccountText type="expenseFormLabel">Category:</SharedAccountText>
      <Controller
        control={control}
        name="category"
        rules={{
          required: "Category is required",
        }}
        render={({ field: { onChange, value } }) => {
          return (
            <AutoSuggestInput
              ref={autoSuggestInputRef}
              value={value}
              suggestions={items.map((item) => item.value)}
              onSelect={onChange}
            />
          );
        }}
      />
      {errors.category && (
        <SharedAccountText type="expenseFormError">
          {errors.category.message}
        </SharedAccountText>
      )}

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
            containerStyle={styles.datePickerContainer}
            isDatePickerVisible={isDatePickerVisible}
            onDatePickerVisibilityChange={setDatePickerVisible}
          />
        )}
      />

      {/* Submit Button */}
      <SharedAccountButton
        disabled={!isValid}
        title="Save Expense"
        onPress={() => {
          handleSubmit(submitExpense)();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    paddingVertical: 16,
  },
  datePickerContainer: {
    // marginBottom: 10,
  },
});

export default ExpenseForm;
