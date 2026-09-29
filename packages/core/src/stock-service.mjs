import {newId} from "./id.mjs";

function assertQty(qty){
  if(typeof qty!=="number"||!Number.isFinite(qty)||qty<=0) throw new TypeError("INVALID_STOCK_QUANTITY");
  return qty;
}

export class StockService{
  constructor(store){this.store=store;}

  createLocation({organizationId,name,locationType="WAREHOUSE",actorId}){
    if(!organizationId||!name||!actorId) throw new TypeError("STOCK_LOCATION_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("stockloc"),organizationId,name,locationType,status:"ACTIVE",createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"stock.location.create",resourceType:"stock_location",resourceId:row.id,occurredAt:now});
    return this.store.insert("stockLocations",row);
  }

  ensureBalance({stockLocationId,supplierOfferId,actorId}){
    if(!stockLocationId||!supplierOfferId||!actorId) throw new TypeError("STOCK_BALANCE_FIELDS_REQUIRED");
    const existing=this.store.find("stockBalances",x=>x.stockLocationId===stockLocationId&&x.supplierOfferId===supplierOfferId)[0];
    if(existing) return existing;
    if(!this.store.get("stockLocations",stockLocationId)) throw new Error("STOCK_LOCATION_NOT_FOUND");
    if(!this.store.get("supplierOffers",supplierOfferId)) throw new Error("SUPPLIER_OFFER_NOT_FOUND");
    const now=new Date().toISOString();
    return this.store.insert("stockBalances",{id:newId("stockbal"),stockLocationId,supplierOfferId,onHandQty:0,reservedQty:0,version:1,updatedAt:now});
  }

  receive({balanceId,quantity,actorId,referenceId=null}){
    assertQty(quantity);
    if(!actorId) throw new TypeError("ACTOR_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("stockBalances",balanceId,x=>({...x,onHandQty:x.onHandQty+quantity,version:x.version+1,updatedAt:now}));
    this.store.insert("stockMovements",{id:newId("stockmove"),stockBalanceId:balanceId,movementType:"RECEIPT",quantity,referenceType:"RECEIPT",referenceId,actorId,createdAt:now});
    this.store.insert("audit",{id:newId("audit"),actorId,action:"stock.receive",resourceType:"stock_balance",resourceId:balanceId,occurredAt:now});
    return row;
  }

  available(balanceId){
    const x=this.store.get("stockBalances",balanceId);
    if(!x) throw new Error("STOCK_BALANCE_NOT_FOUND");
    return x.onHandQty-x.reservedQty;
  }
}
