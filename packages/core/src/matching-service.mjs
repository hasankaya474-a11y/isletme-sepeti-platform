import {newId} from "./id.mjs";

export class MatchingService{
  constructor(store,search){this.store=store;this.search=search;}

  createTextRequest({businessId,text,actorId}){
    if(!businessId||!actorId||!text?.trim()) throw new TypeError("MATCH_TEXT_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("matchreq"),businessId,sourceType:"TEXT_LIST",sourceText:text,sourceMediaAssetId:null,status:"NEW",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"matching.request.create_text",resourceType:"matching_request",resourceId:row.id,occurredAt:now});
    return this.store.insert("matchingRequests",row);
  }

  createPhotoRequest({businessId,mediaAssetId,actorId}){
    if(!businessId||!actorId||!mediaAssetId) throw new TypeError("MATCH_PHOTO_FIELDS_REQUIRED");
    if(!this.store.get("media",mediaAssetId)&&!this.store.get("mediaAssets",mediaAssetId)) throw new Error("MEDIA_ASSET_NOT_FOUND");
    const now=new Date().toISOString();
    const row={id:newId("matchreq"),businessId,sourceType:"PHOTO",sourceText:null,sourceMediaAssetId:mediaAssetId,status:"NEW",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"matching.request.create_photo",resourceType:"matching_request",resourceId:row.id,occurredAt:now});
    return this.store.insert("matchingRequests",row);
  }

  suggestTextCandidates({requestId,actorId}){
    const req=this.store.get("matchingRequests",requestId);
    if(!req||req.sourceType!=="TEXT_LIST") throw new Error("MATCH_REQUEST_INVALID");
    const lines=req.sourceText.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);
    const out=[];
    for(const line of lines){
      for(const result of this.search.search({query:line,limit:3})){
        const confidence=Math.min(0.99,0.45+result.score*0.12);
        out.push(this.store.insert("matchingCandidates",{id:newId("matchcand"),matchingRequestId:req.id,sourceLine:line,masterProductId:result.product.id,variantId:null,confidence,reason:{searchScore:result.score},decision:"PENDING",reviewedBy:null,reviewedAt:null}));
      }
    }
    this.store.update("matchingRequests",req.id,x=>({...x,status:"REVIEW",updatedAt:new Date().toISOString()}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"matching.candidates.suggest",resourceType:"matching_request",resourceId:req.id,occurredAt:new Date().toISOString()});
    return out;
  }

  reviewCandidate({candidateId,businessId,decision,actorId}){
    if(!["CONFIRMED","REJECTED"].includes(decision)) throw new Error("MATCH_DECISION_INVALID");
    const candidate=this.store.get("matchingCandidates",candidateId);
    if(!candidate) throw new Error("MATCH_CANDIDATE_NOT_FOUND");
    const req=this.store.get("matchingRequests",candidate.matchingRequestId);
    if(!req||req.businessId!==businessId) throw new Error("MATCH_REQUEST_FORBIDDEN");
    const now=new Date().toISOString();
    const row=this.store.update("matchingCandidates",candidateId,x=>({...x,decision,reviewedBy:actorId,reviewedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"matching.candidate."+decision.toLowerCase(),resourceType:"matching_candidate",resourceId:candidateId,occurredAt:now});
    return row;
  }
}
