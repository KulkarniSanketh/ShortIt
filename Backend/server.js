const env = require("./config/env");
const { connectToDatabase, closeDatabase } = require("./config/db");
const app = require("./app");

let server;

async function start() {
  try {
    await connectToDatabase(env.mongoUrl);
    console.log("MongoDB connected");

    server = app.listen(env.port, "0.0.0.0", () => {
      console.log(`ShortIt API listening on ${env.baseUrl}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received, shutting down`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
    await closeDatabase();
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exit(1);
  }
}

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});
process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

start();
