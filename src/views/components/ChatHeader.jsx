/**
 * ChatHeader Component - Custom header with contact avatar, name and status
 * Part of the MVC View layer.
 */
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function ChatHeader({ name = "Chat", avatar = "" }) {
  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{avatar || name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.status}>Active now</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: theme.colors.textWhite,
    fontSize: 13,
    fontWeight: "700",
  },
  meta: {
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  status: {
    fontSize: 11,
    color: "#10b981",
    fontWeight: "500",
  },
});
