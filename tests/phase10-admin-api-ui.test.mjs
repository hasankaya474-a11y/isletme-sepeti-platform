import test from "node:test";
import assert from "node:assert/strict";
import {Router} from "../apps/api/src/router.mjs";
import {registerPhase10Routes} from "../apps/api/src/phase10-routes.mjs";
import {renderSupplierInvoice} from "../apps/supplier/src/invoice-page.mjs";
import {renderInvoiceReview} from "../apps/buyer/src/invoice-review-page.mjs";
import {renderInvoiceCenter} from "../apps/admin/src/invoice-center-page.mjs";

function auth(permission,org,type){return {userId:"u",session:{mfaLevel:1},grants:[{permission,scope:"GLOBAL"}],requiredScope:"GLOBAL",membership:{status:"ACTIVE",organizationType:type,organizationId:org}};}
const req=(path,permission,org,type,body={})=>({method:"POST",path,body,requestId:"r",cookies:{csrf:"t"},headers:{"x-csrf-token":"t"},auth:auth(permission,org,type)});

test("supplier invoice API derives supplier from membership",async()=>{
 let seen;const router=new Router();
 registerPhase10Routes(router,{invoices:{createDraft:x=>(seen=x,x)},matching:{},invoiceReview:{},agreements:{},evidenceFacade:{},evidence:{}});
 const out=await router.handle(req("/v1/supplier/invoices","invoice.submit_own","s1","SUPPLIER",{supplierId:"attacker",orderId:"o",invoiceNumber:"F",issueDate:"x"}));
 assert.equal(out.ok,true);assert.equal(seen.supplierId,"s1");
});

test("buyer invoice match derives business from membership",async()=>{
 let seen;const router=new Router();
 registerPhase10Routes(router,{invoices:{},matching:{match:x=>(seen=x,x)},invoiceReview:{},agreements:{},evidenceFacade:{},evidence:{}});
 const out=await router.handle(req("/v1/buyer/invoices/match","invoice.review_own","b1","BUSINESS",{businessId:"attacker",invoiceId:"i"}));
 assert.equal(out.ok,true);assert.equal(seen.businessId,"b1");
});

test("invoice UIs escape data and state that approval is not payment",()=>{
 const s=renderSupplierInvoice({invoice:{invoiceNumber:"<script>x</script>",status:"DRAFT"},lines:[]});
 const b=renderInvoiceReview({invoice:{status:"MATCHED"},match:{status:"MATCHED",issues:[]}});
 const a=renderInvoiceCenter({invoices:[{}],matches:[],agreements:[]});
 assert.doesNotMatch(s,/<script>/);assert.match(b,/Onay ödeme işlemi değildir/);assert.match(a,/Fatura & Üçlü Eşleştirme Merkezi/);
});
