/**
 * useIndividualChatController - Controller for the Individual Chat screen
 * Part of the MVC Controller layer.
 *
 * Mediates between Model (ApiService, StorageService, WebSocketService, OutboxService)
 * and View (IndividualChatScreen).
 * Includes instant cache loading, offline message queueing, and multi-transport delivery.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { ApiService } from "../models/ApiService";
import { StorageService } from "../models/StorageService";
import { OutboxService } from "../models/OutboxService";
import { WebSocketService } from "../models/WebSocketService";
import { createMessage, formatTime } from "../models/ChatModel";

export function useIndividualChatController(chatId, initialName) {
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  /**
   * 1. Initialize chat: instant cache load + draft restore + background sync
   */
  useEffect(() => {
    let mounted = true;

    async function initChat() {
      if (!chatId) return;

      // Load draft
      const savedDraft = await StorageService.getDraft(chatId);
      if (mounted && savedDraft) setDraft(savedDraft);

      // Load cached messages immediately (zero delay)
      const cached = await StorageService.getMessages(chatId);
      if (mounted && cached && cached.length > 0) {
        setMessages(cached);
      }

      // Check pending outbox messages
      const pending = await OutboxService.getPendingMessages(chatId);

      // Fetch fresh messages from server in background
      const { data } = await ApiService.fetchChatById(chatId);
      if (mounted) {
        const serverMessages = data?.messages || [];
        setMessages((prev) => {
          const map = new Map();
          for (const m of prev) map.set(m.id, m);
          for (const m of serverMessages) map.set(m.id, m);
          for (const m of pending) map.set(m.id, m);
          const merged = Array.from(map.values()).sort((a, b) => (a.id || 0) - (b.id || 0));
          StorageService.saveMessages(chatId, merged);
          return merged;
        });
      }

      // Mark chat as read
      await ApiService.markAsRead(chatId);
    }

    initChat();

    return () => {
      mounted = false;
    };
  }, [chatId]);

  /**
   * Flush pending outbox messages once connected to server
   */
  const flushOutbox = useCallback(async () => {
    if (!socketRef.current?.isOpen()) return;

    const pending = await OutboxService.getPendingMessages(chatId);
    if (pending.length === 0) return;

    for (const msg of pending) {
      const sent = socketRef.current.sendMessage(msg.text);
      if (sent) {
        await OutboxService.removeMessage(chatId, msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, status: "sent" } : m))
        );
      }
    }
  }, [chatId]);

  /**
   * 2. Establish WebSocket connection for real-time messages & typing
   */
  const connectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const ws = new WebSocketService();
    socketRef.current = ws;

    ws.connect({
      chatId,
      onOpen: () => {
        setIsConnected(true);
        flushOutbox();
      },
      onClose: () => setIsConnected(false),
      onError: (err) => {
        console.warn("[IndividualChatController] WS Error:", err);
        setIsConnected(false);
      },
      onMessage: (incomingMessage) => {
        setTypingUser(null);
        setMessages((prev) => {
          // Replace optimistic message matching by ID or text
          const existingIndex = prev.findIndex(
            (m) =>
              m.id === incomingMessage.id ||
              (m.sender === "me" && m.text === incomingMessage.text)
          );

          let updated;
          if (existingIndex >= 0) {
            updated = [...prev];
            updated[existingIndex] = incomingMessage;
          } else {
            updated = [...prev, incomingMessage];
          }

          StorageService.saveMessages(chatId, updated);
          StorageService.updateChatLastMessage(
            chatId,
            incomingMessage.text,
            incomingMessage.time
          );
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
  }, [chatId, flushOutbox]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current?.disconnect();
    };
  }, [connectSocket]);

  /**
   * 3. Handle draft input change - auto-saves draft to disk on every keystroke
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
   * 4. Send message - optimistic update + WebSocket + REST fallback + persistent cache
   */
  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const timeStr = formatTime();
    const newMsg = createMessage({
      id: Date.now(),
      sender: "me",
      text: trimmed,
      time: timeStr,
    });

    const isLive = socketRef.current?.isOpen();

    if (isLive) {
      socketRef.current.sendMessage(trimmed);
      newMsg.status = "sent";
    } else {
      newMsg.status = "pending";
      await OutboxService.queueMessage(chatId, newMsg);
      // Try REST endpoint in background
      ApiService.sendMessage(chatId, trimmed).then((res) => {
        if (res?.ok) {
          OutboxService.removeMessage(chatId, newMsg.id);
        }
      });
    }

    // Immediately update messages and persistent storage
    setMessages((prev) => {
      const updated = [...prev, newMsg];
      StorageService.saveMessages(chatId, updated);
      return updated;
    });

    // Update last message in chat list cache
    StorageService.updateChatLastMessage(chatId, trimmed, timeStr);

    // Clear draft in state and local storage
    setDraft("");
    await StorageService.clearDraft(chatId);
  }, [draft, chatId]);

  return {
    messages,
    draft,
    typingUser,
    isConnected,
    reconnect: connectSocket,
    handleDraftChange,
    sendMessage,
  };
}
