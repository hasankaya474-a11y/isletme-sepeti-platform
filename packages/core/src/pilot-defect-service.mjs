import {newId} from "./id.mjs";
const STATES=new Set(["OPEN","IN_PROGRESS","RESOLVED","VERIFIED","WONT_FIX"]);
export class PilotDefectService{
 constructor(store){this.store=store;}
 create({severity,title,evidenceRef=null,actorId}){if(!["LOW","MEDIUM","HIGH","CRITICAL"].includes(severity)||!title||!actorId)throw new TypeError("PILOT_DEFECT_FIELDS_REQUIRED");const now=new Date().toISOString(),row={id:newId("defect"),severity,title,status:"OPEN",evidenceRef,createdAt:now,updatedAt:now};this.store.insert("audit",{id:newId("audit"),actorId,action:"pilot.defect.create",resourceType:"pilot_defect",resourceId:row.id,occurredAt:now});return this.store.insert("pilotDefects",row);}
 transition({id,to,actorId}){if(!STATES.has(to)||!actorId)throw new Error("PILOT_DEFECT_STATE_INVALID");const now=new Date().toISOString();const row=this.store.update("pilotDefects",id,x=>({...x,status:to,updatedAt:now}));this.store.insert("audit",{id:newId("audit"),actorId,action:"pilot.defect."+to.toLowerCase(),resourceType:"pilot_defect",resourceId:id,occurredAt:now});return row;}
 openBlockers(){return this.store.find("pilotDefects",x=>["OPEN","IN_PROGRESS","RESOLVED"].includes(x.status)&&["HIGH","CRITICAL"].includes(x.severity));}
}