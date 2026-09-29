import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {SearchService} from "../packages/core/src/search-service.mjs";
import {MatchingService} from "../packages/core/src/matching-service.mjs";

test("text matching produces pending candidates requiring human review",()=>{
 const s=new MemoryStore();
 s.insert("masterProducts",{id:"p",productKey:"patates",name:"Donuk Patates",baseUnit:"KG",status:"PUBLISHED"});
 const service=new MatchingService(s,new SearchService(s));
 const req=service.createTextRequest({businessId:"b1",text:"donuk patates",actorId:"u1"});
 const candidates=service.suggestTextCandidates({requestId:req.id,actorId:"system"});
 assert.equal(candidates.length,1);
 assert.equal(candidates[0].decision,"PENDING");
 assert.equal(s.get("matchingRequests",req.id).status,"REVIEW");
});

test("candidate review is tenant scoped and explicit",()=>{
 const s=new MemoryStore();
 s.insert("matchingRequests",{id:"r",businessId:"b1",sourceType:"TEXT_LIST",sourceText:"x",status:"REVIEW"});
 s.insert("matchingCandidates",{id:"c",matchingRequestId:"r",masterProductId:"p",confidence:.8,decision:"PENDING"});
 const service=new MatchingService(s,new SearchService(s));
 assert.throws(()=>service.reviewCandidate({candidateId:"c",businessId:"b2",decision:"CONFIRMED",actorId:"u"}),/FORBIDDEN/);
 assert.equal(service.reviewCandidate({candidateId:"c",businessId:"b1",decision:"CONFIRMED",actorId:"u"}).decision,"CONFIRMED");
});
