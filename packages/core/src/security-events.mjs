import { createHash } from "node:crypto";
import { newId } from "./id.mjs";

export function privacyHash(value) {
  if (!value) return null;
  return createHash("sha256").update(String(value)).digest("hex");
}

export function securityEvent({userId=null,sessionId=null,eventType,severity="INFO",outcome,ip=null,device=null,correlationId=null,metadata={},now=new Date().toISOString()}) {
  if (!eventType || !outcome) throw new TypeError("SECURITY_EVENT_FIELDS_REQUIRED");
  return Object.freeze({
    id:newId("sec"),
    occurredAt:now,userId,sessionId,eventType,severity,outcome,
    ipHash:privacyHash(ip),deviceHash:privacyHash(device),correlationId,
    metadata:structuredClone(metadata)
  });
}
