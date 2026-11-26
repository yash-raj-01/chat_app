/**
 * useSessionRestoreController - Restores last viewed conversation on app launch
 * Part of the MVC Controller layer.
 */
import { useState, useEffect, useCallback } from "react";
import { StorageService } from "../models/StorageService";

export function useSessionRestoreController(navigation, chats) {
  const [lastChat, setLastChat] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const [lastChatId, isAutoResume] = await Promise.all([
        StorageService.getLastActiveChat(),
        StorageService.getAutoResumeEnabled(),
      ]);

      if (!mounted || !lastChatId || !chats || chats.length === 0) return;

      const found = chats.find((c) => String(c.id) === String(lastChatId));
      if (found) {
        setLastChat(found);
        if (isAutoResume && navigation) {
          navigation.navigate("Individual Chat", {
            chatId: found.id,
            name: found.name,
            avatar: found.avatar,
          });
        }
      }
    }

    if (chats.length > 0) {
      checkSession();
    }

    return () => {
      mounted = false;
    };
  }, [chats, navigation]);

  const resumeLastChat = useCallback(() => {
    if (lastChat && navigation) {
      navigation.navigate("Individual Chat", {
        chatId: lastChat.id,
        name: lastChat.name,
        avatar: lastChat.avatar,
      });
    }
  }, [lastChat, navigation]);

  const dismissResume = useCallback(() => {
    setLastChat(null);
  }, []);

  return {
    lastChat,
    resumeLastChat,
    dismissResume,
  };
}
