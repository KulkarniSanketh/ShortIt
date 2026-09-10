const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isValidCustomAlias,
  isReservedAlias,
  normalizeHttpUrl,
  isPrivateOrLocalHost,
} = require("./url");

test("accepts valid custom aliases", () => {
  assert.equal(isValidCustomAlias("launch-day"), true);
  assert.equal(isValidCustomAlias("A1_b2"), true);
});

test("rejects invalid and reserved custom aliases", () => {
  assert.equal(isValidCustomAlias("ab"), false);
  assert.equal(isValidCustomAlias("has space"), false);
  assert.equal(isValidCustomAlias("bad/alias"), false);
  assert.equal(isValidCustomAlias("api"), false);
  assert.equal(isReservedAlias("Health"), true);
});

test("normalizes public http(s) URLs", () => {
  assert.equal(normalizeHttpUrl("https://example.com/path"), "https://example.com/path");
});

test("rejects local, private, and credentialed URLs", () => {
  assert.throws(() => normalizeHttpUrl("javascript:alert(1)"), { statusCode: 400 });
  assert.throws(() => normalizeHttpUrl("http://localhost/secret"), { statusCode: 400 });
  assert.throws(() => normalizeHttpUrl("http://127.0.0.1/"), { statusCode: 400 });
  assert.throws(() => normalizeHttpUrl("http://192.168.1.10/"), { statusCode: 400 });
  assert.throws(() => normalizeHttpUrl("https://user:pass@example.com/"), { statusCode: 400 });
});

test("detects private hosts", () => {
  assert.equal(isPrivateOrLocalHost("10.0.0.4"), true);
  assert.equal(isPrivateOrLocalHost("example.com"), false);
});
