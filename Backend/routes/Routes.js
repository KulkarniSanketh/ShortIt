const express = require("express")
const {handleGenerateNewUrl,handleGetAnalytics,handleUrlRedirect} = require("../controllers/handlers")

const router = express.Router();

router.post("/",handleGenerateNewUrl)
router.get("/analytics/:shortId",handleGetAnalytics)
router.get("/:shortId",handleUrlRedirect)

module.exports= router;

