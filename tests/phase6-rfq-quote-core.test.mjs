import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {RfqService} from "../packages/core/src/rfq-service.mjs";
import {QuoteService} from "../packages/core/src/quote-service.mjs";
import {QuoteComparisonService} from "../packages/core/src/quote-comparison-service.mjs";

function setup(){
 const s=new MemoryStore();
 s.insert("masterProducts",{id:"p",name:"Patates",status:"PUBLISHED"});
 s.insert("suppliers",{id:"s1",status:"ACTIVE"});s.insert("suppliers",{id:"s2",status:"ACTIVE"});
 const rfqs=new RfqService(s);
 const rfq=rfqs.create({businessId:"b1",title:"Haftalık alım",actorId:"u"});
 const line=rfqs.addLine({rfqId:rfq.id,businessId:"b1",masterProductId:"p",quantityMilli:10000,unit:"KG",actorId:"u"});
 rfqs.inviteSupplier({rfqId:rfq.id,businessId:"b1",supplierId:"s1",actorId:"u"});
 rfqs.inviteSupplier({rfqId:rfq.id,businessId:"b1",supplierId:"s2",actorId:"u"});
 rfqs.open({rfqId:rfq.id,businessId:"b1",actorId:"u"});
 return {s,rfq,line};
}

test("supplier without invitation cannot create quote",()=>{
 const {s,rfq}=setup();s.insert("suppliers",{id:"s3",status:"ACTIVE"});
 assert.throws(()=>new QuoteService(s).createDraft({rfqId:rfq.id,supplierId:"s3",currency:"TRY",actorId:"x"}),/INVITATION_REQUIRED/);
});

test("quote comparison returns factual rows without winner field",()=>{
 const {s,rfq,line}=setup(),quotes=new QuoteService(s);
 for(const [supplierId,price] of [["s1",1000],["s2",1100]]){
   const q=quotes.createDraft({rfqId:rfq.id,supplierId,currency:"TRY",actorId:supplierId});
   quotes.addLine({quoteId:q.id,supplierId,rfqLineId:line.id,unitPriceMinor:price,taxRateBps:2000,actorId:supplierId});
   quotes.submit({quoteId:q.id,supplierId,actorId:supplierId});
 }
 const rows=new QuoteComparisonService(s).compare({rfqId:rfq.id,businessId:"b1"});
 assert.equal(rows.length,2);
 assert.ok(rows.every(x=>x.selectionRequired===true));
 assert.ok(rows.every(x=>!("winner" in x)&&!("score" in x)&&!("selectedSupplierId" in x)));
});
