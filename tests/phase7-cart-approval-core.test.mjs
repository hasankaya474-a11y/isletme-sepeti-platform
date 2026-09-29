import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {CartService} from "../packages/core/src/cart-service.mjs";
import {ProcurementPolicyService} from "../packages/core/src/procurement-policy-service.mjs";
import {RequisitionService} from "../packages/core/src/requisition-service.mjs";
import {ProcurementApprovalService} from "../packages/core/src/procurement-approval-service.mjs";
import {PoReadinessService} from "../packages/core/src/po-readiness-service.mjs";

function fixture(){
 const s=new MemoryStore();
 s.insert("masterProducts",{id:"p",status:"PUBLISHED"});
 s.insert("suppliers",{id:"s",status:"ACTIVE"});
 s.insert("supplierOffers",{id:"o",supplierId:"s",masterProductId:"p",variantId:null,offerStatus:"ACTIVE"});
 s.insert("taxProfiles",{id:"t",taxRateBps:2000,status:"ACTIVE"});
 s.insert("supplierOfferPrices",{id:"price",supplierOfferId:"o",unitPriceMinor:1000,currency:"TRY",taxProfileId:"t",status:"ACTIVE"});
 const policies=new ProcurementPolicyService(s);
 const rule=policies.create({businessId:"b",name:"100 TL üstü",currency:"TRY",thresholdMinor:10000,actorId:"admin"});
 policies.activate({id:rule.id,businessId:"b",actorId:"admin"});
 const carts=new CartService(s),cart=carts.create({businessId:"b",actorId:"u1"});
 carts.addOfferLine({cartId:cart.id,businessId:"b",supplierOfferId:"o",priceId:"price",quantityMilli:10000,actorId:"u1"});
 const requisitions=new RequisitionService(s,policies);
 return {s,carts,cart,requisitions};
}

test("cart line preserves explicitly selected supplier and tax profile",()=>{
 const {s,cart}=fixture();const line=s.find("cartLines",x=>x.cartId===cart.id)[0];
 assert.equal(line.supplierId,"s");assert.equal(line.taxRateBps,2000);
});

test("approval-required requisition enforces four-eyes",()=>{
 const {s,cart,requisitions}=fixture();
 const req=requisitions.submit({cartId:cart.id,businessId:"b",actorId:"u1"});
 assert.equal(req.status,"PENDING_APPROVAL");
 const approval=s.find("procurementApprovals",x=>x.requisitionId===req.id)[0];
 const svc=new ProcurementApprovalService(s);
 assert.throws(()=>svc.decide({approvalId:approval.id,businessId:"b",decision:"APPROVED",actorId:"u1"}),/SELF_APPROVAL/);
 assert.equal(svc.decide({approvalId:approval.id,businessId:"b",decision:"APPROVED",actorId:"u2"}).status,"APPROVED");
});

test("PO readiness never creates an order",()=>{
 const {s,cart,requisitions}=fixture();
 const req=requisitions.submit({cartId:cart.id,businessId:"b",actorId:"u1"});
 const approval=s.find("procurementApprovals",x=>x.requisitionId===req.id)[0];
 new ProcurementApprovalService(s).decide({approvalId:approval.id,businessId:"b",decision:"APPROVED",actorId:"u2"});
 const check=new PoReadinessService(s).evaluate({requisitionId:req.id,businessId:"b"});
 assert.equal(check.ready,true);assert.equal(check.createsOrder,false);assert.equal(s.find("orders",()=>true).length,0);
});
