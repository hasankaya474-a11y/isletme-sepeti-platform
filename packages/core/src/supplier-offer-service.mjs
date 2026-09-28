import {newId} from "./id.mjs";
export class SupplierOfferService{
 constructor(store){this.store=store;}
 create({actorId,supplierId,masterProductId,variantId=null,supplierSku=null}){
  if(!actorId||!supplierId||!masterProductId)throw new TypeError("SUPPLIER_OFFER_FIELDS_REQUIRED");
  if(!this.store.get("masterProducts",masterProductId))throw new Error("MASTER_PRODUCT_NOT_FOUND");
  if(this.store.find("supplierOffers",x=>x.supplierId===supplierId&&x.masterProductId===masterProductId&&x.variantId===variantId).length)throw new Error("SUPPLIER_OFFER_DUPLICATE");
  const now=new Date().toISOString();return this.store.insert("supplierOffers",{id:newId("offer"),supplierId,masterProductId,variantId,supplierSku,offerStatus:"DRAFT",createdAt:now,updatedAt:now});
 }
 listOwn(supplierId){return this.store.find("supplierOffers",x=>x.supplierId===supplierId);}
 getOwn({supplierId,id}){const x=this.store.get("supplierOffers",id);if(!x||x.supplierId!==supplierId)throw new Error("SUPPLIER_OFFER_FORBIDDEN");return x;}
}