/**
 * Global API and Server Configuration
 *
 * Automatically selects the best default host:
 * - Android Emulator: 10.0.2.2:3001
 * - iOS Simulator / macOS / Web: localhost:3001
 * - Physical devices: LAN IP (e.g. 10.254.206.28:3001) or custom host from Settings
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export const LAN_SERVER_HOST = "10.254.206.28:3001";
export const LOCAL_SERVER_HOST =
  Platform.OS === "android" ? "10.0.2.2:3001" : "localhost:3001";

export const DEFAULT_SERVER_HOST = LOCAL_SERVER_HOST;
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
    if (custom && custom.trim()) {
      return custom.trim();
    }
    return DEFAULT_SERVER_HOST;
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
