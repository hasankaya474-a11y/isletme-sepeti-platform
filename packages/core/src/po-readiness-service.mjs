export class PoReadinessService{
 constructor(store){this.store=store;}
 evaluate({requisitionId,businessId}){
  const req=this.store.get("purchaseRequisitions",requisitionId);if(!req||req.businessId!==businessId)throw new Error("REQUISITION_FORBIDDEN");
  const lines=this.store.find("cartLines",x=>x.cartId===req.cartId&&x.status==="ACTIVE");
  const blockers=[];
  if(req.status!=="APPROVED")blockers.push("REQUISITION_NOT_APPROVED");
  if(!lines.length)blockers.push("CART_LINES_REQUIRED");
  if(lines.some(x=>!x.supplierId))blockers.push("SUPPLIER_SELECTION_REQUIRED");
  const currencies=new Set(lines.map(x=>x.currency));if(currencies.size>1)blockers.push("CURRENCY_MISMATCH");
  const supplierGroups=[...new Set(lines.map(x=>x.supplierId))].sort().map(supplierId=>({supplierId,lineIds:lines.filter(x=>x.supplierId===supplierId).map(x=>x.id)}));
  return {ready:blockers.length===0,blockers,supplierGroups,createsOrder:false};
 }
}
