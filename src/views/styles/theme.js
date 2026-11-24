/**
 * Design system tokens and theme constants
 * Part of the MVC View styling layer.
 */
export const theme = {
  colors: {
    primary: "#1f7aec",
    primaryLight: "#a9c8f3",
    primaryDark: "#1558b0",

    background: "#f6f8f9",
    surface: "#ffffff",
    surfacePressed: "#eef2f4",

    textPrimary: "#13212b",
    textSecondary: "#6d7d87",
    textMuted: "#9aa7ae",
    textWhite: "#ffffff",

    border: "#e3e8eb",
    divider: "#eeeeee",

    bubbleMine: "#1f7aec",
    bubbleTheirs: "#e7ecef",

    badge: "#1f7aec",
    badgeText: "#ffffff",
    badgeGreen: "#16a34a",
  },

  typography: {
    title: {
      fontSize: 18,
      fontWeight: "700",
      color: "#13212b",
    },
    heading: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#111827",
    },
    name: {
      fontSize: 16,
      fontWeight: "700",
      color: "#13212b",
    },
    messageText: {
      fontSize: 16,
      lineHeight: 22,
    },
    lastMessage: {
      fontSize: 14,
      color: "#6d7d87",
    },
    timestamp: {
      fontSize: 11,
      color: "#6d7d87",
    },
    badge: {
      fontSize: 12,
      fontWeight: "700",
      color: "#ffffff",
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  borderRadius: {
    sm: 8,
    md: 14,
    lg: 16,
    full: 999,
  },
};
