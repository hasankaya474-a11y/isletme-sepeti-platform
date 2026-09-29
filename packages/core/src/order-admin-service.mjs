export class OrderAdminService{
 constructor(store){this.store=store;}
 list({state=null}={}){return this.store.find("orders",x=>!state||x.state===state);}
 failedOutbox(){return this.store.find("outboxEvents",x=>x.status==="FAILED");}
}
