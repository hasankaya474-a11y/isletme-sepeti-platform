export const MFA_REQUIRED_ACTIONS = Object.freeze(new Set([
  "admin.configuration.manage",
  "admin.content.publish",
  "admin.export.execute",
  "security.role.change",
  "finance.commission.change",
  "bulk.price.change"
]));

export function requiresMfa(permission) {
  return MFA_REQUIRED_ACTIONS.has(permission);
}

export function assertMfa({permission,session}) {
  if (requiresMfa(permission) && (session?.mfaLevel ?? 0) < 1) {
    const error = new Error("MFA_REQUIRED");
    error.code = "MFA_REQUIRED";
    throw error;
  }
}
