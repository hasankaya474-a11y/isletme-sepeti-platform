import { pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";

const ITERATIONS = 310000;
const KEYLEN = 32;
const DIGEST = "sha256";

export function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12) throw new TypeError("PASSWORD_TOO_WEAK");
  const salt = randomBytes(16);
  const derived = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST);
  return ["pbkdf2",DIGEST,ITERATIONS,salt.toString("base64"),derived.toString("base64")].join("$");
}

export function verifyPassword(password, encoded) {
  try {
    const [kind,digest,iterations,saltB64,hashB64] = encoded.split("$");
    if (kind !== "pbkdf2" || digest !== DIGEST || Number(iterations) < ITERATIONS) return false;
    const expected = Buffer.from(hashB64,"base64");
    const actual = pbkdf2Sync(password,Buffer.from(saltB64,"base64"),Number(iterations),expected.length,digest);
    return expected.length === actual.length && timingSafeEqual(expected,actual);
  } catch {
    return false;
  }
}
