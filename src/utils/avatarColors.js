/**
 * Avatar Color Generator
 * Assigns a consistent, aesthetically pleasant color based on the contact's name.
 */

const PALETTE = [
  "#e0736a",
  "#5b8def",
  "#2bb3a3",
  "#b072d6",
  "#e3a33b",
  "#4fa36b",
  "#d65f8f",
  "#6a7f8c",
  "#3f9fc9",
  "#c9733f",
  "#8b5cf6",
  "#06b6d4",
];

export function getAvatarColor(name = "") {
  if (!name) return PALETTE[0];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % PALETTE.length;
  return PALETTE[index];
}
