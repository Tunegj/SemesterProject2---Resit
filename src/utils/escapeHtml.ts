/**
 * Escapes HTML special characters in a string to prevent XSS attacks.
 * @param value - The string to escape.
 * @returns The escaped string.
 */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
