import {newId} from "./id.mjs";
export class CatalogMediaLinkService{
 constructor(store){this.store=store;}
 attach({actorId,masterProductId,mediaAssetId,position=0,role="GALLERY"}){if(!actorId)throw new TypeError("ACTOR_REQUIRED");if(!this.store.get("masterProducts",masterProductId))throw new Error("MASTER_PRODUCT_NOT_FOUND");const media=this.store.get("media",mediaAssetId);if(!media)throw new Error("MEDIA_NOT_FOUND");if(media.scanStatus&&media.scanStatus!=="CLEAN")throw new Error("MEDIA_NOT_CLEAN");if(this.store.find("productMedia",x=>x.masterProductId===masterProductId&&x.mediaAssetId===mediaAssetId).length)throw new Error("MEDIA_ALREADY_ATTACHED");return this.store.insert("productMedia",{id:newId("product_media"),masterProductId,mediaAssetId,position,role,createdAt:new Date().toISOString()});}
 usage(mediaAssetId){return this.store.find("productMedia",x=>x.mediaAssetId===mediaAssetId);}
}