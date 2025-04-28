import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import useForm from "@presentation/hooks/useForm";
import React, { useCallback, useMemo, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import type { TextInput } from "react-native";
import type RNDateTimePicker from "react-native-modal-datetime-picker";
import type { Transaction } from "types/Transaction";

type FormState = Pick<Transaction, "amount" | "category" | "date" | "type" | "name">;

type ExpenseFormProps = {
  onSubmit: (data: FormState) => void;
};

type FieldKey = keyof FormState;

type FormInputField<T extends FieldKey = FieldKey> = {
  ref: (ref: T extends "date" ? RNDateTimePicker | null : TextInput | null) => void;
  key: T;
  label: string;
  error?: string;
  placeholder?: string;
  value: FormState[T];
};

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const { values, errors, handleChange, validate, resetForm, focusNextField, registerInput } = useForm<FormState>({
    amount: 0,
    category: "",
    type: "expense",
    date: new Date(),
    name: "",
  });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const { amount, category, type, date, name } = values;

  const handleSave = useCallback(() => {
    const isValid = validate((input) => {
      const formErrors: Partial<typeof errors> = {};

      if (input.amount <= 0) {
        formErrors.amount = "Amount must be greater than 0";
      }

      if (!input.category.trim()) {
        formErrors.category = "Category is required";
      } else if (!/^[a-zA-Z]+$/.test(input.category.trim())) {
        formErrors.category = "Category must be a single word";
      }

      return formErrors;
    });

    if (isValid) {
      onSubmit({ amount, category, date, type, name });
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, category, date, type, name]);

  const handleDebugFill = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 1000);
    const randomCategory = Math.random() > 0.5 ? "Food" : "Transport";
    const names = ["Groceries", "Bus Ticket", "Rent", "Utilities"];
    const randomName = names[Math.floor(Math.random() * names.length)];

    handleChange("amount", randomAmount);
    handleChange("category", randomCategory);
    handleChange("name", randomName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmitEditing = useCallback(
    (key: FieldKey) => {
      const nextFields: Record<FieldKey, FieldKey | undefined> = {
        amount: !category ? "category" : undefined,
        category: !name ? "name" : undefined,
        name: undefined,
        date: undefined,
        type: undefined,
      };
      const nextKey = nextFields[key];
      if (nextKey) {
        focusNextField([nextKey]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, name],
  );

  const inputListData: FormInputField[] = useMemo(
    () => [
      {
        // @ts-expect-error ref is not assignable to type TextInput
        ref: (ref) => registerInput("amount", ref),
        label: "Amount",
        key: "amount",
        error: errors.amount,
        value: amount,
        placeholder: "Type an amount...",
      },
      {
        // @ts-expect-error ref is not assignable to type TextInput
        ref: (ref) => registerInput("category", ref),
        label: "Category",
        key: "category",
        error: errors.category,
        value: category,
        placeholder: "Type a category...",
      },
      {
        // @ts-expect-error ref is not assignable to type TextInput
        ref: (ref) => registerInput("name", ref),
        label: "Name",
        key: "name",
        error: errors.name,
        value: name,
        placeholder: "Type a name...",
      },
      {
        // @ts-expect-error ref is not assignable to type TextInput
        ref: (ref) => registerInput("date", ref),
        label: "Date",
        key: "date",
        error: errors.date,
        value: date,
        placeholder: "Select a date...",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, category, date, errors, name],
  );

  const renderInput = useCallback(
    ({ item }: { item: FormInputField }) => {
      const { error, label, value, placeholder, key, ref } = item;

      const renderField = () => {
        if (key === "date") {
          return (
            <DateTimePicker
              ref={ref}
              containerStyle={styles.inputContainer}
              selectedDate={value as Date}
              onChangeDate={(d) => handleChange("date", d)}
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerVisibilityChange={setDatePickerVisible}
            />
          );
        }
        if (key === "amount") {
          return (
            <SharedAccountCurrencyInput
              ref={ref}
              value={Number(value)}
              returnKeyType="done"
              onChangeValue={(val) => handleChange(key, val)}
              onSubmitEditing={() => handleOnSubmitEditing(key)}
            />
          );
        }
        return (
          <SharedAccountTextInput
            ref={ref}
            autoComplete="off"
            autoCorrect={false}
            value={String(value)}
            placeholder={placeholder}
            onChangeText={(text) => handleChange(key, text)}
            onSubmitEditing={() => handleOnSubmitEditing(key)}
          />
        );
      };

      return (
        <View key={key} style={styles.itemContainer}>
          {label && <SharedAccountText type="expenseFormLabel">{label}</SharedAccountText>}
          {renderField()}
          {error && <SharedAccountText type="expenseFormError">{error}</SharedAccountText>}
        </View>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDatePickerVisible],
  );

  return (
    <AwareScrollView contentContainerStyle={styles.fill}>
      <View style={styles.northPanel}>
        <View style={styles.container}>{inputListData.map((item) => renderInput({ item }))}</View>
      </View>
      <View style={styles.southPanel}>
        <SharedAccountButton style={styles.submitButtonContainer} title="Save Expense" onPress={handleSave} />
        {__DEV__ && (
          <>
            <Button title="Fill Inputs" onPress={handleDebugFill} />
            <Button title="Clear" onPress={resetForm} />
          </>
        )}
      </View>
    </AwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    height: "100%",
    paddingVertical: 20,
  },
  fill: { flex: 1 },
  inputContainer: {
    gap: 20,
    height: "100%",
    paddingVertical: 20,
  },
  itemContainer: {
    paddingVertical: 10,
  },
  northPanel: { flexShrink: 1 },
  southPanel: { justifyContent: "flex-end" },
  submitButtonContainer: {},
});

export default ExpenseForm;
