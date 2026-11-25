/**
 * ApiService - REST client for communicating with the backend server
 * Part of the MVC Model layer.
 * 
 * Provides graceful fallback to local storage / bundled data when offline
 * and resolves server URL dynamically from settings.
 */
import { getApiBaseUrl } from "../config/apiConfig";
import { StorageService } from "./StorageService";
import { normalizeChat } from "./ChatModel";
import initialChats from "../data/chats.json";

export const ApiService = {
  /**
   * Fetch all chats with latest message summary
   */
  async fetchChats() {
    try {
      const baseUrl = await getApiBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${baseUrl}/chats`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const normalized = data.map((item) => normalizeChat(item));

      // Update local storage cache for offline capability
      await StorageService.saveCachedChats(normalized);
      return { data: normalized, fromCache: false };
    } catch (error) {
      console.warn("[ApiService] Server unavailable, falling back to local cache:", error.message);

      // Check local AsyncStorage cache
      const cached = await StorageService.getCachedChats();
      if (cached && cached.length > 0) {
        return { data: cached, fromCache: true };
      }

      // First run offline fallback: bundled chats.json
      const fallback = initialChats.map((c) => normalizeChat(c));
      await StorageService.saveCachedChats(fallback);
      return { data: fallback, fromCache: true };
    }
  },

  /**
   * Fetch a single chat with full message history
   */
  async fetchChatById(chatId) {
    try {
      const baseUrl = await getApiBaseUrl();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(`${baseUrl}/chats/${chatId}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const normalized = normalizeChat(data);

      // Cache messages for this chat
      if (normalized.messages) {
        await StorageService.saveMessages(chatId, normalized.messages);
      }

      return { data: normalized, fromCache: false };
    } catch (error) {
      console.warn(`[ApiService] Failed to fetch chat ${chatId} from server:`, error.message);

      // Try local storage cache for messages
      const cachedMessages = await StorageService.getMessages(chatId);
      if (cachedMessages) {
        return {
          data: {
            id: Number(chatId),
            messages: cachedMessages,
          },
          fromCache: true,
        };
      }

      // Fallback to initial chats.json
      const found = initialChats.find((c) => Number(c.id) === Number(chatId));
      const normalized = found ? normalizeChat(found) : { id: Number(chatId), messages: [] };
      return { data: normalized, fromCache: true };
    }
  },

  /**
   * Mark a chat as read (sets unreadCount to 0)
   */
  async markAsRead(chatId) {
    // 1. Update local storage immediately for fast UI feedback
    await StorageService.markChatReadLocally(chatId);

    // 2. Notify the server
    try {
      const baseUrl = await getApiBaseUrl();
      await fetch(`${baseUrl}/chats/${chatId}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.warn(`[ApiService] Failed to mark chat ${chatId} as read on server:`, error.message);
    }
  },
};
