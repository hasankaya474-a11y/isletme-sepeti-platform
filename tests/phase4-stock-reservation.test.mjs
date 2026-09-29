import test from "node:test";
import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {StockService} from "../packages/core/src/stock-service.mjs";
import {ReservationService} from "../packages/core/src/reservation-service.mjs";

function fixture(){
  const s=new MemoryStore();
  s.insert("supplierOffers",{id:"offer1",supplierId:"supplier1",masterProductId:"p1",offerStatus:"ACTIVE"});
  const stock=new StockService(s);
  const location=stock.createLocation({organizationId:"supplier1",name:"Ana Depo",actorId:"admin"});
  const balance=stock.ensureBalance({stockLocationId:location.id,supplierOfferId:"offer1",actorId:"admin"});
  stock.receive({balanceId:balance.id,quantity:10,actorId:"admin"});
  return {s,stock,balanceId:balance.id,reservations:new ReservationService(s)};
}

test("reservation reduces availability without reducing physical on-hand",()=>{
  const {s,stock,balanceId,reservations}=fixture();
  reservations.reserve({balanceId,ownerType:"CART",ownerId:"cart1",quantity:4,actorId:"buyer1"});
  const balance=s.get("stockBalances",balanceId);
  assert.equal(balance.onHandQty,10);
  assert.equal(balance.reservedQty,4);
  assert.equal(stock.available(balanceId),6);
});

test("reservation cannot exceed available stock",()=>{
  const {balanceId,reservations}=fixture();
  assert.throws(()=>reservations.reserve({balanceId,ownerType:"CART",ownerId:"cart1",quantity:11,actorId:"buyer1"}),/INSUFFICIENT_AVAILABLE_STOCK/);
});

test("commit consumes on-hand and reserved exactly once",()=>{
  const {s,balanceId,reservations}=fixture();
  const r=reservations.reserve({balanceId,ownerType:"ORDER",ownerId:"order1",quantity:3,actorId:"buyer1"});
  reservations.commit({id:r.id,actorId:"system"});
  const balance=s.get("stockBalances",balanceId);
  assert.equal(balance.onHandQty,7);
  assert.equal(balance.reservedQty,0);
  assert.throws(()=>reservations.commit({id:r.id,actorId:"system"}),/RESERVATION_NOT_ACTIVE/);
});
