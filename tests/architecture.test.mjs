import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("architecture constitution is locked", () => {
  const text = readFileSync("docs/ARCHITECTURE_LOCK.md", "utf8");
  assert.match(text, /Status: LOCKED/);
  assert.match(text, /normal daily operation must be manageable without code/i);
  assert.match(text, /Help & Site Guide/);
  assert.match(text, /Production stays locked/);
});
