const Url = require("../models/url");
const env = require("../config/env");
const {
  normalizeHttpUrl,
  createShortId,
  isValidCustomAlias,
  isReservedAlias,
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

async function listRecentUrls(req, res) {
  const records = await Url.find()
    .sort({ createdAt: -1 })
    .limit(12)
    .select("shortId redirectUrl visitCount createdAt updatedAt")
    .lean();

  return res.json({
    success: true,
    data: records.map(serializeUrl),
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
  listRecentUrls,
  redirectToOriginal,
};
