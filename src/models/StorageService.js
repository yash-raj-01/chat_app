/**
 * StorageService - Local Persistence using AsyncStorage
 * Part of the MVC Model layer.
 * 
 * Handles offline storage, drafts, local message caches, and unread counts.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "../config/apiConfig";

export const StorageService = {
  /**
   * Retrieve cached chat list from disk
   */
  async getCachedChats() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEYS.CHATS);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("[StorageService] Failed to load cached chats:", error);
      return null;
    }
  },

  /**
   * Save chat list to disk cache
   */
  async saveCachedChats(chats) {
    try {
      if (!Array.isArray(chats)) return;
      await AsyncStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
    } catch (error) {
      console.warn("[StorageService] Failed to cache chats:", error);
    }
  },

  /**
   * Retrieve cached messages for a specific chat
   */
  async getMessages(chatId) {
    try {
      const raw = await AsyncStorage.getItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn(`[StorageService] Failed to load messages for chat ${chatId}:`, error);
      return null;
    }
  },

  /**
   * Save messages for a specific chat
   */
  async saveMessages(chatId, messages) {
    try {
      if (!Array.isArray(messages)) return;
      await AsyncStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${chatId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.warn(`[StorageService] Failed to save messages for chat ${chatId}:`, error);
    }
  },

  /**
   * Load draft message typed by user for a specific chat
   */
  async getDraft(chatId) {
    try {
      return (await AsyncStorage.getItem(`${STORAGE_KEYS.DRAFT_PREFIX}${chatId}`)) || "";
    } catch (error) {
      console.warn(`[StorageService] Failed to load draft for chat ${chatId}:`, error);
      return "";
    }
  },

  /**
   * Persist draft text as the user types
   */
  async saveDraft(chatId, text) {
    try {
      await AsyncStorage.setItem(`${STORAGE_KEYS.DRAFT_PREFIX}${chatId}`, text);
    } catch (error) {
      console.warn(`[StorageService] Failed to save draft for chat ${chatId}:`, error);
    }
  },

  /**
   * Clear draft after message has been sent
   */
  async clearDraft(chatId) {
    try {
      await AsyncStorage.removeItem(`${STORAGE_KEYS.DRAFT_PREFIX}${chatId}`);
    } catch (error) {
      console.warn(`[StorageService] Failed to clear draft for chat ${chatId}:`, error);
    }
  },

  /**
   * Update unread count for a chat locally in cached list
   */
  async markChatReadLocally(chatId) {
    try {
      const chats = await this.getCachedChats();
      if (!chats) return;
      const updated = chats.map((c) =>
        Number(c.id) === Number(chatId) ? { ...c, unreadCount: 0 } : c
      );
      await this.saveCachedChats(updated);
    } catch (error) {
      console.warn(`[StorageService] Failed to mark chat ${chatId} as read locally:`, error);
    }
  },

  /**
   * Save last active chat ID for app state restoration
   */
  async setLastActiveChat(chatId) {
    try {
      if (chatId) {
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_CHAT_ID, String(chatId));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEYS.LAST_CHAT_ID);
      }
    } catch (error) {
      console.warn("[StorageService] Failed to set last active chat:", error);
    }
  },

  /**
   * Get last active chat ID
   */
  async getLastActiveChat() {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.LAST_CHAT_ID);
    } catch (error) {
      console.warn("[StorageService] Failed to get last active chat:", error);
      return null;
    }
  },
};
