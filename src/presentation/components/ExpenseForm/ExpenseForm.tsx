import AutoSuggestInput from "@components/AutoSuggestInput/AutoSuggestInput";
import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import type { RefObject } from "react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type { SectionList, TextInput } from "react-native";
import { Button, StyleSheet, View } from "react-native";

enum Category {
  Food = "Food",
  Transportation = "Transportation",
  Entertainment = "Entertainment",
  Bills = "Bills",
  Other = "Other",
}

type ExpenseFormProps = {
  onSubmit: (data: { amount: number; category: string; date: Date }) => void;
  items?: { label: string; value: string }[];
  listRef: RefObject<SectionList | null>;
};

const ExpenseForm = ({ onSubmit, items = [] }: ExpenseFormProps) => {
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  const [errors, setErrors] = useState<{ amount?: string; category?: string }>({});

  const currencyInputRef = useRef<TextInput>(null);
  const categoryInputRef = useRef<TextInput>(null);

  const suggestions = useMemo(() => {
    const seen = new Set<string>();
    return (
      [...items, ...Object.values(Category)]
        .map((item) => {
          if (typeof item === "string") {
            return { label: item, value: item };
          }
          return item;
        })
        .map(({ label, value }) => {
          const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);
          return { label: formattedLabel, value };
        })
        .sort((a, b) => a.label.localeCompare(b.label))
        // Remove duplicates
        .filter(({ value }) => {
          if (seen.has(value)) {
            return false;
          }
          seen.add(value);
          return true;
        })
        .map(({ value }) => value)
    );
  }, [items]);

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
  }, [amount, category, onSubmit, validate]);

  const onChangeText = useCallback((text: string) => {
    setCategory(text);
  }, []);

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
          <AutoSuggestInput
            ref={categoryInputRef}
            value={category}
            suggestions={suggestions}
            onSelect={setCategory}
            placeholder="Type a category..."
            onChangeText={onChangeText}
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
              const randCategory = suggestions[Math.floor(Math.random() * suggestions.length)];
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
