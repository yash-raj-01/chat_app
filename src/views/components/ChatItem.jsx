/**
 * ChatItem Component - Renders a single row in the chat list
 * Part of the MVC View layer.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../styles/theme";
import { getAvatarColor } from "../../utils/avatarColors";
import { formatRelativeTime } from "../../utils/dateFormatter";

export default function ChatItem({ chat, onPress }) {
  if (!chat) return null;

  const avatarBg = getAvatarColor(chat.name);
  const formattedTime = formatRelativeTime(chat.lastTime);

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Chat with ${chat.name}`}
    >
      <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
        <Text style={styles.avatarText}>{chat.avatar}</Text>
      </View>

      <View style={styles.middle}>
        <Text style={styles.name} numberOfLines={1}>
          {chat.name}
        </Text>
        <Text style={styles.last} numberOfLines={1}>
          {chat.lastMessage || "No messages yet"}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={styles.time}>{formattedTime}</Text>
        {Number(chat.unreadCount) > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    padding: 14,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  pressed: {
    backgroundColor: theme.colors.surfacePressed,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: theme.colors.textWhite,
    fontSize: 17,
    fontWeight: "700",
  },
  middle: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    ...theme.typography.name,
  },
  last: {
    ...theme.typography.lastMessage,
    marginTop: 3,
  },
  right: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
  time: {
    ...theme.typography.timestamp,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.badge,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    ...theme.typography.badge,
  },
});
