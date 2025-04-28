import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import DateTimePicker from "@components/DateTimePicker/DateTimePicker";
import FadeInView from "@components/FadeInView/FadeInView";
import SegmentedControl from "@components/SegmentedControl/SegmentedControl";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import React, { useCallback, useMemo, useState } from "react";

import type { TextInput } from "react-native";
import { Button, StyleSheet, View } from "react-native";

import useForm from "@presentation/hooks/useForm";
import type { Transaction } from "types/Transaction";

type FormState = Pick<Transaction, "amount" | "category" | "date" | "type" | "name">;
type FieldKey = keyof FormState;

type ExpenseFormProps = {
  onSubmit: (data: FormState) => void;
};

type FormInputField<T extends FieldKey = FieldKey> = {
  ref: (ref: TextInput) => void;
  key: T;
  label?: string;
  error?: string;
  placeholder?: string;
  value: FormState[T];
  animate?: boolean;
};

const filterInputList = (item: FormInputField, data: FormState) => {
  if (data[item.key] !== undefined && data[item.key] !== null && data[item.key] !== "") {
    return true;
  }

  if (item.key === "type") {
    return true;
  }
  if (item.key === "amount") {
    return !!data.type;
  }
  if (item.key === "category") {
    return !!data.amount && !!data.type;
  }
  if (item.key === "name") {
    return !!data.category && !!data.amount && !!data.type;
  }
  if (item.key === "date") {
    return !!data.category && !!data.amount;
  }
  return false;
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
  }, [amount, category, date, type, name, onSubmit, resetForm, validate]);

  const handleDebugFill = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 1000);
    const randomCategory = Math.random() > 0.5 ? "Food" : "Transport";
    const names = ["Groceries", "Bus Ticket", "Rent", "Utilities"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomType = Math.random() > 0.5 ? "expense" : "credit";

    handleChange("amount", randomAmount);
    handleChange("category", randomCategory);
    handleChange("name", randomName);
    handleChange("type", randomType);
    handleChange("date", new Date());
  }, [handleChange]);

  const handleOnSubmitEditing = useCallback(
    (key: FieldKey) => {
      const nextFields: Partial<Record<FieldKey, FieldKey>> = {
        amount: !category ? "category" : undefined,
        category: !name ? "name" : undefined,
      };
      const nextKey = nextFields[key];
      if (nextKey) {
        focusNextField([nextKey]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category],
  );

  const shouldAnimDict = useMemo(
    () => ({
      amount: { initial: 1, animate: false },
      category: { initial: 0, animate: !!values.amount },
      name: { initial: 0, animate: !!values.amount },
      date: { initial: 0, animate: !!values.amount },
      type: { initial: 1, animate: false },
    }),
    [values.amount],
  );

  const inputListData: FormInputField[] = useMemo(
    () => [
      {
        ref: (ref) => registerInput("type", ref),
        // label: "Type",
        key: "type",
        error: errors.type,
        value: type,
        placeholder: "Select a type...",
      },
      {
        ref: (ref) => registerInput("amount", ref),
        // label: "Amount",
        key: "amount",
        error: errors.amount,
        value: amount,
        placeholder: "Type an amount...",
        animate: true,
      },
      {
        ref: (ref) => registerInput("category", ref),
        label: "Category",
        key: "category",
        error: errors.category,
        value: category,
        placeholder: "Type a category...",
      },
      {
        ref: (ref) => registerInput("name", ref),
        label: "Name",
        key: "name",
        error: errors.name,
        value: name,
        placeholder: "Type a name...",
      },
      {
        ref: (ref) => registerInput("date", ref),
        // label: "Date",
        key: "date",
        error: errors.date,
        value: date,
        placeholder: "Select a date...",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [amount, category, date, errors, name, type],
  );

  const renderInput = useCallback(
    ({ item }: { item: FormInputField }) => {
      const { error, label, key, value, placeholder, ref } = item;

      let view: React.ReactNode = null;

      switch (key) {
        case "type":
          view = (
            <SegmentedControl
              options={["Expense", "Income"]}
              selectedIndex={value === "expense" ? 0 : 1}
              onSelect={(index) => handleChange("type", index === 0 ? "expense" : "credit")}
            />
          );
          break;
        case "date":
          view = (
            <DateTimePicker
              selectedDate={value as Date}
              onChangeDate={(d) => handleChange("date", d)}
              isDatePickerVisible={isDatePickerVisible}
              onDatePickerVisibilityChange={setDatePickerVisible}
            />
          );
          break;
        case "amount":
          view = (
            <SharedAccountCurrencyInput
              ref={ref}
              value={Number(value)}
              returnKeyType="done"
              onChangeValue={(val) => handleChange(key, val)}
              onSubmitEditing={() => handleOnSubmitEditing(key)}
            />
          );
          break;
        default:
          view = (
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
          break;
      }

      return (
        <FadeInView
          key={`${key}-${item.label}`}
          initialValue={shouldAnimDict[key].initial as 0 | 1}
          animate={shouldAnimDict[key].animate}
        >
          <View key={key}>
            {label && <SharedAccountText type="expenseFormLabel">{label}</SharedAccountText>}
            {view}
            {error && <SharedAccountText type="expenseFormError">{error}</SharedAccountText>}
          </View>
        </FadeInView>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shouldAnimDict, isDatePickerVisible],
  );

  return (
    <AwareScrollView contentContainerStyle={styles.fill}>
      <View style={styles.northPanel}>
        <View style={styles.container}>
          {inputListData.filter((item) => filterInputList(item, values)).map((item) => renderInput({ item }))}
        </View>
      </View>
      <View style={styles.southPanel}>
        <View style={styles.submitButtonContainer}>
          <SharedAccountButton title="Save Transaction" onPress={handleSave} />
          {__DEV__ && (
            <>
              <Button title="Fill Inputs" onPress={handleDebugFill} />
              <Button title="Clear" onPress={resetForm} />
            </>
          )}
        </View>
      </View>
    </AwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
    height: "100%",
    padding: 20,
  },
  fill: {
    flex: 1,
  },
  northPanel: {
    flexShrink: 1,
  },
  southPanel: {
    justifyContent: "flex-end",
    paddingBottom: 50,
  },
  submitButtonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default ExpenseForm;
