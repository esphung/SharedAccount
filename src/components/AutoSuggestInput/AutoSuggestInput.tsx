import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import SharedAccountTextInput from "@components/SharedAccountTextInput/SharedAccountTextInput";
import React, { useState } from "react";
import type { TextInput, TextInputProps, ViewStyle } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";

type Item = {
  label: string;
  value: string;
};

type Props = {
  value?: string;
  items?: Item[];
  onChange?: (value: string) => void;
  textInputProps?: TextInputProps & {
    label?: string;
    required?: boolean;
  };
  containerStyle?: ViewStyle;
} & TextInputProps;

const AutoSuggestInput = React.forwardRef<TextInput, Props>((props, ref) => {
  // props
  const { value, textInputProps, onChange, items = [], containerStyle } = props;

  // state
  const [text, setText] = React.useState(value);
  const [suggestions, setSuggestions] = React.useState<Item[]>(items);
  const [isFocused, setIsFocused] = useState(false);

  // callbacks
  const handleTextChange = React.useCallback(
    (newText: string) => {
      setText(newText);
      onChange?.(newText);
      if (newText.length > 0) {
        const filteredSuggestions = items.filter(
          (item: Item) =>
            item.value?.toLowerCase().indexOf(newText.toLowerCase()) > -1,
        );
        const list = [...filteredSuggestions, { label: "0", value: newText }];
        const uniqueList = list.filter(
          (item, index, self) =>
            index ===
            self.findIndex(
              (t) => t.value.toLowerCase() === item.value.toLowerCase(),
            ),
        );
        setSuggestions(uniqueList);
      } else {
        setSuggestions([]);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [suggestions],
  );

  const handleItemPress = React.useCallback((item: Item) => {
    setText(item.value);
    setSuggestions([]);
    onChange?.(item.value);
    if (!ref) {
      return;
    }
    if ("current" in ref && ref.current) {
      ref.current.blur();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memoizedSuggestionsList = React.useMemo(() => {
    if (!(suggestions.length > 0 && isFocused)) {
      return null;
    }
    return (
      <FlatList
        style={styles.suggestionList}
        data={suggestions}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <SharedAccountButton
            type="suggestionItem"
            title={item.value}
            onPress={() => handleItemPress(item)}
          >
            {item.value}
          </SharedAccountButton>
        )}
      />
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestions, isFocused]);

  return (
    <View style={containerStyle}>
      <SharedAccountTextInput
        ref={ref}
        value={text}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...textInputProps}
      />
      {memoizedSuggestionsList}
    </View>
  );
});

const styles = StyleSheet.create({
  suggestionList: {
    paddingTop: 8,
  },
});

export default AutoSuggestInput;
