import { newId } from "./id.mjs";

export const FOUR_EYES_ACTIONS = Object.freeze(new Set([
  "security.role.change",
  "finance.commission.change",
  "bulk.price.change",
  "privacy.mass_export",
  "production.release",
  "content.publish",
  "content.rollback"
]));

export function requiresFourEyes(actionCode) {
  return FOUR_EYES_ACTIONS.has(actionCode);
}

export function createChangeRequest({requestedBy,actionCode,resourceType,resourceId,payload={},riskLevel="HIGH",now=new Date().toISOString()}) {
  if (!requestedBy || !actionCode || !resourceType || !resourceId) throw new TypeError("CHANGE_REQUEST_FIELDS_REQUIRED");
  return {id:newId("chg"),requestedBy,actionCode,resourceType,resourceId,payload,riskLevel,status:requiresFourEyes(actionCode)?"PENDING_APPROVAL":"APPROVED",requestedAt:now,decidedBy:null,decidedAt:null,appliedAt:null};
}

export function approveChange(request,{approverId,now=new Date().toISOString()}) {
  if (request.status !== "PENDING_APPROVAL") throw new Error("CHANGE_NOT_PENDING");
  if (request.requestedBy === approverId) throw new Error("FOUR_EYES_SELF_APPROVAL_FORBIDDEN");
  return {...request,status:"APPROVED",decidedBy:approverId,decidedAt:now};
}
