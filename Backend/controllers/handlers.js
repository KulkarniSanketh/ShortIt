const nanoid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ err: "url is required" });
  const shortId = nanoid(8);
  await URL.create({
    ShortId: shortId,
    redirectUrl: req.body.url,
    visitedHistory: [],
  });
  const url=`http://localhost:8000/${shortId}`

  return res.json({ shortUrl: url });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ ShortId: shortId });
  return res
    .status(200)
    .json({ Visitcount: result.VisitList.length, Analytics: result });
}

async function handleUrlRedirect(req, res) {
  const ShortId = req.params.shortId;
  const result = await URL.findOneAndUpdate(
    { ShortId },
    { $push: { visitedHistory: { timestamp: Date.now() } } }
  );
  res.redirect(result.redirectUrl);
}

module.exports = {
  handleGenerateNewUrl,
  handleGetAnalytics,
  handleUrlRedirect
};
