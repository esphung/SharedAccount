import SharedAccountButton from "@components/SharedAccountButton/SharedAccountButton";
import React, { useState } from "react";
import type { TextInputProps, ViewStyle } from "react-native";
import { FlatList, StyleSheet, TextInput, View } from "react-native";

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
};

const AutoSuggestInput = React.forwardRef<TextInput, Props>((props, ref) => {
  // props
  const {
    value = "",
    textInputProps,
    onChange,
    items = [],
    containerStyle,
  } = props;

  // state
  const [text, setText] = React.useState<string>(value);
  const [suggestions, setSuggestions] = React.useState<Item[]>(items);
  const [isFocused, setIsFocused] = useState(false);

  const { ...restTextInputProps } = textInputProps || {};

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
        // scrollEnabled={false}
        data={suggestions}
        keyExtractor={(item) => item.label}
        renderItem={({ item }) => (
          <SharedAccountButton
            style={styles.suggestionItem}
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
      <TextInput
        ref={ref}
        value={text}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...restTextInputProps}
      />
      {memoizedSuggestionsList}
    </View>
  );
});

const styles = StyleSheet.create({
  suggestionList: {
    paddingTop: 8,
  },
  suggestionItem: {
    marginVertical: 4,
    alignItems: "flex-start",
  },
});

export default AutoSuggestInput;
