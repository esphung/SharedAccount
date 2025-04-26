import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";

import type { RefObject } from "react";
import React, { useCallback, useRef, useState } from "react";
import type { SectionList } from "react-native";
import type { TextInput } from "react-native";
import { Button, StyleSheet, View } from "react-native";

type ExpenseFormProps = {
  onSubmit: (data: { amount: number; category: string; date: Date }) => void;
  items?: { label: string; value: string }[];
  listRef: RefObject<SectionList | null>;
};

const ExpenseForm = ({ onSubmit }: ExpenseFormProps) => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  const currencyInputRef = useRef<TextInput>(null);
  const categoryInputRef = useRef<TextInput>(null);

  const validate = useCallback(() => {
    const newErrors: { amount?: string; category?: string } = {};

    if (amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    if (!category.trim()) {
      newErrors.category = "Category is required";
    } else if (!/^[a-zA-Z]+$/.test(category.trim())) {
      newErrors.category = "Category must be a single word";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }, [amount, category]);

  const handleSave = useCallback(() => {
    if (validate()) {
      onSubmit({ amount, category: category.trim(), date: new Date() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, category]);

  const onChangeText = useCallback((text: string) => {
    setCategory(text);
  }, []);

  const onSubmitOrEndEditing = useCallback(() => {
    const cleaned = category.trim();
    setCategory(cleaned);
    setErrors((prev) => ({ ...prev, category: cleaned ? undefined : "Category is required" }));
  }, [category]);

  return (
    <AwareScrollView contentContainerStyle={styles.fill}>
      <View style={styles.northPanel}>
        <View style={styles.container}>
          <SharedAccountText type="expenseFormLabel">Amount:</SharedAccountText>
          <SharedAccountCurrencyInput
            ref={currencyInputRef}
            value={amount}
            returnKeyType="done"
            onChangeValue={setAmount}
          />
          {errors.amount && <SharedAccountText type="expenseFormError">{errors.amount}</SharedAccountText>}

          <SharedAccountText type="expenseFormLabel">Category:</SharedAccountText>
          <SharedAccountTextInput
            autoComplete="off"
            autoCorrect={false}
            ref={categoryInputRef}
            value={category}
            placeholder="Type a category..."
            onChangeText={onChangeText}
            onEndEditing={onSubmitOrEndEditing}
            onSubmitEditing={onSubmitOrEndEditing}
          />
          {errors.category && <SharedAccountText type="expenseFormError">{errors.category}</SharedAccountText>}
        </View>
      </View>

      <View style={styles.southPanel}>
        <SharedAccountButton style={styles.submitButtonContainer} title="Save Expense" onPress={handleSave} />
        {__DEV__ && (
          <Button
            title="Debug"
            onPress={() => {
              // fake values
              const randAmount = Math.floor(Math.random() * 1000);
              const randCategory = Math.random() > 0.5 ? "Food" : "Transport";
              setAmount(randAmount);
              setCategory(randCategory);
            }}
          />
        )}
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
