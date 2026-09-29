import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {SearchService} from "../packages/core/src/search-service.mjs";
import {ProductCardService} from "../packages/core/src/product-card-service.mjs";

test("search only returns published products and active offer counts",()=>{
 const s=new MemoryStore();
 s.insert("masterProducts",{id:"p1",productKey:"patates",name:"Donuk Patates",baseUnit:"KG",status:"PUBLISHED"});
 s.insert("masterProducts",{id:"p2",productKey:"gizli",name:"Gizli Patates",baseUnit:"KG",status:"DRAFT"});
 s.insert("supplierOffers",{id:"o1",supplierId:"s1",masterProductId:"p1",offerStatus:"ACTIVE"});
 const result=new SearchService(s).search({query:"patates"});
 assert.equal(result.length,1);
 assert.equal(result[0].product.id,"p1");
 assert.equal(result[0].activeOfferCount,1);
});

test("product card exposes range without auto-selecting supplier",()=>{
 const s=new MemoryStore();
 s.insert("masterProducts",{id:"p",productKey:"p",name:"Ürün",baseUnit:"KG",status:"PUBLISHED"});
 s.insert("supplierOffers",{id:"o1",supplierId:"s1",masterProductId:"p",offerStatus:"ACTIVE"});
 s.insert("supplierOffers",{id:"o2",supplierId:"s2",masterProductId:"p",offerStatus:"ACTIVE"});
 s.insert("supplierOfferPrices",{id:"a",supplierOfferId:"o1",unitPriceMinor:10000,currency:"TRY",status:"ACTIVE"});
 s.insert("supplierOfferPrices",{id:"b",supplierOfferId:"o2",unitPriceMinor:12000,currency:"TRY",status:"ACTIVE"});
 const card=new ProductCardService(s).build("p");
 assert.deepEqual(card.priceRangeTry,{minMinor:10000,maxMinor:12000});
 assert.equal(card.activeOfferCount,2);
 assert.equal(card.supplierSelectionRequired,true);
 assert.equal("selectedSupplierId" in card,false);
});
