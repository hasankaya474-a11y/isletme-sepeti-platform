export class CommercialEvidenceFacade{
 constructor(store,evidence){this.store=store;this.evidence=evidence;}
 attachInvoice({invoiceId,organizationType,organizationId,evidenceType,mediaAssetId=null,evidenceSha256=null,metadata={},actorId}){
  const inv=this.store.get("supplierInvoices",invoiceId);if(!inv)throw new Error("INVOICE_NOT_FOUND");
  const allowed=(organizationType==="SUPPLIER"&&inv.supplierId===organizationId)||(organizationType==="BUSINESS"&&inv.businessId===organizationId)||organizationType==="PLATFORM";
  if(!allowed)throw new Error("EVIDENCE_FORBIDDEN");
  return this.evidence.attach({entityType:"invoice",entityId:invoiceId,evidenceType,mediaAssetId,evidenceSha256,metadata,actorId});
 }
 attachAgreement({agreementId,organizationType,organizationId,evidenceType,mediaAssetId=null,evidenceSha256=null,metadata={},actorId}){
  const a=this.store.get("commercialAgreements",agreementId);if(!a)throw new Error("AGREEMENT_NOT_FOUND");
  const allowed=(organizationType==="SUPPLIER"&&a.supplierId===organizationId)||(organizationType==="BUSINESS"&&a.businessId===organizationId)||organizationType==="PLATFORM";
  if(!allowed)throw new Error("EVIDENCE_FORBIDDEN");
  return this.evidence.attach({entityType:"agreement",entityId:agreementId,evidenceType,mediaAssetId,evidenceSha256,metadata,actorId});
 }
}
