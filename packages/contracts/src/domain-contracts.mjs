export const ORDER_STATES = Object.freeze([
  "NEW","WAITING","ACCEPTED","PREPARING","READY","SHIPPED","DELIVERED","COMPLETED",
  "PARTIALLY_ACCEPTED","PARTIALLY_DELIVERED","CANCELLED","RETURNED","DISPUTED"
]);

export const CONTENT_STATES = Object.freeze([
  "DRAFT","REVIEW","SCHEDULED","PUBLISHED","UNPUBLISHED","ARCHIVED"
]);

export const ENVIRONMENTS = Object.freeze([
  "LOCAL","DEV","PRIVATE_STAGING","CLOSED_REAL_TEST","PRODUCTION"
]);

export const PRODUCTION_LOCKED = true;

export function assertMoney(money) {
  if (!money || !Number.isSafeInteger(money.amountMinor)) throw new TypeError("amountMinor must be a safe integer");
  if (!/^[A-Z]{3}$/.test(money.currency ?? "")) throw new TypeError("currency must be ISO-style 3 uppercase letters");
  return money;
}
