/**
 * WebSocketService - WebSocket client managing real-time chat & typing events
 * Part of the MVC Model layer.
 */
import { getWsBaseUrl } from "../config/apiConfig";

export class WebSocketService {
  constructor() {
    this.socket = null;
    this.chatId = null;
    this.handlers = {
      onMessage: null,
      onTyping: null,
      onOpen: null,
      onError: null,
      onClose: null,
    };
    this.lastTypingTimestamp = 0;
  }

  /**
   * Establish WebSocket connection
   */
  async connect({ chatId, onMessage, onTyping, onOpen, onError, onClose }) {
    this.chatId = Number(chatId);
    this.handlers = { onMessage, onTyping, onOpen, onError, onClose };

    try {
      const wsUrl = await getWsBaseUrl();
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = (event) => {
        if (this.handlers.onOpen) this.handlers.onOpen(event);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.chatId && Number(data.chatId) !== this.chatId) return;

          if (data.type === "message" && this.handlers.onMessage) {
            this.handlers.onMessage(data.message);
          } else if (data.type === "typing" && this.handlers.onTyping) {
            this.handlers.onTyping(data.from);
          }
        } catch (err) {
          console.warn("[WebSocketService] Error parsing message:", err);
        }
      };

      this.socket.onerror = (err) => {
        if (this.handlers.onError) this.handlers.onError(err);
      };

      this.socket.onclose = (event) => {
        if (this.handlers.onClose) this.handlers.onClose(event);
      };
    } catch (error) {
      console.warn("[WebSocketService] Failed to connect WebSocket:", error);
    }
  }

  /**
   * Broadcast typing status to server (throttled to once every 2 seconds)
   */
  notifyTyping() {
    const now = Date.now();
    if (now - this.lastTypingTimestamp < 2000) return;
    if (this.isOpen()) {
      this.socket.send(
        JSON.stringify({
          type: "typing",
          chatId: this.chatId,
        })
      );
      this.lastTypingTimestamp = now;
    }
  }

  /**
   * Send a chat message through WebSocket
   */
  sendMessage(text) {
    const trimmed = String(text ?? "").trim();
    if (!trimmed || !this.isOpen()) return false;

    this.socket.send(
      JSON.stringify({
        type: "send",
        chatId: this.chatId,
        text: trimmed,
      })
    );
    return true;
  }

  /**
   * Check if connection is currently open
   */
  isOpen() {
    return this.socket && this.socket.readyState === WebSocket.OPEN;
  }

  /**
   * Close connection and clean up handlers
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.handlers = {};
  }
}
