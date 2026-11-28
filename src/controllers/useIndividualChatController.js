/**
 * useIndividualChatController - Controller for the Individual Chat screen
 * Part of the MVC Controller layer.
 *
 * Mediates between Model (ApiService, StorageService, WebSocketService, OutboxService)
 * and View (IndividualChatScreen).
 * Includes offline message queueing and auto-flush on reconnect.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { ApiService } from "../models/ApiService";
import { StorageService } from "../models/StorageService";
import { OutboxService } from "../models/OutboxService";
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
  const loadChatData = useCallback(async () => {
    // Load messages from API (or local storage fallback)
    const { data } = await ApiService.fetchChatById(chatId);
    let allMessages = data?.messages || [];

    // Append any pending messages from outbox that haven't been confirmed
    const pending = await OutboxService.getPendingMessages(chatId);
    if (pending.length > 0) {
      const existingIds = new Set(allMessages.map((m) => m.id));
      const newPending = pending.filter((m) => !existingIds.has(m.id));
      allMessages = [...allMessages, ...newPending];
    }

    setMessages(allMessages);

    // Mark chat as read
    await ApiService.markAsRead(chatId);
  }, [chatId]);

  useEffect(() => {
    loadChatData();
  }, [loadChatData]);

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
   * 3. Establish WebSocket connection for real-time messages & typing
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
          // Replace matching pending message or append
          const existingIndex = prev.findIndex(
            (m) => m.id === incomingMessage.id || (m.status === "pending" && m.text === incomingMessage.text)
          );

          let updated;
          if (existingIndex >= 0) {
            updated = [...prev];
            updated[existingIndex] = incomingMessage;
          } else {
            updated = [...prev, incomingMessage];
          }

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
  }, [chatId, flushOutbox]);

  useEffect(() => {
    connectSocket();

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      socketRef.current?.disconnect();
    };
  }, [connectSocket]);

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
   * 5. Send message - broadcasts over WebSocket or queues in outbox if offline
   */
  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;

    const isLive = socketRef.current?.isOpen();
    const newMsg = createMessage({
      id: Date.now(),
      sender: "me",
      text: trimmed,
    });

    if (isLive) {
      socketRef.current.sendMessage(trimmed);
      newMsg.status = "sent";
    } else {
      // Queue offline for automatic flush when reconnected
      newMsg.status = "pending";
      await OutboxService.queueMessage(chatId, newMsg);
    }

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
    reconnect: connectSocket,
    handleDraftChange,
    sendMessage,
  };
}
