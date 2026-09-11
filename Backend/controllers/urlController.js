const Url = require("../models/url");
const env = require("../config/env");
const {
  normalizeHttpUrl,
  createShortId,
  isValidCustomAlias,
  isReservedAlias,
  generateAliasCandidates,
  pickAvailableAliasSuggestions,
} = require("../utils/url");

const MAX_STORED_VISITS = 50;
const MAX_CREATE_ATTEMPTS = 5;

function toPublicUrl(shortId) {
  return `${env.baseUrl}/${shortId}`;
}

function serializeUrl(doc) {
  return {
    id: doc._id,
    shortId: doc.shortId,
    shortUrl: toPublicUrl(doc.shortId),
    redirectUrl: doc.redirectUrl,
    visitCount: doc.visitCount ?? doc.visitHistory?.length ?? 0,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}


async function createUniqueRecord(redirectUrl, preferredId) {
  let lastError;

  for (let attempt = 0; attempt < MAX_CREATE_ATTEMPTS; attempt += 1) {
    const shortId = preferredId || createShortId();

    try {
      return await Url.create({
        shortId,
        redirectUrl,
        visitCount: 0,
        visitHistory: [],
      });
    } catch (error) {
      lastError = error;
      if (error.code === 11000) {
        if (preferredId) {
          error.statusCode = 409;
          error.message = "That custom alias is already in use";
          throw error;
        }
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

async function createShortUrl(req, res) {
  const url = typeof req.body.url === "string" ? req.body.url.trim() : "";
  const customAlias =
    typeof req.body.customAlias === "string" ? req.body.customAlias.trim() : "";

  if (!url) {
    return res.status(400).json({ success: false, error: "url is required" });
  }

  const redirectUrl = normalizeHttpUrl(url);
  let preferredId;

  if (customAlias) {
    if (isReservedAlias(customAlias)) {
      return res.status(400).json({
        success: false,
        error: "That alias is reserved. Please choose another.",
      });
    }

    if (!isValidCustomAlias(customAlias)) {
      return res.status(400).json({
        success: false,
        error:
          "Custom alias must be 3-32 characters and use letters, numbers, dashes, or underscores",
      });
    }

    preferredId = customAlias;

    const conflict = await Url.findOne({ shortId: preferredId }).lean();
    if (conflict) {
      const candidates = generateAliasCandidates(preferredId);
      const takenAliases = await Url.find({ shortId: { $in: candidates } }).distinct("shortId");
      const available = candidates.filter((candidate) => {
        const normalized = String(candidate).trim();
        return normalized && !takenAliases.includes(normalized) && isValidCustomAlias(normalized);
      });
      const suggestions = available.slice(0, 4);

      return res.status(409).json({
        success: false,
        error: `The alias "${preferredId}" is already taken. Try one of these instead:`,
        suggestions,
        totalAvailable: available.length,
      });
    }
  }

  const existingRecord = await Url.findOne({ redirectUrl });
  if (existingRecord) {
    return res.json({
      success: true,
      data: serializeUrl(existingRecord),
    });
  }

  const record = await createUniqueRecord(redirectUrl, preferredId);

  return res.status(201).json({
    success: true,
    data: serializeUrl(record),
  });
}

async function getAnalytics(req, res) {
  const { shortId } = req.params;

  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(shortId)) {
    return res.status(400).json({ success: false, error: "Invalid short id" });
  }

  const record = await Url.findOne({ shortId }).lean();

  if (!record) {
    return res.status(404).json({ success: false, error: "Short URL not found" });
  }

  return res.json({
    success: true,
    data: {
      ...serializeUrl(record),
      visits: (record.visitHistory || []).slice(-MAX_STORED_VISITS).reverse(),
    },
  });
}

async function getAliasSuggestions(req, res) {
  const alias = typeof req.query.alias === "string" ? req.query.alias.trim() : "";
  const offset = Number.parseInt(req.query.offset || "0", 10);

  if (!alias) {
    return res.status(400).json({ success: false, error: "Alias is required" });
  }

  if (!isValidCustomAlias(alias)) {
    return res.status(400).json({
      success: false,
      error: "Custom alias must be 3-32 characters and use letters, numbers, dashes, or underscores",
    });
  }

  const candidates = generateAliasCandidates(alias);
  const takenAliases = await Url.find({ shortId: { $in: candidates } }).distinct("shortId");
  const available = candidates.filter((candidate) => {
    const normalized = String(candidate).trim();
    return normalized && !takenAliases.includes(normalized) && isValidCustomAlias(normalized);
  });
  const safeOffset = Number.isNaN(offset) ? 0 : Math.max(0, offset);
  const suggestions = available.slice(safeOffset, safeOffset + 4);

  return res.json({
    success: true,
    data: {
      alias,
      suggestions,
      offset: safeOffset,
      totalAvailable: available.length,
    },
  });
}

async function redirectToOriginal(req, res) {
  const { shortId } = req.params;

  if (!/^[a-zA-Z0-9_-]{3,32}$/.test(shortId)) {
    return res.status(404).json({ success: false, error: "Short URL not found" });
  }

  const userAgent = String(req.get("user-agent") || "").slice(0, 300);

  const record = await Url.findOneAndUpdate(
    { shortId },
    {
      $inc: { visitCount: 1 },
      $push: {
        visitHistory: {
          $each: [
            {
              timestamp: new Date(),
              userAgent,
            },
          ],
          $slice: -MAX_STORED_VISITS,
        },
      },
    },
    { new: true }
  );

  if (!record) {
    return res.status(404).json({ success: false, error: "Short URL not found" });
  }

  return res.redirect(302, record.redirectUrl);
}

module.exports = {
  createShortUrl,
  getAnalytics,
  getAliasSuggestions,
  redirectToOriginal,
};
