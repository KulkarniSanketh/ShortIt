/**
 * Pulls a short id from either a raw alias or a full ShortIt URL.
 */
export function extractShortId(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    return parsed.pathname.replace(/^\//, "").split("/")[0];
  } catch {
    return trimmed.replace(/^\/+/, "");
  }
}

export function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
