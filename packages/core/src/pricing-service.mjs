import {newId} from "./id.mjs";
import {assertMinorUnits,normalizeCurrency} from "./money-tax-service.mjs";

const PRICE_STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);

export class PricingService{
  constructor(store){this.store=store;}

  createPriceBook({name,currency,actorId}){
    if(!name||!actorId) throw new TypeError("PRICE_BOOK_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    return this.store.insert("priceBooks",{
      id:newId("pricebook"),name,currency:normalizeCurrency(currency),
      status:"DRAFT",createdAt:now,updatedAt:now
    });
  }

  attachOfferPrice({supplierOfferId,priceBookId,taxProfileId=null,unitPriceMinor,currency,actorId}){
    if(!supplierOfferId||!priceBookId||!actorId) throw new TypeError("OFFER_PRICE_FIELDS_REQUIRED");
    const offer=this.store.get("supplierOffers",supplierOfferId);
    if(!offer) throw new Error("SUPPLIER_OFFER_NOT_FOUND");
    const book=this.store.get("priceBooks",priceBookId);
    if(!book) throw new Error("PRICE_BOOK_NOT_FOUND");
    const normalized=normalizeCurrency(currency);
    if(book.currency!==normalized) throw new Error("PRICE_BOOK_CURRENCY_MISMATCH");
    assertMinorUnits(unitPriceMinor);
    const now=new Date().toISOString();
    return this.store.insert("supplierOfferPrices",{
      id:newId("offerprice"),supplierOfferId,priceBookId,taxProfileId,
      unitPriceMinor,currency:normalized,status:"DRAFT",version:1,
      createdAt:now,updatedAt:now
    });
  }

  transitionPrice({id,to,actorId}){
    if(!actorId||!PRICE_STATES.has(to)) throw new Error("PRICE_STATE_INVALID");
    return this.store.update("supplierOfferPrices",id,x=>({...x,status:to,updatedAt:new Date().toISOString()}));
  }
}
