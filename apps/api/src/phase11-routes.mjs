import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";
export function registerPhase11Routes(router,{ledger,commissions,reconciliation}){
 const admin=h=>protect(h,{permission:"admin.configuration.manage"});
 router.register("POST","/v1/admin/ledger/append",admin(async req=>ok(ledger.append({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/ledger/reverse",admin(async req=>ok(ledger.reverse({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/commission/rules",admin(async req=>ok(commissions.createRule({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/reconciliation/open",admin(async req=>ok(reconciliation.open({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/reconciliation/resolve",admin(async req=>ok(reconciliation.resolve({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}