/**
 * ConnectionBanner Component - Displays live WebSocket status and reconnection alert
 * Part of the MVC View layer.
 */
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "../styles/theme";

export default function ConnectionBanner({ isConnected, onRetry }) {
  if (isConnected) {
    return (
      <View style={styles.onlineContainer}>
        <View style={styles.onlineDot} />
        <Text style={styles.onlineText}>Connected to live server</Text>
      </View>
    );
  }

  return (
    <View style={styles.offlineContainer}>
      <View style={styles.left}>
        <View style={styles.offlineDot} />
        <Text style={styles.offlineText}>Offline · Showing cached messages</Text>
      </View>
      {onRetry && (
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryPressed]}
          onPress={onRetry}
          accessibilityRole="button"
          accessibilityLabel="Retry connection"
        >
          <Text style={styles.retryText}>Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 4,
    backgroundColor: "#ecfdf5",
    borderBottomWidth: 1,
    borderBottomColor: "#d1fae5",
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10b981",
  },
  onlineText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#047857",
  },
  offlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 6,
    backgroundColor: "#fffbeb",
    borderBottomWidth: 1,
    borderBottomColor: "#fef3c7",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  offlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#f59e0b",
  },
  offlineText: {
    fontSize: 12,
    color: "#b45309",
    fontWeight: "500",
  },
  retryButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: "#fde68a",
    borderRadius: 4,
  },
  retryPressed: {
    opacity: 0.7,
  },
  retryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400e",
  },
});
