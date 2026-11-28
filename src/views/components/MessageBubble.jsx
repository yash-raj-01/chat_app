/**
 * MessageBubble Component - Renders sent and received chat message bubbles
 * Part of the MVC View layer.
 * Includes pending status indicator, reaction badges, and long-press interaction.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function MessageBubble({ message, onLongPress }) {
  if (!message) return null;

  const isMe = message.sender === "me";
  const hasReactions = Array.isArray(message.reactions) && message.reactions.length > 0;

  return (
    <View style={[styles.wrapper, isMe ? styles.wrapperMine : styles.wrapperTheirs]}>
      <Pressable
        style={({ pressed }) => [
          styles.bubble,
          isMe ? styles.mine : styles.theirs,
          pressed && styles.pressed,
        ]}
        onLongPress={() => onLongPress?.(message)}
        delayLongPress={300}
      >
        <Text style={[styles.text, isMe ? styles.mineText : styles.theirsText]}>
          {message.text}
        </Text>
        <View style={styles.footerRow}>
          <Text style={[styles.time, isMe ? styles.mineTime : styles.theirsTime]}>
            {message.time || ""}
          </Text>
          {isMe && <Text style={styles.statusText}> · Sent</Text>}
        </View>
      </Pressable>

      {/* Emoji Reactions Badge */}
      {hasReactions && (
        <View
          style={[
            styles.reactionsBadge,
            isMe ? styles.reactionsMine : styles.reactionsTheirs,
          ]}
        >
          {message.reactions.map((emoji, idx) => (
            <Text key={idx} style={styles.reactionEmoji}>
              {emoji}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  wrapperMine: {
    alignSelf: "flex-end",
  },
  wrapperTheirs: {
    alignSelf: "flex-start",
  },
  bubble: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.lg,
  },
  pressed: {
    opacity: 0.9,
  },
  theirs: {
    backgroundColor: theme.colors.bubbleTheirs,
    borderBottomLeftRadius: 4,
  },
  mine: {
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
  statusText: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
  },
  reactionsBadge: {
    flexDirection: "row",
    gap: 2,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: -6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reactionsMine: {
    alignSelf: "flex-end",
    marginRight: 6,
  },
  reactionsTheirs: {
    alignSelf: "flex-start",
    marginLeft: 6,
  },
  reactionEmoji: {
    fontSize: 13,
  },
});
