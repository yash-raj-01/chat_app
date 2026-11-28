/**
 * OutboxService - Manages offline message queue in AsyncStorage
 * Part of the MVC Model layer.
 * 
 * Queues outgoing messages when disconnected and flushes them when back online.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

const OUTBOX_KEY_PREFIX = "chat_app:outbox:";

export const OutboxService = {
  /**
   * Get all queued pending messages for a chat
   */
  async getPendingMessages(chatId) {
    try {
      const raw = await AsyncStorage.getItem(`${OUTBOX_KEY_PREFIX}${chatId}`);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn(`[OutboxService] Failed to read outbox for chat ${chatId}:`, err);
      return [];
    }
  },

  /**
   * Queue a pending message into outbox
   */
  async queueMessage(chatId, message) {
    try {
      const existing = await this.getPendingMessages(chatId);
      const updated = [...existing, message];
      await AsyncStorage.setItem(
        `${OUTBOX_KEY_PREFIX}${chatId}`,
        JSON.stringify(updated)
      );
      return updated;
    } catch (err) {
      console.warn(`[OutboxService] Failed to queue message for chat ${chatId}:`, err);
      return [];
    }
  },

  /**
   * Remove a message from outbox once delivered
   */
  async removeMessage(chatId, messageId) {
    try {
      const existing = await this.getPendingMessages(chatId);
      const filtered = existing.filter((m) => m.id !== messageId);
      await AsyncStorage.setItem(
        `${OUTBOX_KEY_PREFIX}${chatId}`,
        JSON.stringify(filtered)
      );
      return filtered;
    } catch (err) {
      console.warn(`[OutboxService] Failed to remove message from outbox:`, err);
      return [];
    }
  },

  /**
   * Clear entire outbox for a chat
   */
  async clearOutbox(chatId) {
    try {
      await AsyncStorage.removeItem(`${OUTBOX_KEY_PREFIX}${chatId}`);
    } catch (err) {
      console.warn(`[OutboxService] Failed to clear outbox for chat ${chatId}:`, err);
    }
  },
};
