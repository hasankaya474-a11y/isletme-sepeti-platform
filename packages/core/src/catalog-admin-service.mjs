import {newId} from "./id.mjs";
export class CatalogAdminService{
 constructor(store,catalog){this.store=store;this.catalog=catalog;}
 createCategory({actorId,name,slug,parentId=null}){if(!actorId||!name||!slug)throw new TypeError("CATEGORY_FIELDS_REQUIRED");const now=new Date().toISOString(),x={id:newId("category"),parentId,name,slug,status:"DRAFT",createdAt:now,updatedAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"catalog.category.create",resourceType:"category",resourceId:x.id,occurredAt:now});return this.store.insert("categories",x);}
 createBrand({actorId,name,slug}){if(!actorId||!name||!slug)throw new TypeError("BRAND_FIELDS_REQUIRED");const now=new Date().toISOString(),x={id:newId("brand"),name,slug,status:"DRAFT",createdAt:now,updatedAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"catalog.brand.create",resourceType:"brand",resourceId:x.id,occurredAt:now});return this.store.insert("brands",x);}
 publishProduct({actorId,id}){const p=this.store.get("masterProducts",id);if(!p||p.status!=="REVIEW")throw new Error("PRODUCT_NOT_READY");return this.catalog.transition({id,to:"PUBLISHED",actorId});}
}