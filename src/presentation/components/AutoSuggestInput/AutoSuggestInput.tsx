import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import colors from "@config/themes/colors";
import React, { useState } from "react";
import type { TextInput, TextInputProps } from "react-native";
import { FlatList, Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";

type AutoSuggestInputProps = {
  suggestions: string[];
  onSelect: (val: string) => void;
  placeholder?: string;
  value?: string;
} & TextInputProps;

const AutoSuggestInput = React.forwardRef<TextInput, AutoSuggestInputProps>(
  ({ value = "", suggestions = [], onSelect, placeholder = "Type something...", ...rest }, ref) => {
    const [query, setQuery] = useState(value);
    const [filtered, setFiltered] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleChange = React.useCallback(
      (text: string) => {
        setQuery(text);
        if (text.length > 0) {
          const filteredData = suggestions.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
          setFiltered(filteredData);
          setShowSuggestions(true);
        } else {
          setFiltered([]);
          setShowSuggestions(false);
        }
      },
      [suggestions],
    );

    const handleSelect = React.useCallback(
      (newVal: string) => {
        const cleanedValue = newVal?.trimEnd();
        if (value !== newVal) {
          onSelect?.(cleanedValue);
        }
        setQuery(cleanedValue);
        setFiltered([]);
        setShowSuggestions(false);
        Keyboard.dismiss();
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [value],
    );

    return (
      <View style={styles.container}>
        <SharedAccountTextInput
          ref={ref}
          style={styles.input}
          value={query}
          onChangeText={handleChange}
          placeholder={placeholder}
          onSubmitEditing={() => handleSelect(query)}
          onEndEditing={() => handleSelect(query)}
          {...rest}
        />

        {showSuggestions && filtered.length > 0 && (
          <FlatList
            scrollEnabled={false}
            style={styles.suggestionList}
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionItem}>
                <SharedAccountText>{item}</SharedAccountText>
              </TouchableOpacity>
            )}
            keyboardShouldPersistTaps="handled"
          />
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: "100%",
  },
  input: {
    backgroundColor: colors.light,
    borderColor: colors.dark,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
  },
  suggestionItem: {
    padding: 16,
  },
  suggestionList: {
    backgroundColor: colors.light,
    borderColor: colors.dark,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: 4,
    // maxHeight: 150,
  },
});

export default AutoSuggestInput;
