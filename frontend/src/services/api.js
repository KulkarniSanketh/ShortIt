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
    throw new Error(payload.error || "Request failed");
  }

  return payload;
}

export function shortenUrl({ url, customAlias }) {
  return request("/api/urls", {
    method: "POST",
    body: JSON.stringify({ url, customAlias: customAlias || undefined }),
  });
}

export function fetchAnalytics(shortId) {
  return request(`/api/urls/${encodeURIComponent(shortId)}/analytics`);
}

export function fetchRecentUrls() {
  return request("/api/urls");
}

export function sendContact(body) {
  return request("/api/contact", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export { API_URL };
