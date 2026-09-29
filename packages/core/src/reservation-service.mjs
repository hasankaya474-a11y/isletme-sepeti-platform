import {newId} from "./id.mjs";

const FINAL=new Set(["RELEASED","COMMITTED","EXPIRED","CANCELLED"]);

export class ReservationService{
  constructor(store){this.store=store;}

  reserve({balanceId,ownerType,ownerId,quantity,actorId,expiresAt=null}){
    if(!actorId||!ownerId||!ownerType) throw new TypeError("RESERVATION_FIELDS_REQUIRED");
    if(typeof quantity!=="number"||!Number.isFinite(quantity)||quantity<=0) throw new TypeError("INVALID_RESERVATION_QUANTITY");
    const balance=this.store.get("stockBalances",balanceId);
    if(!balance) throw new Error("STOCK_BALANCE_NOT_FOUND");
    const available=balance.onHandQty-balance.reservedQty;
    if(quantity>available) throw new Error("INSUFFICIENT_AVAILABLE_STOCK");
    const now=new Date().toISOString();
    const reservation={id:newId("reservation"),stockBalanceId:balanceId,ownerType,ownerId,quantity,status:"ACTIVE",expiresAt,createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("stockReservations",reservation);
    this.store.update("stockBalances",balanceId,x=>({...x,reservedQty:x.reservedQty+quantity,version:x.version+1,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"stock.reservation.create",resourceType:"stock_reservation",resourceId:reservation.id,occurredAt:now});
    return reservation;
  }

  release({id,actorId,to="RELEASED"}){
    if(!actorId||!FINAL.has(to)||to==="COMMITTED") throw new Error("RESERVATION_RELEASE_STATE_INVALID");
    const current=this.store.get("stockReservations",id);
    if(!current) throw new Error("RESERVATION_NOT_FOUND");
    if(current.status!=="ACTIVE") throw new Error("RESERVATION_NOT_ACTIVE");
    const now=new Date().toISOString();
    this.store.update("stockBalances",current.stockBalanceId,x=>({...x,reservedQty:x.reservedQty-current.quantity,version:x.version+1,updatedAt:now}));
    const row=this.store.update("stockReservations",id,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"stock.reservation."+to.toLowerCase(),resourceType:"stock_reservation",resourceId:id,occurredAt:now});
    return row;
  }

  commit({id,actorId}){
    if(!actorId) throw new TypeError("ACTOR_REQUIRED");
    const current=this.store.get("stockReservations",id);
    if(!current) throw new Error("RESERVATION_NOT_FOUND");
    if(current.status!=="ACTIVE") throw new Error("RESERVATION_NOT_ACTIVE");
    const balance=this.store.get("stockBalances",current.stockBalanceId);
    if(!balance||balance.onHandQty<current.quantity||balance.reservedQty<current.quantity) throw new Error("RESERVATION_COMMIT_CONFLICT");
    const now=new Date().toISOString();
    this.store.update("stockBalances",current.stockBalanceId,x=>({...x,onHandQty:x.onHandQty-current.quantity,reservedQty:x.reservedQty-current.quantity,version:x.version+1,updatedAt:now}));
    this.store.insert("stockMovements",{id:newId("stockmove"),stockBalanceId:current.stockBalanceId,movementType:"ORDER_COMMIT",quantity:current.quantity,referenceType:current.ownerType,referenceId:current.ownerId,actorId,createdAt:now});
    const row=this.store.update("stockReservations",id,x=>({...x,status:"COMMITTED",updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"stock.reservation.committed",resourceType:"stock_reservation",resourceId:id,occurredAt:now});
    return row;
  }
}
