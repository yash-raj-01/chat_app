/**
 * useIndividualChatController - Controller for the Individual Chat screen
 * Part of the MVC Controller layer.
 *
 * Mediates between Model (ApiService, StorageService, WebSocketService)
 * and View (IndividualChatScreen).
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { ApiService } from "../models/ApiService";
import { StorageService } from "../models/StorageService";
import { WebSocketService } from "../models/WebSocketService";
import { createMessage } from "../models/ChatModel";

export function useIndividualChatController(chatId, initialName) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /**
   * 1. Load persisted draft on startup
   */
  useEffect(() => {
    let mounted = true;
    StorageService.getDraft(chatId).then((savedDraft) => {
      if (mounted && savedDraft) {
        setDraft(savedDraft);
      }
    });

    return () => {
      mounted = false;
    };
  }, [chatId]);

  /**
   * 2. Load message history and mark chat as read
   */
  useEffect(() => {
    let mounted = true;

    async function loadChatData() {
      // Load messages from API (or local storage fallback)
      const { data } = await ApiService.fetchChatById(chatId);
      if (mounted && data?.messages) {
        setMessages(data.messages);
      }

      // Mark chat as read
      await ApiService.markAsRead(chatId);
    }

    loadChatData();

    return () => {
      mounted = false;
    };
  }, [chatId]);

  /**
   * 3. Establish WebSocket connection for real-time messages & typing
   */
  useEffect(() => {
    const ws = new WebSocketService();
    socketRef.current = ws;

    ws.connect({
      chatId,
      onOpen: () => setIsConnected(true),
      onClose: () => setIsConnected(false),
      onError: (err) => console.warn("[IndividualChatController] WS Error:", err),
      onMessage: (incomingMessage) => {
        setTypingUser(null);
        setMessages((prev) => {
          // Avoid duplicate messages if already present
          if (prev.some((m) => m.id === incomingMessage.id)) return prev;
          const updated = [...prev, incomingMessage];
          StorageService.saveMessages(chatId, updated);
          return updated;
        });
      },
      onTyping: (from) => {
        if (from !== "me") {
          setTypingUser(from);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 3000);
        }
      },
    });

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      ws.disconnect();
    };
  }, [chatId]);

  /**
   * 4. Handle draft input change - auto-saves draft to disk on every keystroke
   */
  const handleDraftChange = useCallback(
    (text) => {
      setDraft(text);
      StorageService.saveDraft(chatId, text);
      socketRef.current?.notifyTyping();
    },
    [chatId]
  );

  /**
   * 5. Send message - broadcasts over WebSocket and persists to disk
   */
  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    // Send over WebSocket if available
    const sentOverWs = socketRef.current?.sendMessage(trimmed);

    // Optimistic local update
    const newMsg = createMessage({
      id: Date.now(),
      sender: "me",
      text: trimmed,
    });

    setMessages((prev) => {
      const updated = [...prev, newMsg];
      StorageService.saveMessages(chatId, updated);
      return updated;
    });

    // Clear draft in state and local storage
    setDraft("");
    await StorageService.clearDraft(chatId);
  }, [draft, chatId]);

  return {
    messages,
    draft,
    typingUser,
    isConnected,
    handleDraftChange,
    sendMessage,
  };
}
