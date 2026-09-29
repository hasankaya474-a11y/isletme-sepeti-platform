import {newId} from "./id.mjs";
import {normalizeCurrency,assertMinorUnits} from "./money-tax-service.mjs";

export class QuoteService{
  constructor(store){this.store=store;}

  createDraft({rfqId,supplierId,currency="TRY",note=null,validUntil=null,actorId}){
    if(!rfqId||!supplierId||!actorId) throw new TypeError("QUOTE_FIELDS_REQUIRED");
    const rfq=this.store.get("rfqs",rfqId);
    if(!rfq||rfq.status!=="OPEN") throw new Error("RFQ_NOT_OPEN");
    const inv=this.store.find("rfqInvitations",x=>x.rfqId===rfqId&&x.supplierId===supplierId)[0];
    if(!inv) throw new Error("RFQ_INVITATION_REQUIRED");
    if(this.store.find("quotes",x=>x.rfqId===rfqId&&x.supplierId===supplierId).length) throw new Error("QUOTE_ALREADY_EXISTS");
    const now=new Date().toISOString();
    const row={id:newId("quote"),rfqId,supplierId,status:"DRAFT",currency:normalizeCurrency(currency),note,validUntil,createdBy:actorId,createdAt:now,updatedAt:now};
    return this.store.insert("quotes",row);
  }

  getOwn({id,supplierId}){
    const q=this.store.get("quotes",id);
    if(!q||q.supplierId!==supplierId) throw new Error("QUOTE_FORBIDDEN");
    return q;
  }

  addLine({quoteId,supplierId,rfqLineId,unitPriceMinor,taxRateBps=0,note=null,actorId}){
    const quote=this.getOwn({id:quoteId,supplierId});
    if(quote.status!=="DRAFT") throw new Error("QUOTE_NOT_EDITABLE");
    const line=this.store.get("rfqLines",rfqLineId);
    if(!line||line.rfqId!==quote.rfqId) throw new Error("RFQ_LINE_INVALID");
    assertMinorUnits(unitPriceMinor);
    if(!Number.isInteger(taxRateBps)||taxRateBps<0||taxRateBps>10000) throw new TypeError("INVALID_TAX_RATE");
    if(this.store.find("quoteLines",x=>x.quoteId===quoteId&&x.rfqLineId===rfqLineId).length) throw new Error("QUOTE_LINE_DUPLICATE");
    return this.store.insert("quoteLines",{id:newId("quoteline"),quoteId,rfqLineId,unitPriceMinor,taxRateBps,note,createdAt:new Date().toISOString()});
  }

  submit({quoteId,supplierId,actorId}){
    const quote=this.getOwn({id:quoteId,supplierId});
    if(quote.status!=="DRAFT") throw new Error("QUOTE_STATE_INVALID");
    if(!this.store.find("quoteLines",x=>x.quoteId===quoteId).length) throw new Error("QUOTE_LINES_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("quotes",quoteId,x=>({...x,status:"SUBMITTED",updatedAt:now}));
    const inv=this.store.find("rfqInvitations",x=>x.rfqId===quote.rfqId&&x.supplierId===supplierId)[0];
    if(inv)this.store.update("rfqInvitations",inv.id,x=>({...x,status:"RESPONDED",updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"quote.submit",resourceType:"quote",resourceId:quoteId,occurredAt:now});
    return row;
  }
}
