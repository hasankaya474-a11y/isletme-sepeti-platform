import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {calculateTax,assertSameCurrency} from "../packages/core/src/money-tax-service.mjs";
import {PricingService} from "../packages/core/src/pricing-service.mjs";

test("tax calculation uses integer minor units",()=>{
  assert.deepEqual(calculateTax({netMinor:10000,taxRateBps:2000}),{
    netMinor:10000,taxRateBps:2000,taxMinor:2000,grossMinor:12000
  });
});

test("mixed currencies are rejected",()=>{
  assert.throws(()=>assertSameCurrency("TRY","USD"),/CURRENCY_MISMATCH/);
});

test("offer price must match price book currency",()=>{
  const s=new MemoryStore();
  s.insert("supplierOffers",{id:"offer1",supplierId:"s1",masterProductId:"p1",offerStatus:"ACTIVE"});
  const pricing=new PricingService(s);
  const book=pricing.createPriceBook({name:"Türkiye Ana Liste",currency:"TRY",actorId:"admin"});
  assert.throws(()=>pricing.attachOfferPrice({
    supplierOfferId:"offer1",priceBookId:book.id,unitPriceMinor:12500,currency:"USD",actorId:"admin"
  }),/PRICE_BOOK_CURRENCY_MISMATCH/);
  const row=pricing.attachOfferPrice({
    supplierOfferId:"offer1",priceBookId:book.id,unitPriceMinor:12500,currency:"TRY",actorId:"admin"
  });
  assert.equal(row.status,"DRAFT");
  assert.equal(row.unitPriceMinor,12500);
});
