export class ProductCardService{
  constructor(store){this.store=store;}
  build(masterProductId){
    const product=this.store.get("masterProducts",masterProductId);
    if(!product||product.status!=="PUBLISHED") throw new Error("PRODUCT_NOT_AVAILABLE");
    const offers=this.store.find("supplierOffers",x=>x.masterProductId===masterProductId&&x.offerStatus==="ACTIVE");
    const offerIds=new Set(offers.map(x=>x.id));
    const prices=this.store.find("supplierOfferPrices",x=>offerIds.has(x.supplierOfferId)&&x.status==="ACTIVE");
    const tryPrices=prices.filter(x=>x.currency==="TRY").map(x=>x.unitPriceMinor);
    const balances=this.store.find("stockBalances",x=>offerIds.has(x.supplierOfferId));
    const availableQty=balances.reduce((sum,x)=>sum+Math.max(0,(x.onHandQty??0)-(x.reservedQty??0)),0);
    return {
      id:product.id,
      name:product.name,
      productKey:product.productKey,
      baseUnit:product.baseUnit,
      activeOfferCount:offers.length,
      priceRangeTry:tryPrices.length?{minMinor:Math.min(...tryPrices),maxMinor:Math.max(...tryPrices)}:null,
      availableQty,
      supplierSelectionRequired:true
    };
  }
}
