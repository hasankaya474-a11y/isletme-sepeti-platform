import { randomUUID } from "node:crypto";

export function newId(prefix) {
  if (!/^[a-z][a-z0-9_]{1,20}$/.test(prefix)) throw new TypeError("invalid id prefix");
  return prefix + "_" + randomUUID().replaceAll("-", "");
}
