import {ok} from "../../../packages/contracts/src/api-envelope.mjs";
import {protect} from "../../../packages/core/src/request-pipeline.mjs";

export function registerPhase10Routes(router,{invoices,matching,invoiceReview,agreements,evidenceFacade,evidence}){
 const supplier=h=>protect(h,{permission:"invoice.submit_own"});
 const buyer=h=>protect(h,{permission:"invoice.review_own"});
 const agreement=h=>protect(h,{permission:"agreement.manage_own"});
 const admin=h=>protect(h,{permission:"admin.invoice.manage"});

 router.register("POST","/v1/supplier/invoices",supplier(async req=>ok(invoices.createDraft({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/invoices/lines",supplier(async req=>ok(invoices.addLine({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/invoices/submit",supplier(async req=>ok(invoices.submit({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/invoices/evidence",supplier(async req=>ok(evidenceFacade.attachInvoice({...req.body,organizationType:"SUPPLIER",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/buyer/invoices/match",buyer(async req=>ok(matching.match({invoiceId:req.body.invoiceId,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/invoices/review",buyer(async req=>ok(invoiceReview.decide({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/invoices/evidence",buyer(async req=>ok(evidenceFacade.attachInvoice({...req.body,organizationType:"BUSINESS",organizationId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/buyer/agreements",agreement(async req=>ok(agreements.create({...req.body,businessId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/buyer/agreements/accept",agreement(async req=>ok(agreements.accept({...req.body,partyType:"BUSINESS",partyId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/agreements",agreement(async req=>ok(agreements.create({...req.body,supplierId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/supplier/agreements/accept",agreement(async req=>ok(agreements.accept({...req.body,partyType:"SUPPLIER",partyId:req.auth.membership.organizationId,actorId:req.auth.userId}),{requestId:req.requestId})));

 router.register("POST","/v1/admin/invoices/match",admin(async req=>ok(matching.match({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
 router.register("POST","/v1/admin/evidence",admin(async req=>ok(evidence.attach({...req.body,actorId:req.auth.userId}),{requestId:req.requestId})));
}
