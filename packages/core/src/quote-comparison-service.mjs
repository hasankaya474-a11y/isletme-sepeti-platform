import {calculateTax} from "./money-tax-service.mjs";

function lineTotalMinor(unitPriceMinor,quantityMilli){return Math.round((unitPriceMinor*quantityMilli)/1000);}

export class QuoteComparisonService{
  constructor(store){this.store=store;}
  compare({rfqId,businessId}){
    const rfq=this.store.get("rfqs",rfqId);
    if(!rfq||rfq.businessId!==businessId) throw new Error("RFQ_FORBIDDEN");
    const rfqLines=this.store.find("rfqLines",x=>x.rfqId===rfqId);
    const lineMap=new Map(rfqLines.map(x=>[x.id,x]));
    return this.store.find("quotes",x=>x.rfqId===rfqId&&x.status==="SUBMITTED").map(quote=>{
      let netMinor=0,taxMinor=0;
      const lines=this.store.find("quoteLines",x=>x.quoteId===quote.id).map(qLine=>{
        const rfqLine=lineMap.get(qLine.rfqLineId);
        const lineNet=lineTotalMinor(qLine.unitPriceMinor,rfqLine.quantityMilli);
        const totals=calculateTax({netMinor:lineNet,taxRateBps:qLine.taxRateBps});
        netMinor+=totals.netMinor;taxMinor+=totals.taxMinor;
        return {rfqLineId:qLine.rfqLineId,unitPriceMinor:qLine.unitPriceMinor,taxRateBps:qLine.taxRateBps,quantityMilli:rfqLine.quantityMilli,netMinor:totals.netMinor,taxMinor:totals.taxMinor,grossMinor:totals.grossMinor};
      });
      return {quoteId:quote.id,supplierId:quote.supplierId,currency:quote.currency,netMinor,taxMinor,grossMinor:netMinor+taxMinor,lines,selectionRequired:true};
    }).sort((a,b)=>String(a.supplierId).localeCompare(String(b.supplierId)));
  }
}
