const API_URL = (import.meta.env.VITE_API_URL || "https://shortit-lluo.onrender.com").replace(/\/$/, "");

async function request(path, options = {}) {
  const { headers, ...rest } = options;
  const hasJsonBody = typeof rest.body === "string";

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: {
        ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
      },
      ...rest,
    });
  } catch {
    throw new Error("Unable to reach the ShortIt API. Check that the server is running.");
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(payload.error || "Request failed");
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function shortenUrl({ url, customAlias }) {
  return request("/api/urls", {
    method: "POST",
    body: JSON.stringify({ url, customAlias: customAlias || undefined }),
  });
}

export function fetchAliasSuggestions(alias, offset = 0) {
  return request(`/api/urls/suggestions?alias=${encodeURIComponent(alias)}&offset=${offset}`);
}

export function fetchAnalytics(shortId) {
  return request(`/api/urls/${encodeURIComponent(shortId)}/analytics`);
}

export function sendContact(body) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export { API_URL };
