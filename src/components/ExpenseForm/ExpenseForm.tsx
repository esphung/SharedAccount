import AutoSuggestInput from "@components/AutoSuggestInput/AutoSuggestInput";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import { DateTime } from "luxon";
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
    getValues,
  } = useForm<{ amount: number; category: string; date: Date }>({
    defaultValues: {
      amount: 0,
      // category: items[0].value,
      date: new Date(),
    },
  });

  const currencyInputRef = React.useRef<TextInput>(null);
  const autoSuggestInputRef = React.useRef<TextInput>(null);
  const datePickerRef = React.useRef(null);

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // focus on the next input when the user presses "next" on the keyboard
  const focusNextInput = (currentKey?: string) => {
    const values = getValues();
    const refs = {
      amount: currencyInputRef,
      category: autoSuggestInputRef,
      date: datePickerRef,
    };
    const validators: Record<
      keyof typeof values,
      (value: string | number | Date) => boolean
    > = {
      amount: (value) => value === 0,
      category: (value) => !value || String(value).trim().length === 0,
      date: (value) => !value || DateTime.isDateTime(value),
    };
    (Object.keys(values) as (keyof typeof values)[]).forEach((key) => {
      if (key === currentKey) {
        return;
      } else if (validators.amount(values[key])) {
        const ref = refs[key as keyof typeof refs];
        setTimeout(() => {
          ref.current?.focus();
        }, 0);
        return;
      }
      if (!values[key]) {
        const ref = refs[key as keyof typeof refs];
        ref.current?.focus();
        return;
      }
    });
  };

  React.useEffect(() => {
    focusNextInput();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              onChange={onChange}
              containerStyle={styles.input}
              returnKeyType="done"
              onSubmitEditing={() => {
                focusNextInput("amount");
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
          pattern: {
            // check if the value 2 or more words; can have numbers or letters
            value: /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/,
            message: "Invalid category",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <AutoSuggestInput
            ref={autoSuggestInputRef}
            value={value}
            onChange={onChange}
            items={items}
            containerStyle={styles.input}
            textInputProps={{
              autoCapitalize: "none",
              autoCorrect: false,
              onSubmitEditing: () => {
                focusNextInput("category");
              },
            }}
          />
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

const borderColor = "rgb(206, 212, 218)";

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  datePickerContainer: {
    marginBottom: 10,
  },
  input: {
    borderColor: borderColor,
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 10,
  },
});

export default ExpenseForm;
