export function can({grants, permission, requiredScope}) {
  if (!Array.isArray(grants) || !permission) return false;
  return grants.some((g) =>
    g.permission === permission &&
    (g.scope === "PLATFORM" || g.scope === requiredScope)
  );
}

export function requirePermission(input) {
  if (!can(input)) {
    const error = new Error("FORBIDDEN");
    error.code = "FORBIDDEN";
    throw error;
  }
}
