export const IDENTITY_ADMIN_CAPABILITIES = Object.freeze({
  companies:["list","review","approve","suspend","archive","view_audit"],
  memberships:["invite","activate","suspend","revoke","assign_role","remove_role","view_audit"],
  sessions:["list_for_user","revoke_one","revoke_all","view_security_events"],
  mfa:["view_status","require_for_role","reset_with_controlled_recovery"],
  roles:["list","assign_scoped","request_sensitive_change"],
  security:["list_events","filter_events","review_high_risk"],
  exports:["request","approve_if_required","execute_scoped","audit"]
});

export function adminCapabilityExists(area,action) {
  return IDENTITY_ADMIN_CAPABILITIES[area]?.includes(action) ?? false;
}
