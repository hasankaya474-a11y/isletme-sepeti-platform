import {newId} from "./id.mjs";

export class RfqService{
  constructor(store){this.store=store;}

  create({businessId,title,note=null,actorId}){
    if(!businessId||!title||!actorId) throw new TypeError("RFQ_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("rfq"),businessId,title,note,status:"DRAFT",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.create",resourceType:"rfq",resourceId:row.id,occurredAt:now});
    return this.store.insert("rfqs",row);
  }

  assertOwn({id,businessId}){
    const rfq=this.store.get("rfqs",id);
    if(!rfq||rfq.businessId!==businessId) throw new Error("RFQ_FORBIDDEN");
    return rfq;
  }

  addLine({rfqId,businessId,masterProductId,variantId=null,quantityMilli,unit,note=null,actorId}){
    const rfq=this.assertOwn({id:rfqId,businessId});
    if(rfq.status!=="DRAFT") throw new Error("RFQ_NOT_EDITABLE");
    if(!this.store.get("masterProducts",masterProductId)) throw new Error("MASTER_PRODUCT_NOT_FOUND");
    if(!Number.isSafeInteger(quantityMilli)||quantityMilli<=0||!unit) throw new TypeError("RFQ_LINE_INVALID");
    const now=new Date().toISOString();
    const row={id:newId("rfqline"),rfqId,masterProductId,variantId,quantityMilli,unit,note,createdAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.line.add",resourceType:"rfq",resourceId:rfqId,occurredAt:now});
    return this.store.insert("rfqLines",row);
  }

  inviteSupplier({rfqId,businessId,supplierId,actorId}){
    const rfq=this.assertOwn({id:rfqId,businessId});
    if(rfq.status!=="DRAFT") throw new Error("RFQ_NOT_EDITABLE");
    if(!this.store.get("suppliers",supplierId)) throw new Error("SUPPLIER_NOT_FOUND");
    if(this.store.find("rfqInvitations",x=>x.rfqId===rfqId&&x.supplierId===supplierId).length) throw new Error("RFQ_SUPPLIER_ALREADY_INVITED");
    const now=new Date().toISOString();
    const row={id:newId("rfqinv"),rfqId,supplierId,status:"INVITED",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.supplier.invite",resourceType:"rfq",resourceId:rfqId,occurredAt:now});
    return this.store.insert("rfqInvitations",row);
  }

  open({rfqId,businessId,actorId}){
    const rfq=this.assertOwn({id:rfqId,businessId});
    if(rfq.status!=="DRAFT") throw new Error("RFQ_STATE_INVALID");
    if(!this.store.find("rfqLines",x=>x.rfqId===rfqId).length) throw new Error("RFQ_LINES_REQUIRED");
    if(!this.store.find("rfqInvitations",x=>x.rfqId===rfqId).length) throw new Error("RFQ_INVITATIONS_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("rfqs",rfqId,x=>({...x,status:"OPEN",updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.open",resourceType:"rfq",resourceId:rfqId,occurredAt:now});
    return row;
  }
}
