/**
 * MessageBubble Component - Renders sent and received chat message bubbles
 * Part of the MVC View layer.
 * Includes pending/sending status indicator for offline queue.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function MessageBubble({ message }) {
  if (!message) return null;

  const isMe = message.sender === "me";
  const isPending = message.status === "pending";

  return (
    <View style={[styles.bubble, isMe ? styles.mine : styles.theirs]}>
      <Text style={[styles.text, isMe ? styles.mineText : styles.theirsText]}>
        {message.text}
      </Text>
      <View style={styles.footerRow}>
        <Text style={[styles.time, isMe ? styles.mineTime : styles.theirsTime]}>
          {message.time || ""}
        </Text>
        {isPending && (
          <Text style={styles.pendingText}> · Sending…</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
    marginVertical: 4,
  },
  theirs: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.bubbleTheirs,
    borderBottomLeftRadius: 4,
  },
  mine: {
    alignSelf: "flex-end",
    backgroundColor: theme.colors.bubbleMine,
    borderBottomRightRadius: 4,
  },
  text: {
    ...theme.typography.messageText,
  },
  mineText: {
    color: theme.colors.textWhite,
  },
  theirsText: {
    color: theme.colors.textPrimary,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
    alignSelf: "flex-end",
  },
  time: {
    ...theme.typography.timestamp,
  },
  mineTime: {
    color: "rgba(255, 255, 255, 0.75)",
  },
  theirsTime: {
    color: theme.colors.textSecondary,
  },
  pendingText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontStyle: "italic",
  },
});
