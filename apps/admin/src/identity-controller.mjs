import {ok,fail} from "../../../packages/contracts/src/api-envelope.mjs";
export function createIdentityController({identityService,membershipService,adminService}){
 return {
  async memberships(){try{return ok(membershipService.store.find("memberships",()=>true));}catch(e){return fail(e.code??"INTERNAL","İşlem tamamlanamadı");}},
  async sessions(userId){try{return ok(adminService.listSessions(userId));}catch(e){return fail(e.code??"INTERNAL","İşlem tamamlanamadı");}},
  async revokeAllSessions(input){try{return ok({revoked:adminService.revokeAllSessions(input)});}catch(e){return fail(e.code??e.message,"İşlem tamamlanamadı");}},
  async invite(input){try{return ok(membershipService.invite(input));}catch(e){return fail(e.code??e.message,"İşlem tamamlanamadı");}}
 };
}
