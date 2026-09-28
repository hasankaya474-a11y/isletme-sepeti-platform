import { newId } from "./id.mjs";

export function auditEvent({actorId, action, resourceType, resourceId, scope, metadata = {}}) {
  if (!actorId || !action || !resourceType || !resourceId) throw new TypeError("audit fields required");
  return Object.freeze({
    id: newId("audit"),
    occurredAt: new Date().toISOString(),
    actorId, action, resourceType, resourceId,
    scope: scope ?? null,
    metadata: structuredClone(metadata)
  });
}
