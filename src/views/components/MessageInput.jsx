/**
 * MessageInput Component - Text input bar with draft handling and send button
 * Part of the MVC View layer.
 */
import React from "react";
import { View, TextInput, Pressable, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function MessageInput({
  value,
  onChangeText,
  onSend,
  placeholder = "Message",
}) {
  const canSend = Boolean(value && value.trim());

  return (
    <View style={styles.inputBar}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        returnKeyType="send"
        onSubmitEditing={onSend}
      />
      <Pressable
        onPress={onSend}
        disabled={!canSend}
        style={({ pressed }) => [
          styles.sendButton,
          !canSend && styles.sendDisabled,
          pressed && canSend && styles.sendPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Send message"
      >
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    paddingHorizontal: 16,
    backgroundColor: "#f1f4f6",
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 21,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  sendDisabled: {
    backgroundColor: theme.colors.primaryLight,
  },
  sendPressed: {
    opacity: 0.8,
  },
  sendText: {
    color: theme.colors.textWhite,
    fontWeight: "700",
    fontSize: 15,
  },
});
