import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {AgreementService} from "../packages/core/src/agreement-service.mjs";
import {InvoiceService} from "../packages/core/src/invoice-service.mjs";
import {ThreeWayMatchService} from "../packages/core/src/three-way-match-service.mjs";
import {InvoiceReviewService} from "../packages/core/src/invoice-review-service.mjs";

function commercialFixture(){
 const s=new MemoryStore();
 s.insert("businesses",{id:"b"});s.insert("suppliers",{id:"s"});
 s.insert("orders",{id:"o",businessId:"b",supplierId:"s",currency:"TRY",state:"DELIVERED"});
 s.insert("orderLines",{id:"ol",orderId:"o",quantityMilli:1000,unitPriceMinor:1000,taxRateBps:2000});
 s.insert("orderSnapshots",{id:"snap",orderId:"o",snapshotSha256:"a".repeat(64)});
 s.insert("deliveries",{id:"d",orderId:"o",businessId:"b",supplierId:"s",status:"DELIVERED"});
 s.insert("deliveryItems",{id:"di",deliveryId:"d",orderLineId:"ol",plannedQtyMilli:1000,deliveredQtyMilli:1000});
 s.insert("receivings",{id:"recv",deliveryId:"d",businessId:"b",status:"COMPLETED"});
 s.insert("receivingLines",{id:"rl",receivingId:"recv",deliveryItemId:"di",acceptedQtyMilli:1000,rejectedQtyMilli:0});
 return s;
}

test("agreement becomes active only after both explicit acceptances",()=>{
 const s=commercialFixture(),svc=new AgreementService(s);
 const a=svc.create({businessId:"b",supplierId:"s",name:"Yıllık",currency:"TRY",actorId:"u"});
 svc.accept({agreementId:a.id,partyType:"BUSINESS",partyId:"b",actorId:"buser"});
 assert.equal(s.get("commercialAgreements",a.id).status,"PENDING_ACCEPTANCE");
 svc.accept({agreementId:a.id,partyType:"SUPPLIER",partyId:"s",actorId:"suser"});
 assert.equal(s.get("commercialAgreements",a.id).status,"ACTIVE");
});

test("three-way match uses receiving quantity and order price/tax",()=>{
 const s=commercialFixture(),invSvc=new InvoiceService(s);
 const inv=invSvc.createDraft({orderId:"o",supplierId:"s",invoiceNumber:"F1",issueDate:"2026-09-29",currency:"TRY",actorId:"suser"});
 invSvc.addLine({invoiceId:inv.id,supplierId:"s",orderLineId:"ol",quantityMilli:1000,unitPriceMinor:1000,taxRateBps:2000,actorId:"suser"});
 invSvc.submit({invoiceId:inv.id,supplierId:"s",actorId:"suser"});
 const match=new ThreeWayMatchService(s).match({invoiceId:inv.id,businessId:"b",actorId:"buser"});
 assert.equal(match.status,"MATCHED");assert.equal(match.issues.length,0);assert.equal(match.orderSnapshotSha256,"a".repeat(64));
});

test("exception approval requires explicit override reason and creates no payment",()=>{
 const s=commercialFixture(),invSvc=new InvoiceService(s);
 const inv=invSvc.createDraft({orderId:"o",supplierId:"s",invoiceNumber:"F2",issueDate:"2026-09-29",currency:"TRY",actorId:"suser"});
 invSvc.addLine({invoiceId:inv.id,supplierId:"s",orderLineId:"ol",quantityMilli:900,unitPriceMinor:1100,taxRateBps:1000,actorId:"suser"});
 invSvc.submit({invoiceId:inv.id,supplierId:"s",actorId:"suser"});
 const match=new ThreeWayMatchService(s).match({invoiceId:inv.id,businessId:"b",actorId:"buser"});
 assert.equal(match.status,"EXCEPTION");assert.ok(match.issues.some(x=>x.code==="QUANTITY_MISMATCH"));assert.ok(match.issues.some(x=>x.code==="PRICE_MISMATCH"));assert.ok(match.issues.some(x=>x.code==="TAX_MISMATCH"));
 const review=new InvoiceReviewService(s);
 assert.throws(()=>review.decide({invoiceId:inv.id,businessId:"b",decision:"APPROVED",actorId:"acc"}),/OVERRIDE_REASON/);
 assert.equal(review.decide({invoiceId:inv.id,businessId:"b",decision:"APPROVED",overrideReason:"Yönetici mutabakatı",actorId:"acc"}).status,"APPROVED");
 assert.equal(s.find("payments",()=>true).length,0);assert.equal(s.find("settlements",()=>true).length,0);
});
