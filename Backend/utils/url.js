const { nanoid } = require("nanoid");

const MAX_URL_LENGTH = 2048;
const RESERVED_ALIASES = new Set([
  "api",
  "urls",
  "contact",
  "health",
  "admin",
  "www",
  "static",
  "assets",
  "favicon",
  "robots",
  "sitemap",
]);

function httpError(message, statusCode = 400) {
  return Object.assign(new Error(message), { statusCode });
}

function isIpv4(hostname) {
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
}

function isPrivateOrLocalHost(hostname) {
  const host = hostname.replace(/\.$/, "").toLowerCase();

  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    host === "::" ||
    host === "::1" ||
    host === "[::1]"
  ) {
    return true;
  }

  if (isIpv4(host)) {
    const parts = host.split(".").map(Number);
    if (parts.some((part) => Number.isNaN(part) || part > 255)) {
      return true;
    }

    const [a, b] = parts;
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a === 255 ||
      (a === 169 && b === 254) ||
      (a === 192 && b === 168) ||
      (a === 172 && b >= 16 && b <= 31)
    );
  }

  if (host.includes(":")) {
    const ipv6 = host.replace(/^\[|\]$/g, "");
    return (
      ipv6 === "::1" ||
      ipv6.startsWith("fc") ||
      ipv6.startsWith("fd") ||
      ipv6.startsWith("fe80")
    );
  }

  return false;
}

/**
 * Ensures the value is an absolute http(s) URL and is not pointing at a local/private host.
 * @param {string} value
 * @returns {string} normalized href
 */
function normalizeHttpUrl(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw httpError("Please enter a valid URL including http:// or https://");
  }

  const trimmed = value.trim();
  if (trimmed.length > MAX_URL_LENGTH) {
    throw httpError("URL must be 2048 characters or fewer");
  }

  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw httpError("Please enter a valid URL including http:// or https://");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw httpError("Only http and https URLs are allowed");
  }

  if (parsed.username || parsed.password) {
    throw httpError("URLs with embedded credentials are not allowed");
  }

  if (isPrivateOrLocalHost(parsed.hostname)) {
    throw httpError("Local and private network URLs cannot be shortened");
  }

  return parsed.href;
}

function createShortId() {
  return nanoid(8);
}

function isReservedAlias(alias) {
  return RESERVED_ALIASES.has(String(alias).toLowerCase());
}

function isValidCustomAlias(alias) {
  return typeof alias === "string" && /^[a-zA-Z0-9_-]{3,32}$/.test(alias) && !isReservedAlias(alias);
}

function generateAliasCandidates(alias) {
  const baseAlias = String(alias || "").trim();
  if (!baseAlias) {
    return [];
  }

  return [
    `${baseAlias}-go`,
    `${baseAlias}-link`,
    `${baseAlias}-now`,
    `${baseAlias}-web`,
    `${baseAlias}-hub`,
    `${baseAlias}-pro`,
    `${baseAlias}-x`,
    `my-${baseAlias}`,
    `go-${baseAlias}`,
    `use-${baseAlias}`,
    `get-${baseAlias}`,
    `try-${baseAlias}`,
    `the-${baseAlias}`,
    `${baseAlias}-hq`,
    `${baseAlias}-io`,
  ];
}

function pickAvailableAliasSuggestions(alias, takenAliases = [], offset = 0) {
  const taken = new Set(
    (Array.isArray(takenAliases) ? takenAliases : [...takenAliases])
      .map((value) => String(value).trim())
      .filter(Boolean)
  );

  const available = generateAliasCandidates(alias).filter((candidate) => {
    const normalized = String(candidate).trim();
    return normalized && !taken.has(normalized) && isValidCustomAlias(normalized);
  });

  return available.slice(offset, offset + 4);
}

module.exports = {
  MAX_URL_LENGTH,
  normalizeHttpUrl,
  createShortId,
  isValidCustomAlias,
  isReservedAlias,
  isPrivateOrLocalHost,
  generateAliasCandidates,
  pickAvailableAliasSuggestions,
};
