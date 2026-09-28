import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","REVIEW","PUBLISHED","UNPUBLISHED","ARCHIVED"]);
export class CatalogService{
 constructor(store){this.store=store;}
 createProduct({actorId,productKey,name,brandId=null,categoryId=null,gtin=null,barcode=null,baseUnit,netQuantity=null,origin=null,storageRequirements=null,allergens=[],specifications={}}){
  if(!actorId||!productKey||!name||!baseUnit)throw new TypeError("CATALOG_FIELDS_REQUIRED");
  if(this.store.find("masterProducts",x=>x.productKey===productKey||gtin&&x.gtin===gtin||barcode&&x.barcode===barcode).length)throw new Error("MASTER_PRODUCT_DUPLICATE");
  const now=new Date().toISOString(),row={id:newId("product"),productKey,name,brandId,categoryId,gtin,barcode,baseUnit,netQuantity,origin,storageRequirements,allergens,specifications,status:"DRAFT",version:1,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"catalog.product.create",resourceType:"master_product",resourceId:row.id,occurredAt:now});
  return this.store.insert("masterProducts",row);
 }
 transition({id,to,actorId}){if(!STATES.has(to))throw new Error("CATALOG_STATE_INVALID");const row=this.store.update("masterProducts",id,x=>({...x,status:to,version:x.version+1,updatedAt:new Date().toISOString()}));this.store.insert("audit",{id:newId("audit"),actorId,action:"catalog.product."+to.toLowerCase(),resourceType:"master_product",resourceId:id,occurredAt:new Date().toISOString()});return row;}
}