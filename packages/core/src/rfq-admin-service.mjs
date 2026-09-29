import {newId} from "./id.mjs";
export class RfqAdminService{
  constructor(store){this.store=store;}
  list({status=null}={}){return this.store.find("rfqs",x=>!status||x.status===status);}
  transition({rfqId,to,actorId}){
    if(!actorId||!["CLOSED","CANCELLED"].includes(to)) throw new Error("RFQ_ADMIN_STATE_INVALID");
    const current=this.store.get("rfqs",rfqId);if(!current)throw new Error("RFQ_NOT_FOUND");
    if(["CLOSED","CANCELLED"].includes(current.status))throw new Error("RFQ_ALREADY_FINAL");
    const now=new Date().toISOString();
    const row=this.store.update("rfqs",rfqId,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"rfq.admin."+to.toLowerCase(),resourceType:"rfq",resourceId:rfqId,occurredAt:now});
    return row;
  }
}
