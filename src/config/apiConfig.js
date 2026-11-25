/**
 * Global API and Server Configuration
 *
 * Provides dynamic server host resolution from AsyncStorage so users can
 * change the host in Settings without editing code or rebuilding.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DEFAULT_SERVER_HOST = "192.168.1.7:3001";
export const CUSTOM_HOST_KEY = "chat_app:custom_server_host";

export const STORAGE_KEYS = {
  CHATS: "chat_app:chats",
  MESSAGES_PREFIX: "chat_app:messages:",
  DRAFT_PREFIX: "chat_app:draft:",
  LAST_CHAT_ID: "chat_app:last_chat_id",
  CUSTOM_HOST: CUSTOM_HOST_KEY,
};

export async function getServerHost() {
  try {
    const custom = await AsyncStorage.getItem(CUSTOM_HOST_KEY);
    return custom?.trim() || DEFAULT_SERVER_HOST;
  } catch {
    return DEFAULT_SERVER_HOST;
  }
}

export async function getApiBaseUrl() {
  const host = await getServerHost();
  return `http://${host}`;
}

export async function getWsBaseUrl() {
  const host = await getServerHost();
  return `ws://${host}/ws`;
}
