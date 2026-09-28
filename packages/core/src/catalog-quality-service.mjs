import {newId} from "./id.mjs";
const norm=v=>String(v??"").trim().toLocaleLowerCase("tr-TR");
export class CatalogQualityService{
 constructor(store){this.store=store;}
 inspect(product){const issues=[];if(!product.categoryId)issues.push("CATEGORY_MISSING");if(!product.brandId)issues.push("BRAND_MISSING");if(!product.baseUnit)issues.push("UNIT_MISSING");if(!product.gtin&&!product.barcode)issues.push("IDENTIFIER_MISSING");return issues;}
 duplicateCandidates(product){return this.store.find("masterProducts",x=>x.id!==product.id&&(product.gtin&&x.gtin===product.gtin||product.barcode&&x.barcode===product.barcode||norm(x.name)===norm(product.name))).map(x=>({id:newId("dup"),leftProductId:product.id,rightProductId:x.id,status:"OPEN"}));}
}