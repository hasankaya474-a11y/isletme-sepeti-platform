export const SECURITY_HARDENING=Object.freeze({
 authenticationRequired:true,
 mfaForAdminMutations:true,
 csrfForUnsafeMethods:true,
 tenantIsolation:true,
 appendOnlyAudit:true,
 secretReferencesOnly:true,
 restoreEvidenceRequired:true,
 retentionPolicyRequired:true,
 productionLocked:true
});
