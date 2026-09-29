export class DisputeService{
  constructor(cases){this.cases=cases;}
  open({organizationId,requesterId,subject,referenceType,referenceId,priority="HIGH",slaDueAt=null,actorId}){
    if(!referenceType||!referenceId) throw new TypeError("DISPUTE_REFERENCE_REQUIRED");
    return this.cases.create({caseType:"DISPUTE",organizationId,requesterId,subject,priority,referenceType,referenceId,slaDueAt,actorId});
  }
}