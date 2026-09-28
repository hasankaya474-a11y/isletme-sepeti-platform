import {newId} from "./id.mjs";
export class ProductRequestService{
 constructor(store,catalog){this.store=store;this.catalog=catalog;}
 request({actorId,supplierId,proposedName,proposedBrand=null,proposedCategory=null,gtin=null,barcode=null,packageData={},evidence=[]}){
  if(!actorId||!supplierId||!proposedName)throw new TypeError("PRODUCT_REQUEST_FIELDS_REQUIRED");
  const now=new Date().toISOString();return this.store.insert("productRequests",{id:newId("product_request"),supplierId,proposedName,proposedBrand,proposedCategory,gtin,barcode,packageData,evidence,status:"NEW",resolvedMasterProductId:null,createdBy:actorId,createdAt:now,updatedAt:now});
 }
 startReview({id,actorId}){if(!actorId)throw new TypeError("ACTOR_REQUIRED");return this.store.update("productRequests",id,x=>{if(x.status!=="NEW"&&x.status!=="NEEDS_INFO")throw new Error("PRODUCT_REQUEST_STATE_INVALID");return {...x,status:"UNDER_REVIEW",updatedAt:new Date().toISOString()};});}
 approve({id,actorId,productKey,baseUnit}){const r=this.store.get("productRequests",id);if(!r||r.status!=="UNDER_REVIEW")throw new Error("PRODUCT_REQUEST_NOT_REVIEWABLE");const p=this.catalog.createProduct({actorId,productKey,name:r.proposedName,gtin:r.gtin,barcode:r.barcode,baseUnit});this.store.update("productRequests",id,x=>({...x,status:"APPROVED",resolvedMasterProductId:p.id,updatedAt:new Date().toISOString()}));return p;}
 reject({id,actorId}){if(!actorId)throw new TypeError("ACTOR_REQUIRED");return this.store.update("productRequests",id,x=>{if(x.status!=="UNDER_REVIEW")throw new Error("PRODUCT_REQUEST_NOT_REVIEWABLE");return {...x,status:"REJECTED",updatedAt:new Date().toISOString()};});}
}