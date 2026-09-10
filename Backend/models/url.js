const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      default: Date.now,
    },
    userAgent: {
      type: String,
      default: "",
      maxlength: 300,
    },
  },
  { _id: false }
);

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
      minlength: 3,
      maxlength: 32,
    },
    redirectUrl: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },
    visitCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    visitHistory: {
      type: [visitSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

urlSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Url", urlSchema);
