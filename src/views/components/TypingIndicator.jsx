/**
 * TypingIndicator Component - Shows active typing status
 * Part of the MVC View layer.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function TypingIndicator({ username }) {
  if (!username) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{username} is typing…</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 4,
  },
  text: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});
