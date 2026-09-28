import { newId } from "./id.mjs";
import { hashPassword } from "./password.mjs";

export function normalizeEmail(email) {
  if (typeof email !== "string") throw new TypeError("EMAIL_REQUIRED");
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new TypeError("EMAIL_INVALID");
  return normalized;
}

export function createUser({email,password,now = new Date().toISOString()}) {
  const emailNormalized = normalizeEmail(email);
  return {
    id: newId("usr"),
    email: email.trim(),
    emailNormalized,
    passwordHash: hashPassword(password),
    status: "PENDING",
    emailVerifiedAt: null,
    createdAt: now,
    updatedAt: now
  };
}
