export const SESSION_POLICY = Object.freeze({
  idleTimeoutSeconds: 60 * 60,
  absoluteTimeoutSeconds: 60 * 60 * 8,
  maxActiveSessionsPerUser: 10,
  rotateAfterPrivilegeChange: true,
  revokeOnPasswordReset: true
});

export function shouldReauthenticate({session,now=Date.now(),requiredMfaLevel=0}) {
  if (!session || session.revokedAt) return true;
  if (Date.parse(session.expiresAt) <= now) return true;
  if ((session.mfaLevel ?? 0) < requiredMfaLevel) return true;
  return false;
}
