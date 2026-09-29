import {newId} from "./id.mjs";
import {normalizeCurrency,calculateTax,assertMinorUnits} from "./money-tax-service.mjs";

const lineNet=(price,qty)=>Math.round((price*qty)/1000);

export class InvoiceService{
 constructor(store){this.store=store;}
 createDraft({orderId,supplierId,invoiceNumber,issueDate,currency="TRY",actorId}){
  const order=this.store.get("orders",orderId);if(!order||order.supplierId!==supplierId)throw new Error("ORDER_FORBIDDEN");
  if(!invoiceNumber||!issueDate||!actorId)throw new TypeError("INVOICE_FIELDS_REQUIRED");
  const cur=normalizeCurrency(currency);if(cur!==order.currency)throw new Error("INVOICE_CURRENCY_MISMATCH");
  if(this.store.find("supplierInvoices",x=>x.supplierId===supplierId&&x.invoiceNumber===invoiceNumber).length)throw new Error("INVOICE_DUPLICATE");
  const now=new Date().toISOString(),row={id:newId("invoice"),orderId,businessId:order.businessId,supplierId,invoiceNumber,issueDate,currency:cur,status:"DRAFT",netMinor:0,taxMinor:0,grossMinor:0,createdBy:actorId,createdAt:now,updatedAt:now};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"invoice.create",resourceType:"invoice",resourceId:row.id,occurredAt:now});
  return this.store.insert("supplierInvoices",row);
 }
 addLine({invoiceId,supplierId,orderLineId,quantityMilli,unitPriceMinor,taxRateBps,actorId}){
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv||inv.supplierId!==supplierId)throw new Error("INVOICE_FORBIDDEN");
  if(inv.status!=="DRAFT")throw new Error("INVOICE_NOT_EDITABLE");
  const ol=this.store.get("orderLines",orderLineId);if(!ol||ol.orderId!==inv.orderId)throw new Error("ORDER_LINE_INVALID");
  if(!Number.isSafeInteger(quantityMilli)||quantityMilli<=0)throw new TypeError("INVOICE_QUANTITY_INVALID");assertMinorUnits(unitPriceMinor);
  if(!Number.isInteger(taxRateBps)||taxRateBps<0||taxRateBps>10000)throw new TypeError("INVALID_TAX_RATE");
  if(this.store.find("invoiceLines",x=>x.invoiceId===invoiceId&&x.orderLineId===orderLineId).length)throw new Error("INVOICE_LINE_DUPLICATE");
  const totals=calculateTax({netMinor:lineNet(unitPriceMinor,quantityMilli),taxRateBps}),now=new Date().toISOString();
  return this.store.insert("invoiceLines",{id:newId("invline"),invoiceId,orderLineId,quantityMilli,unitPriceMinor,taxRateBps,netMinor:totals.netMinor,taxMinor:totals.taxMinor,grossMinor:totals.grossMinor,createdAt:now});
 }
 submit({invoiceId,supplierId,actorId}){
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv||inv.supplierId!==supplierId)throw new Error("INVOICE_FORBIDDEN");
  if(inv.status!=="DRAFT")throw new Error("INVOICE_STATE_INVALID");
  const lines=this.store.find("invoiceLines",x=>x.invoiceId===invoiceId);if(!lines.length)throw new Error("INVOICE_LINES_REQUIRED");
  const netMinor=lines.reduce((s,x)=>s+x.netMinor,0),taxMinor=lines.reduce((s,x)=>s+x.taxMinor,0),now=new Date().toISOString();
  const row=this.store.update("supplierInvoices",invoiceId,x=>({...x,status:"SUBMITTED",netMinor,taxMinor,grossMinor:netMinor+taxMinor,updatedAt:now}));
  this.store.insert("outboxEvents",{id:newId("outbox"),aggregateType:"invoice",aggregateId:invoiceId,eventType:"invoice.submitted",payload:{invoiceId,orderId:inv.orderId},status:"PENDING",attempts:0,createdAt:now,publishedAt:null,lastError:null});
  this.store.insert("audit",{id:newId("audit"),actorId,action:"invoice.submit",resourceType:"invoice",resourceId:invoiceId,occurredAt:now});return row;
 }
}
