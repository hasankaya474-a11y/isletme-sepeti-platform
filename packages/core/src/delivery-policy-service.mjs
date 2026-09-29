import {newId} from "./id.mjs";

const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);

function assertState(to){if(!STATES.has(to)) throw new Error("DELIVERY_STATE_INVALID");}

export class DeliveryPolicyService{
  constructor(store){this.store=store;}

  createZone({organizationId,name,zoneCode,rules={},actorId}){
    if(!organizationId||!name||!zoneCode||!actorId) throw new TypeError("DELIVERY_ZONE_FIELDS_REQUIRED");
    if(this.store.find("deliveryZones",x=>x.organizationId===organizationId&&x.zoneCode===zoneCode).length) throw new Error("DELIVERY_ZONE_DUPLICATE");
    const now=new Date().toISOString();
    const row={id:newId("delzone"),organizationId,name,zoneCode,status:"DRAFT",rules,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.zone.create",resourceType:"delivery_zone",resourceId:row.id,occurredAt:now});
    return this.store.insert("deliveryZones",row);
  }

  createCalendar({organizationId,name,timezone,weeklySchedule={},exceptionDays=[],actorId}){
    if(!organizationId||!name||!timezone||!actorId) throw new TypeError("DELIVERY_CALENDAR_FIELDS_REQUIRED");
    const now=new Date().toISOString();
    const row={id:newId("delcal"),organizationId,name,timezone,weeklySchedule,exceptionDays,status:"DRAFT",createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.calendar.create",resourceType:"delivery_calendar",resourceId:row.id,occurredAt:now});
    return this.store.insert("deliveryCalendars",row);
  }

  createSla({organizationId,name,deliveryZoneId=null,deliveryCalendarId=null,cutoffLocalTime=null,minLeadMinutes,maxLeadMinutes=null,actorId}){
    if(!organizationId||!name||!actorId||!Number.isInteger(minLeadMinutes)||minLeadMinutes<0) throw new TypeError("DELIVERY_SLA_FIELDS_REQUIRED");
    if(maxLeadMinutes!==null&&(!Number.isInteger(maxLeadMinutes)||maxLeadMinutes<minLeadMinutes)) throw new TypeError("DELIVERY_SLA_RANGE_INVALID");
    const now=new Date().toISOString();
    const row={id:newId("delsla"),organizationId,name,deliveryZoneId,deliveryCalendarId,cutoffLocalTime,minLeadMinutes,maxLeadMinutes,status:"DRAFT",createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery.sla.create",resourceType:"delivery_sla",resourceId:row.id,occurredAt:now});
    return this.store.insert("deliverySlas",row);
  }

  transition({table,id,to,actorId}){
    if(!actorId) throw new TypeError("ACTOR_REQUIRED");
    assertState(to);
    const allowed=new Set(["deliveryZones","deliveryCalendars","deliverySlas"]);
    if(!allowed.has(table)) throw new Error("DELIVERY_RESOURCE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update(table,id,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"delivery."+to.toLowerCase(),resourceType:table,resourceId:id,occurredAt:now});
    return row;
  }
}
