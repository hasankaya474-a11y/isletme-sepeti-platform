import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
export function registerIdentityRoutes(router,{identity,memberships,admin}){
 router.register("POST","/v1/auth/register",async req=>ok(identity.register(req.body),{requestId:req.requestId}));
 router.register("POST","/v1/auth/login",async req=>{const x=identity.login(req.body);return ok({token:x.token,session:x.record},{requestId:req.requestId});});
 router.register("POST","/v1/admin/memberships/invite",async req=>ok(memberships.invite(req.body),{requestId:req.requestId}));
 router.register("GET","/v1/admin/memberships",async req=>ok(memberships.store.find("memberships",()=>true),{requestId:req.requestId}));
 router.register("POST","/v1/admin/sessions/revoke-all",async req=>ok({revoked:admin.revokeAllSessions(req.body)},{requestId:req.requestId}));
}
