import {newId} from "./id.mjs";
export class LocationPilotService{
 constructor(store){this.store=store;}
 record({pilotEnrollmentId,deliveryId,latitude,longitude,accuracyMeters=null,capturedAt,actorId}){
  const enrollment=this.store.get("pilotEnrollments",pilotEnrollmentId);
  if(!enrollment||enrollment.status!=="ACTIVE"||!enrollment.locationConsent)throw new Error("LOCATION_CONSENT_REQUIRED");
  if(!deliveryId||!actorId||typeof latitude!=="number"||latitude<-90||latitude>90||typeof longitude!=="number"||longitude<-180||longitude>180)throw new TypeError("LOCATION_SAMPLE_INVALID");
  const row={id:newId("location"),pilotEnrollmentId,deliveryId,latitude,longitude,accuracyMeters,capturedAt:capturedAt??new Date().toISOString(),createdAt:new Date().toISOString()};
  this.store.insert("audit",{id:newId("audit"),actorId,action:"pilot.location.record",resourceType:"location_sample",resourceId:row.id,occurredAt:row.createdAt});
  return this.store.insert("locationSamples",row);
 }
}