import {newId} from "./id.mjs";

const STATUSES=new Set(["NEW","OPEN","WAITING_CUSTOMER","WAITING_INTERNAL","RESOLVED","CLOSED"]);
const PRIORITIES=new Set(["LOW","NORMAL","HIGH","URGENT"]);
const TYPES=new Set(["SUPPORT","DISPUTE","CALL_CENTER"]);

export class SupportCaseService{
  constructor(store){this.store=store;}

  create({caseType="SUPPORT",organizationId=null,requesterId=null,subject,priority="NORMAL",referenceType=null,referenceId=null,slaDueAt=null,actorId}){
    if(!subject||!actorId||!TYPES.has(caseType)||!PRIORITIES.has(priority)) throw new TypeError("SUPPORT_CASE_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("case"),caseType,organizationId,requesterId,subject,priority,status:"NEW",referenceType,referenceId,assignedTo:null,slaDueAt,createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"support.case.create",resourceType:"support_case",resourceId:row.id,occurredAt:now});
    return this.store.insert("supportCases",row);
  }

  transition({id,to,actorId}){
    if(!actorId||!STATUSES.has(to)) throw new Error("SUPPORT_CASE_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("supportCases",id,x=>({...x,status:to,updatedAt:now}));
    this.addEvent({caseId:id,eventType:"STATUS_CHANGE",body:to,visibility:"INTERNAL",actorId});
    this.store.insert("audit",{id:newId("audit"),actorId,action:"support.case."+to.toLowerCase(),resourceType:"support_case",resourceId:id,occurredAt:now});
    return row;
  }

  assign({id,assignedTo,actorId}){
    if(!assignedTo||!actorId) throw new TypeError("SUPPORT_ASSIGNMENT_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row=this.store.update("supportCases",id,x=>({...x,assignedTo,updatedAt:now}));
    this.addEvent({caseId:id,eventType:"ASSIGNMENT",body:assignedTo,visibility:"INTERNAL",actorId});
    return row;
  }

  addEvent({caseId,eventType,body=null,visibility="INTERNAL",actorId}){
    if(!caseId||!actorId) throw new TypeError("SUPPORT_EVENT_FIELDS_REQUIRED");
    if(!this.store.get("supportCases",caseId)) throw new Error("SUPPORT_CASE_NOT_FOUND");
    const row={id:newId("caseevent"),supportCaseId:caseId,eventType,body,visibility,actorId,createdAt:new Date().toISOString()};
    return this.store.insert("supportCaseEvents",row);
  }
}
