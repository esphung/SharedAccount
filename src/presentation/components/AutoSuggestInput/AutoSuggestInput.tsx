import React, { useCallback, useEffect, useState } from "react";

import type { TextInput } from "react-native";
import { FlatList, Keyboard, StyleSheet, TouchableOpacity, View } from "react-native";

import SharedAccountText from "@components/SharedAccountText/SharedAccountText";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import colors from "@config/themes/colors";

type AutoSuggestInputProps = {
  suggestions: string[];
  onSelect: (val: string) => void;
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
};

const AutoSuggestInput = React.forwardRef<TextInput, AutoSuggestInputProps>(
  ({ value = "", suggestions = [], onSelect, placeholder = "Type something...", onChangeText }, ref) => {
    const [query, setQuery] = useState(value);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    const filterSuggestions = useCallback(
      (input: string) => {
        if (!input.trim()) {
          return [];
        }
        const lowerInput = input.toLowerCase();
        return suggestions.filter((item) => item.toLowerCase().includes(lowerInput));
      },
      [suggestions],
    );

    const handleChange = useCallback((text: string) => {
      setQuery(text);
      onChangeText?.(text);

      const filtered = filterSuggestions(text);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelect = useCallback((selected: string) => {
      const cleaned = selected?.trimEnd();
      setQuery(cleaned);
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      onChangeText?.(cleaned);
      onSelect(cleaned);
      // Dismiss the keyboard
      Keyboard.dismiss();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <View style={styles.container}>
        <SharedAccountTextInput
          ref={ref}
          style={styles.input}
          value={query}
          placeholder={placeholder}
          onChangeText={handleChange}
          onSubmitEditing={() => handleSelect(query)}
          onEndEditing={() => handleSelect(query)}
        />

        {showSuggestions && (
          <FlatList
            scrollEnabled={false}
            data={filteredSuggestions}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleSelect(item)} style={styles.suggestionItem}>
                <SharedAccountText>{item}</SharedAccountText>
              </TouchableOpacity>
            )}
            style={styles.suggestionList}
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
  },
});

export default AutoSuggestInput;
