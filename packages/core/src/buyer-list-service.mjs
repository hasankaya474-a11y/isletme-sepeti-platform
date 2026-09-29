import {newId} from "./id.mjs";

export class BuyerListService{
  constructor(store){this.store=store;}
  create({businessId,name,actorId}){
    if(!businessId||!name||!actorId) throw new TypeError("BUYER_LIST_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("buylist"),businessId,name,status:"ACTIVE",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"buyer_list.create",resourceType:"buyer_list",resourceId:row.id,occurredAt:now});
    return this.store.insert("buyerLists",row);
  }
  addItem({listId,businessId,masterProductId,variantId=null,quantity=null,note=null,actorId}){
    if(!actorId||!businessId||!masterProductId) throw new TypeError("BUYER_LIST_ITEM_FIELDS_REQUIRED");
    const list=this.store.get("buyerLists",listId);
    if(!list||list.businessId!==businessId) throw new Error("BUYER_LIST_FORBIDDEN");
    if(!this.store.get("masterProducts",masterProductId)) throw new Error("MASTER_PRODUCT_NOT_FOUND");
    if(this.store.find("buyerListItems",x=>x.listId===listId&&x.masterProductId===masterProductId&&x.variantId===variantId).length) throw new Error("BUYER_LIST_ITEM_DUPLICATE");
    const row={id:newId("buyitem"),listId,masterProductId,variantId,quantity,note,createdAt:new Date().toISOString()};
    return this.store.insert("buyerListItems",row);
  }
  listOwn(businessId){return this.store.find("buyerLists",x=>x.businessId===businessId);}
}
