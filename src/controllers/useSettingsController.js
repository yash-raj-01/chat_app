/**
 * useSettingsController - Controller for the Settings screen
 * Part of the MVC Controller layer.
 */
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_HOST, STORAGE_KEYS } from "../config/apiConfig";
import { StorageService } from "../models/StorageService";

export function useSettingsController() {
  const [serverHost, setServerHost] = useState(SERVER_HOST);
  const [savedStatus, setSavedStatus] = useState("");
  const [storageCount, setStorageCount] = useState(0);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      setStorageCount(keys.length);

      const customHost = await AsyncStorage.getItem("chat_app:custom_server_host");
      if (customHost) {
        setServerHost(customHost);
      }
    } catch (err) {
      console.warn("[SettingsController] Failed to load settings:", err);
    }
  };

  const handleSaveHost = async () => {
    try {
      const trimmed = serverHost.trim();
      if (!trimmed) return;
      await AsyncStorage.setItem("chat_app:custom_server_host", trimmed);
      setSavedStatus("Server configuration saved!");
      setTimeout(() => setSavedStatus(""), 3000);
    } catch (err) {
      setSavedStatus("Failed to save configuration");
    }
  };

  const handleClearCache = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CHATS);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_CHAT_ID);
      const keys = await AsyncStorage.getAllKeys();
      setStorageCount(keys.length);
      setSavedStatus("Cache cleared successfully");
      setTimeout(() => setSavedStatus(""), 3000);
    } catch (err) {
      setSavedStatus("Failed to clear cache");
    }
  };

  return {
    serverHost,
    setServerHost,
    savedStatus,
    storageCount,
    handleSaveHost,
    handleClearCache,
  };
}
