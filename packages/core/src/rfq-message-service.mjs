import {newId} from "./id.mjs";

export class RfqMessageService{
  constructor(store){this.store=store;}

  assertParticipant({rfqId,organizationType,organizationId}){
    const rfq=this.store.get("rfqs",rfqId);
    if(!rfq) throw new Error("RFQ_NOT_FOUND");
    if(organizationType==="BUSINESS"&&rfq.businessId===organizationId) return rfq;
    if(organizationType==="SUPPLIER"&&this.store.find("rfqInvitations",x=>x.rfqId===rfqId&&x.supplierId===organizationId).length) return rfq;
    if(organizationType==="PLATFORM") return rfq;
    throw new Error("RFQ_MESSAGE_FORBIDDEN");
  }

  post({rfqId,organizationType,organizationId,body,actorId,messageType="TEXT"}){
    this.assertParticipant({rfqId,organizationType,organizationId});
    if(!actorId||!body?.trim()||!["TEXT","SYSTEM"].includes(messageType)) throw new TypeError("RFQ_MESSAGE_INVALID");
    const now=new Date().toISOString();
    const row={id:newId("rfqmsg"),rfqId,senderOrgType:organizationType,senderOrgId:organizationId,senderUserId:actorId,body:body.trim(),messageType,createdAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.message.post",resourceType:"rfq",resourceId:rfqId,occurredAt:now});
    return this.store.insert("rfqMessages",row);
  }

  list({rfqId,organizationType,organizationId}){
    this.assertParticipant({rfqId,organizationType,organizationId});
    return this.store.find("rfqMessages",x=>x.rfqId===rfqId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt));
  }
}
