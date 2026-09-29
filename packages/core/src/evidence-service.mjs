import {newId} from "./id.mjs";
export class EvidenceService{
 constructor(store){this.store=store;}
 attach({entityType,entityId,evidenceType,mediaAssetId=null,evidenceSha256=null,metadata={},actorId}){
  if(!entityType||!entityId||!evidenceType||!actorId)throw new TypeError("EVIDENCE_FIELDS_REQUIRED");
  if(mediaAssetId&&!this.store.get("media",mediaAssetId)&&!this.store.get("mediaAssets",mediaAssetId))throw new Error("MEDIA_ASSET_NOT_FOUND");
  const now=new Date().toISOString(),row={id:newId("evidence"),entityType,entityId,evidenceType,mediaAssetId,evidenceSha256,metadata,createdBy:actorId,createdAt:now};
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:entityType,aggregateId:entityId,eventType:"evidence.attached",payload:{entityType,entityId,evidenceType},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"evidence.attach",resourceType:entityType,resourceId:entityId,occurredAt:now});return this.store.insert("commercialEvidence",row);
 }
 list(entityType,entityId){return this.store.find("commercialEvidence",x=>x.entityType===entityType&&x.entityId===entityId);}
}
