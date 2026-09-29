import {newId} from "./id.mjs";

const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);

export class TaxProfileService{
  constructor(store){this.store=store;}

  create({name,countryCode,taxRateBps,actorId}){
    if(!name||!actorId||typeof countryCode!=="string"||!/^[A-Z]{2}$/.test(countryCode)) throw new TypeError("TAX_PROFILE_FIELDS_REQUIRED");
    if(!Number.isInteger(taxRateBps)||taxRateBps<0||taxRateBps>10000) throw new TypeError("INVALID_TAX_RATE");
    const now=new Date().toISOString();
    const row={id:newId("taxprofile"),name,countryCode,taxRateBps,status:"DRAFT",createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"tax_profile.create",resourceType:"tax_profile",resourceId:row.id,occurredAt:now});
    return this.store.insert("taxProfiles",row);
  }

  transition({id,to,actorId}){
    if(!actorId||!STATES.has(to)) throw new Error("TAX_PROFILE_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("taxProfiles",id,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"tax_profile."+to.toLowerCase(),resourceType:"tax_profile",resourceId:id,occurredAt:now});
    return row;
  }
}
