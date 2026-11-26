/**
 * useChatListController - Controller for the Chat List screen
 * Part of the MVC Controller layer.
 *
 * Mediates between Model (ApiService, StorageService) and View (ChatListScreen).
 * Includes search query and contact filtering.
 */
import { useState, useEffect, useCallback, useMemo } from "react";
import { ApiService } from "../models/ApiService";
import { StorageService } from "../models/StorageService";

export function useChatListController(navigation) {
  const [chats, setChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch chats from server or fallback to local disk storage
   */
  const loadChats = useCallback(async (isPullRefresh = false) => {
    if (isPullRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const { data } = await ApiService.fetchChats();
      setChats(data || []);
    } catch (err) {
      console.warn("[ChatListController] Failed to load chats:", err);
      setError("Unable to connect to server. Displaying local chats.");
      const cached = await StorageService.getCachedChats();
      if (cached) setChats(cached);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Load chats on initial mount and re-load whenever screen regains focus
   */
  useEffect(() => {
    loadChats();

    const unsubscribe = navigation?.addListener?.("focus", () => {
      loadChats();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigation, loadChats]);

  /**
   * Filter chats according to the search query
   */
  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  }, [chats, searchQuery]);

  /**
   * User pressed a chat item - update unread count and navigate
   */
  const handleChatPress = useCallback(
    async (chat) => {
      if (!chat) return;

      // Optimistically clear unread count in local state
      setChats((prev) =>
        prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
      );

      // Persist read status and update server
      await ApiService.markAsRead(chat.id);
      await StorageService.setLastActiveChat(chat.id);

      // Navigate to individual chat screen
      navigation?.navigate?.("Individual Chat", {
        chatId: chat.id,
        name: chat.name,
        avatar: chat.avatar,
      });
    },
    [navigation]
  );

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    chats: filteredChats,
    totalChatsCount: chats.length,
    searchQuery,
    setSearchQuery,
    clearSearch,
    loading,
    refreshing,
    error,
    onRefresh: () => loadChats(true),
    handleChatPress,
  };
}
