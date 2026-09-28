import {newId} from "./id.mjs";
const ALLOWED=new Set(["DRAFT","REVIEW","ACTIVE","PAUSED","REJECTED","ARCHIVED"]);
export class SupplierOfferAdminService{
 constructor(store){this.store=store;}
 transition({id,to,actorId,supplierId=null}){if(!actorId||!ALLOWED.has(to))throw new Error("SUPPLIER_OFFER_STATE_INVALID");const offer=this.store.get("supplierOffers",id);if(!offer)throw new Error("SUPPLIER_OFFER_NOT_FOUND");if(supplierId&&offer.supplierId!==supplierId)throw new Error("SUPPLIER_OFFER_FORBIDDEN");if(to==="ACTIVE"){const p=this.store.get("masterProducts",offer.masterProductId);if(!p||p.status!=="PUBLISHED")throw new Error("MASTER_PRODUCT_NOT_PUBLISHED");}const row=this.store.update("supplierOffers",id,x=>({...x,offerStatus:to,updatedAt:new Date().toISOString()}));this.store.insert("audit",{id:newId("audit"),actorId,action:"supplier_offer."+to.toLowerCase(),resourceType:"supplier_offer",resourceId:id,occurredAt:new Date().toISOString()});return row;}
}