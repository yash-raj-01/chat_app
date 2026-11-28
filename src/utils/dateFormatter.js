/**
 * Date and Timestamp Formatting Helpers
 * Formats timestamps cleanly for chat list rows and message bubbles.
 */

export function formatRelativeTime(rawTime = "") {
  if (!rawTime) return "";

  // If already formatted like "10:42", "Yesterday", "Mon", return as-is
  if (
    rawTime.includes(":") ||
    rawTime.toLowerCase().includes("yesterday") ||
    rawTime.length <= 5
  ) {
    return rawTime;
  }

  const date = new Date(rawTime);
  if (isNaN(date.getTime())) {
    return rawTime;
  }

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
