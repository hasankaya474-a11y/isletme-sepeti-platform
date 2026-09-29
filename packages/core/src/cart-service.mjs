import {newId} from "./id.mjs";

export class CartService{
 constructor(store){this.store=store;}
 create({businessId,name="Sepetim",actorId}){
  if(!businessId||!actorId)throw new TypeError("CART_FIELDS_REQUIRED");
  const now=new Date().toISOString(),row={id:newId("cart"),businessId,name,status:"ACTIVE",createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"cart.create",resourceType:"cart",resourceId:row.id,occurredAt:now});
  return this.store.insert("carts",row);
 }
 assertOwn({cartId,businessId}){
  const cart=this.store.get("carts",cartId);if(!cart||cart.businessId!==businessId)throw new Error("CART_FORBIDDEN");return cart;
 }
 addOfferLine({cartId,businessId,supplierOfferId,priceId,quantityMilli,actorId}){
  const cart=this.assertOwn({cartId,businessId});if(cart.status!=="ACTIVE")throw new Error("CART_NOT_EDITABLE");
  const offer=this.store.get("supplierOffers",supplierOfferId);if(!offer||offer.offerStatus!=="ACTIVE")throw new Error("SUPPLIER_OFFER_NOT_ACTIVE");
  const price=this.store.get("supplierOfferPrices",priceId);if(!price||price.supplierOfferId!==offer.id||price.status!=="ACTIVE")throw new Error("OFFER_PRICE_NOT_ACTIVE");
  if(!Number.isSafeInteger(quantityMilli)||quantityMilli<=0)throw new TypeError("CART_QUANTITY_INVALID");
  const taxProfile=price.taxProfileId?this.store.get("taxProfiles",price.taxProfileId):null;
  const now=new Date().toISOString();
  const row={id:newId("cartline"),cartId,masterProductId:offer.masterProductId,variantId:offer.variantId??null,supplierId:offer.supplierId,supplierOfferId:offer.id,sourceQuoteId:null,sourceQuoteLineId:null,quantityMilli,unitPriceMinor:price.unitPriceMinor,currency:price.currency,taxRateBps:taxProfile?.taxRateBps??0,status:"ACTIVE",createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"cart.line.add_offer",resourceType:"cart",resourceId:cartId,occurredAt:now});
  return this.store.insert("cartLines",row);
 }
 addQuoteLine({cartId,businessId,quoteLineId,quantityMilli=null,actorId}){
  const cart=this.assertOwn({cartId,businessId});if(cart.status!=="ACTIVE")throw new Error("CART_NOT_EDITABLE");
  const ql=this.store.get("quoteLines",quoteLineId);if(!ql)throw new Error("QUOTE_LINE_NOT_FOUND");
  const quote=this.store.get("quotes",ql.quoteId);if(!quote||quote.status!=="SUBMITTED")throw new Error("QUOTE_NOT_SUBMITTED");
  const rfq=this.store.get("rfqs",quote.rfqId);if(!rfq||rfq.businessId!==businessId)throw new Error("QUOTE_FORBIDDEN");
  const rl=this.store.get("rfqLines",ql.rfqLineId);
  const qty=quantityMilli??rl.quantityMilli;if(!Number.isSafeInteger(qty)||qty<=0)throw new TypeError("CART_QUANTITY_INVALID");
  const now=new Date().toISOString();
  const row={id:newId("cartline"),cartId,masterProductId:rl.masterProductId,variantId:rl.variantId??null,supplierId:quote.supplierId,supplierOfferId:null,sourceQuoteId:quote.id,sourceQuoteLineId:ql.id,quantityMilli:qty,unitPriceMinor:ql.unitPriceMinor,currency:quote.currency,taxRateBps:ql.taxRateBps,status:"ACTIVE",createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"cart.line.add_quote",resourceType:"cart",resourceId:cartId,occurredAt:now});
  return this.store.insert("cartLines",row);
 }
 lines(cartId){return this.store.find("cartLines",x=>x.cartId===cartId&&x.status==="ACTIVE");}
}
