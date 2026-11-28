/**
 * MessageActionsModal Component - Floating reactions and actions sheet
 * Part of the MVC View layer.
 * 
 * Allows users to add emoji reactions, copy message text, or delete a message.
 */
import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import { theme } from "../styles/theme";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥"];

export default function MessageActionsModal({
  visible,
  message,
  onClose,
  onSelectReaction,
  onDeleteMessage,
}) {
  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              {/* Floating Emoji Bar */}
              <View style={styles.emojiBar}>
                {REACTION_EMOJIS.map((emoji) => {
                  const hasReacted = message.reactions?.includes(emoji);
                  return (
                    <Pressable
                      key={emoji}
                      style={({ pressed }) => [
                        styles.emojiButton,
                        hasReacted && styles.emojiSelected,
                        pressed && styles.emojiPressed,
                      ]}
                      onPress={() => onSelectReaction(message.id, emoji)}
                      accessibilityRole="button"
                      accessibilityLabel={`React with ${emoji}`}
                    >
                      <Text style={styles.emojiText}>{emoji}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Message Preview */}
              <View style={styles.previewBox}>
                <Text style={styles.previewText} numberOfLines={2}>
                  "{message.text}"
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionGroup}>
                <Pressable
                  style={({ pressed }) => [
                    styles.actionRow,
                    styles.deleteAction,
                    pressed && styles.actionPressed,
                  ]}
                  onPress={() => onDeleteMessage(message.id)}
                  accessibilityRole="button"
                >
                  <Text style={styles.deleteText}>Delete Message</Text>
                </Pressable>

                <Pressable
                  style={({ pressed }) => [
                    styles.actionRow,
                    styles.cancelAction,
                    pressed && styles.actionPressed,
                  ]}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  sheetContainer: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: theme.spacing.lg,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  emojiBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 28,
  },
  emojiButton: {
    padding: 6,
    borderRadius: 20,
  },
  emojiSelected: {
    backgroundColor: "#dbeafe",
  },
  emojiPressed: {
    transform: [{ scale: 1.25 }],
  },
  emojiText: {
    fontSize: 26,
  },
  previewBox: {
    width: "100%",
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
    textAlign: "center",
  },
  actionGroup: {
    width: "100%",
    gap: 8,
  },
  actionRow: {
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  actionPressed: {
    opacity: 0.75,
  },
  deleteAction: {
    backgroundColor: "#fee2e2",
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#dc2626",
  },
  cancelAction: {
    backgroundColor: "#f1f5f9",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
});
