/**
 * Global API and Server Configuration
 *
 * For local testing:
 * - On physical phone with Expo Go: Set SERVER_HOST to your computer's LAN IP, e.g. "192.168.1.7:3001"
 * - On iOS Simulator / Android Emulator / Web: Use localhost or your LAN IP
 */
export const SERVER_HOST = "192.168.1.7:3001";

export const API_BASE_URL = `http://${SERVER_HOST}`;
export const WS_BASE_URL = `ws://${SERVER_HOST}/ws`;

export const STORAGE_KEYS = {
  CHATS: "chat_app:chats",
  MESSAGES_PREFIX: "chat_app:messages:",
  DRAFT_PREFIX: "chat_app:draft:",
  LAST_CHAT_ID: "chat_app:last_chat_id",
};
