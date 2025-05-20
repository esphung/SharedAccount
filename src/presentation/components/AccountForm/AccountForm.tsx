import AwareScrollView from "@components/AwareScrollView/AwareScrollView";
import FadeInView from "@components/FadeInView/FadeInView";
import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountCurrencyInput from "@components/SharedAccountCurrencyInput/SharedAccountCurrencyInput";
import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import useForm from "@presentation/hooks/useForm";
import React, { useCallback, useMemo } from "react";

import type { TextInput } from "react-native";
import { Button, StyleSheet, View } from "react-native";
import type { Account } from "types/Account";

type FormState = Pick<Account, "name" | "startingBalance">;
type FieldKey = keyof FormState;

type AccountFormProps = {
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

const AccountForm = ({ onSubmit }: AccountFormProps) => {
  const { values, errors, handleChange, validate, resetForm, focusNextField, registerInput } = useForm<FormState>({
    name: "",
    startingBalance: 0,
  });

  const handleSave = useCallback(() => {
    const isValid = validate((input) => {
      const formErrors: Partial<typeof errors> = {};
      if (!input.name.trim()) {
        formErrors.name = "Name is required";
      }
      return formErrors;
    });

    if (isValid) {
      onSubmit(values);
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  const handleDebugFill = useCallback(() => {
    const randomAmount = Math.floor(Math.random() * 1000);
    const randomName = Math.random() > 0.5 ? "Hello World" : "My Test Account";
    handleChange("startingBalance", randomAmount);
    handleChange("name", randomName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSubmitEditing = useCallback(
    (key: FieldKey) => {
      const nextFields: Partial<Record<FieldKey, FieldKey>> = {
        startingBalance: !values.name ? "name" : undefined,
      };
      const nextKey = nextFields[key];
      if (nextKey) {
        focusNextField([nextKey]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.name],
  );

  const inputListData: FormInputField[] = useMemo(
    () => [
      {
        ref: (ref) => registerInput("startingBalance", ref),
        key: "startingBalance",
        error: errors.startingBalance,
        value: values.startingBalance,
        placeholder: "Type a starting balance...",
      },
      {
        ref: (ref) => registerInput("name", ref),
        label: "Name",
        key: "name",
        error: errors.name,
        value: values.name,
        placeholder: "Type a new account name...",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [errors.startingBalance, errors.name, values.name, values.startingBalance],
  );

  const renderInput = useCallback(
    ({ item }: { item: FormInputField }) => {
      const { error, label, key, value, placeholder, ref } = item;

      let view: React.ReactNode = null;

      switch (key) {
        case "startingBalance":
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
        case "name":
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
        <FadeInView key={`${key}-${item.label}`} initialValue={0} animate>
          <View key={key}>
            {label && <SharedAccountText type="expenseFormLabel">{label}</SharedAccountText>}
            {view}
            <View style={styles.spacer} />
            {error && <SharedAccountText type="expenseFormError">{error}</SharedAccountText>}
          </View>
        </FadeInView>
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values.name, values.startingBalance],
  );

  return (
    <AwareScrollView contentContainerStyle={styles.fill}>
      <View style={styles.northPanel}>
        <View style={styles.container}>{inputListData.map((item) => renderInput({ item }))}</View>
      </View>
      <View style={styles.southPanel}>
        <View style={styles.submitButtonContainer}>
          <SharedAccountButton disabled={!values.name} title="Save Account" onPress={handleSave} />
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
  spacer: {
    height: 10,
  },
  submitButtonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
});

export default AccountForm;
