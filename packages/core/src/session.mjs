import { createHash, randomBytes } from "node:crypto";
import { newId } from "./id.mjs";

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function issueSession({userId, ttlSeconds = 60 * 60 * 8, mfaLevel = 0, now = Date.now()}) {
  if (!userId) throw new TypeError("userId required");
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    record: {
      id: newId("sess"),
      userId,
      tokenHash: hashToken(token),
      mfaLevel,
      createdAt: new Date(now).toISOString(),
      lastSeenAt: new Date(now).toISOString(),
      expiresAt: new Date(now + ttlSeconds * 1000).toISOString(),
      revokedAt: null
    }
  };
}

export function isSessionActive(session, now = Date.now()) {
  return Boolean(session && !session.revokedAt && Date.parse(session.expiresAt) > now);
}
