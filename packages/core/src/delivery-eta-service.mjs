export class DeliveryEtaService{
 constructor(store){this.store=store;}
 get({deliveryId,businessId=null,supplierId=null}){
  const d=this.store.get("deliveries",deliveryId);if(!d)throw new Error("DELIVERY_NOT_FOUND");
  if(businessId&&d.businessId!==businessId)throw new Error("DELIVERY_FORBIDDEN");
  if(supplierId&&d.supplierId!==supplierId)throw new Error("DELIVERY_FORBIDDEN");
  if(d.etaAt)return {etaAt:d.etaAt,source:"SUPPLIER_CONFIRMED"};
  if(d.scheduledEnd)return {etaAt:d.scheduledEnd,source:"SCHEDULE_WINDOW_END"};
  return {etaAt:null,source:"NOT_AVAILABLE"};
 }
}
