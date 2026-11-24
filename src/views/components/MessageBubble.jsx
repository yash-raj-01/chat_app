/**
 * MessageBubble Component - Renders sent and received chat message bubbles
 * Part of the MVC View layer.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function MessageBubble({ message }) {
  if (!message) return null;

  const isMe = message.sender === "me";

  return (
    <View style={[styles.bubble, isMe ? styles.mine : styles.theirs]}>
      <Text style={[styles.text, isMe ? styles.mineText : styles.theirsText]}>
        {message.text}
      </Text>
      <Text style={[styles.time, isMe ? styles.mineTime : styles.theirsTime]}>
        {message.time || ""}
      </Text>
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
  time: {
    ...theme.typography.timestamp,
    marginTop: 2,
    alignSelf: "flex-end",
  },
  mineTime: {
    color: "rgba(255, 255, 255, 0.75)",
  },
  theirsTime: {
    color: theme.colors.textSecondary,
  },
});
