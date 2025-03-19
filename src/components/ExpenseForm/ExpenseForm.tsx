import AutoSuggestInput from "@components/AutoSuggestInput/AutoSuggestInput";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import React from "react";
import { Controller, useForm } from "react-hook-form";
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
  }[]; // Expense categories
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<{ amount: number; category: string; date: Date }>({
    defaultValues: {
      amount: 0,
      category: items[0].value,
      date: new Date(),
    },
  });

  const submitExpense = (data: {
    amount: number;
    category: string;
    date: Date;
  }) => {
    onSubmit(data);
  };

  return (
    <View style={styles.inputContainer}>
      {/* Amount Input */}
      <SharedAccountText type="expenseFormLabel">Amount:</SharedAccountText>
      <Controller
        control={control}
        name="amount"
        rules={{
          required: "Amount is required",
          min: {
            value: 0,
            message: "Amount must be greater than 0",
          },
        }}
        render={({ field: { onChange, value } }) => {
          return (
            <SharedAccountCurrencyInput
              value={value}
              onChange={onChange}
              containerStyle={styles.input}
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
        rules={{ required: "Category is required" }}
        render={({ field: { onChange, value } }) => (
          <>
            {/* <DropdownPicker
              items={items}
              selectedValue={value}
              onChange={onChange}
              containerStyle={styles.categoryPicker}
            /> */}
            {/* {(items.find((item) => item.value === value) === undefined || */}
            {/* value === "Other") && ( */}
            <AutoSuggestInput
              value={value}
              onChange={onChange}
              items={items}
              containerStyle={styles.input}
            />
            {/* )} */}
          </>
        )}
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
            selectedDate={value}
            onChangeDate={onChange}
            containerStyle={styles.datePicker}
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

const borderColor = "rgb(206, 212, 218)";

const styles = StyleSheet.create({
  inputContainer: {
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  categoryPicker: {
    borderWidth: 1,
    borderColor: borderColor,
    borderRadius: 5,
    marginBottom: 10,
  },
  datePicker: {
    marginBottom: 10,
  },
});

export default ExpenseForm;
