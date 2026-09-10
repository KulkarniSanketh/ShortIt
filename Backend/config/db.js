const mongoose = require("mongoose");

/**
 * Connects to MongoDB and fails fast if the database is unreachable.
 * @param {string} mongoUrl
 */
async function connectToDatabase(mongoUrl) {
  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 8000,
  });

  return mongoose.connection;
}

async function closeDatabase() {
  await mongoose.disconnect();
}

module.exports = {
  connectToDatabase,
  closeDatabase,
};
