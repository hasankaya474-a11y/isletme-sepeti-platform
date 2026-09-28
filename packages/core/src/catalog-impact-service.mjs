export class CatalogImpactService{
 constructor(store){this.store=store;}
 product(productId){return {supplierOffers:this.store.find("supplierOffers",x=>x.masterProductId===productId).length,variants:this.store.find("productVariants",x=>x.masterProductId===productId&&x.status!=="ARCHIVED").length,media:this.store.find("productMedia",x=>x.masterProductId===productId).length,qualityIssues:this.store.find("catalogQualityIssues",x=>x.entityId===productId&&x.status==="OPEN").length};}
 assertArchiveSafe(productId){const x=this.product(productId);if(x.supplierOffers||x.variants)throw Object.assign(new Error("CATALOG_DEPENDENCIES_EXIST"),{impact:x});return x;}
 media(mediaId){return {productUsage:this.store.find("productMedia",x=>x.mediaAssetId===mediaId).length,pageUsage:this.store.find("pageBlocks",x=>JSON.stringify(x.content??{}).includes(mediaId)).length};}
}