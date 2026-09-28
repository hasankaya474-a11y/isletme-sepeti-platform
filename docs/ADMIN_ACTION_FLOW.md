# Admin Action Flow
Status: IMPLEMENTED FOUNDATION

Identity Admin mutations now have a client/controller flow:
UI action -> client -> CSRF header -> protected API route -> permission/scope/MFA -> service -> audit -> stable response -> loading/success/error announcement.

Role/scope changes enter the four-eyes change-request queue. The requester cannot approve or reject their own high-risk request. Rejections require a reason and are audited.

Forms have explicit validation contracts. UI must show field errors next to controls and announce completion/failure without relying only on color.
