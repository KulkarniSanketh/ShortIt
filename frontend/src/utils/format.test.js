import { extractShortId, formatDate } from "./format.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(extractShortId("launch-day") === "launch-day", "raw alias");
assert(extractShortId("http://localhost:8000/launch-day") === "launch-day", "full url");
assert(extractShortId("  ") === "", "blank");
assert(formatDate("not-a-date") === "Unknown date", "invalid date");

console.log("format utils ok");
