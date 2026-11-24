/**
 * ChatModel - Data entity definitions and normalizers for Chats and Messages
 * Part of the MVC Model layer.
 */

export function extractInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function formatTime(date = new Date()) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function createMessage({
  id = Date.now(),
  sender = "me",
  text = "",
  time = formatTime(),
}) {
  return {
    id: Number(id),
    sender,
    text: String(text).trim(),
    time: time || formatTime(),
  };
}

export function normalizeChat(rawChat = {}) {
  const messages = Array.isArray(rawChat.messages)
    ? rawChat.messages.map((m) => createMessage(m))
    : [];

  const lastMessageObj = messages.length > 0 ? messages[messages.length - 1] : null;

  return {
    id: Number(rawChat.id),
    name: rawChat.name || "Unknown",
    avatar: rawChat.avatar || extractInitials(rawChat.name),
    unreadCount: Number(rawChat.unreadCount || rawChat.unread_count || 0),
    lastMessage: rawChat.lastMessage || lastMessageObj?.text || "",
    lastTime: rawChat.lastTime || lastMessageObj?.time || "",
    lastSender: rawChat.lastSender || lastMessageObj?.sender || "",
    messages,
  };
}
