import {createHash} from "node:crypto";
import {newId} from "./id.mjs";
import {calculateTax} from "./money-tax-service.mjs";

const lineNet=x=>Math.round((x.unitPriceMinor*x.quantityMilli)/1000);
const stableJson=value=>JSON.stringify(value);

export class OrderCreationService{
 constructor(store){this.store=store;}

 createFromRequisition({requisitionId,businessId,idempotencyKey,actorId}){
  if(!requisitionId||!businessId||!idempotencyKey||!actorId)throw new TypeError("ORDER_CREATE_FIELDS_REQUIRED");
  const existing=this.store.find("idempotencyRecords",x=>x.scopeType==="BUSINESS"&&x.scopeId===businessId&&x.idempotencyKey===idempotencyKey&&x.operation==="order.create_from_requisition")[0];
  if(existing)return {...structuredClone(existing.response),idempotentReplay:true};

  const req=this.store.get("purchaseRequisitions",requisitionId);
  if(!req||req.businessId!==businessId)throw new Error("REQUISITION_FORBIDDEN");
  if(req.status!=="PO_READY")throw new Error("REQUISITION_NOT_PO_READY");
  if(this.store.find("orders",x=>x.requisitionId===requisitionId).length)throw new Error("REQUISITION_ALREADY_ORDERED");

  const lines=this.store.find("cartLines",x=>x.cartId===req.cartId&&x.status==="ACTIVE");
  if(!lines.length||lines.some(x=>!x.supplierId))throw new Error("ORDER_LINES_INVALID");
  if(lines.some(x=>x.currency!==req.currency))throw new Error("ORDER_CURRENCY_MISMATCH");

  const groups=new Map();
  for(const line of lines){if(!groups.has(line.supplierId))groups.set(line.supplierId,[]);groups.get(line.supplierId).push(line);}
  const now=new Date().toISOString(),orders=[];

  for(const [supplierId,group] of groups){
   let netMinor=0,taxMinor=0;
   const prepared=group.map(line=>{const totals=calculateTax({netMinor:lineNet(line),taxRateBps:line.taxRateBps});netMinor+=totals.netMinor;taxMinor+=totals.taxMinor;return {line,totals};});
   const order={id:newId("order"),businessId,supplierId,requisitionId,state:"NEW",currency:req.currency,netMinor,taxMinor,grossMinor:netMinor+taxMinor,createdBy:actorId,createdAt:now,updatedAt:now};
   this.store.insert("orders",order);
   const snapshotLines=[];
   for(const {line,totals} of prepared){
    const ol={id:newId("orderline"),orderId:order.id,masterProductId:line.masterProductId,variantId:line.variantId??null,supplierOfferId:line.supplierOfferId??null,sourceQuoteLineId:line.sourceQuoteLineId??null,quantityMilli:line.quantityMilli,unitPriceMinor:line.unitPriceMinor,taxRateBps:line.taxRateBps,netMinor:totals.netMinor,taxMinor:totals.taxMinor,grossMinor:totals.grossMinor,createdAt:now};
    this.store.insert("orderLines",ol);snapshotLines.push(ol);
   }
   const snapshot={orderId:order.id,businessId,supplierId,requisitionId,currency:order.currency,netMinor,taxMinor,grossMinor:order.grossMinor,lines:snapshotLines.map(({id,createdAt,...x})=>x)};
   const json=stableJson(snapshot),hash=createHash("sha256").update(json).digest("hex");
   this.store.insert("orderSnapshots",{id:newId("ordersnap"),orderId:order.id,snapshot, snapshotSha256:hash,createdAt:now});
   this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"order",aggregateId:order.id,eventType:"order.created",payload:{orderId:order.id,businessId,supplierId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
   orders.push(order);
  }

  const response={orderIds:orders.map(x=>x.id),requisitionId};
  this.store.insert("idempotencyRecords",{id:newId("idem"),scopeType:"BUSINESS",scopeId:businessId,idempotencyKey,operation:"order.create_from_requisition",resourceType:"order_batch",response,createdAt:now});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"order.create_from_requisition",resourceType:"requisition",resourceId:requisitionId,occurredAt:now});
  return {...response,idempotentReplay:false};
 }
}
