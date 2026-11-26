/**
 * SearchBar Component - Search conversations by name or message text
 * Part of the MVC View layer.
 */
import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function SearchBar({ value, onChangeText, onClear, placeholder = "Search chats…" }) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
      {Boolean(value) && (
        <Pressable
          style={styles.clearButton}
          onPress={onClear}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 38,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: "#f1f4f6",
    paddingHorizontal: 12,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  clearButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#d2dce2",
    justifyContent: "center",
    alignItems: "center",
  },
  clearText: {
    fontSize: 18,
    color: "#4a5e6c",
    lineHeight: 20,
    fontWeight: "600",
  },
});
