export class IdentityAdminClient{
 constructor({transport,csrfToken}){this.transport=transport;this.csrfToken=csrfToken;}
 async request(method,path,body){const r=await this.transport({method,path,body,headers:{"x-csrf-token":this.csrfToken}});if(!r?.ok)throw Object.assign(new Error(r?.error?.message??"İşlem tamamlanamadı"),{code:r?.error?.code??"REQUEST_FAILED"});return r.data;}
 invite(input){return this.request("POST","/v1/admin/memberships/invite",input);}
 revokeAllSessions(userId){return this.request("POST","/v1/admin/sessions/revoke-all",{userId});}
 requestRoleChange(input){return this.request("POST","/v1/admin/role-changes",input);}
 approveChange(requestId){return this.request("POST","/v1/admin/change-requests/approve",{requestId});}
 rejectChange(requestId,reason){return this.request("POST","/v1/admin/change-requests/reject",{requestId,reason});}
}