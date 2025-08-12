const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema(
  {
    ShortId: {
      type: String,
      unique: true,
      required: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    VisitList: [
      {
        timestamp: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true
  }
);

const URL =mongoose.model("url", UrlSchema);

module.exports = URL;
