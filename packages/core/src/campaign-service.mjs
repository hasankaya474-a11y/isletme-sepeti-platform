import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","REVIEW","SCHEDULED","ACTIVE","PAUSED","ENDED","ARCHIVED"]);
const TYPES=new Set(["SPONSORED_PRODUCT","SPONSORED_SUPPLIER","BANNER","PROMOTION"]);

export class CampaignService{
  constructor(store){this.store=store;}

  create({name,campaignType,ownerOrganizationId=null,startsAt=null,endsAt=null,budgetMinor=null,currency=null,rules={},actorId}){
    if(!name||!actorId||!TYPES.has(campaignType)) throw new TypeError("CAMPAIGN_FIELDS_REQUIRED");
    if(budgetMinor!==null&&(!Number.isSafeInteger(budgetMinor)||budgetMinor<0)) throw new TypeError("CAMPAIGN_BUDGET_INVALID");
    const now=new Date().toISOString();
    const row={id:newId("campaign"),name,campaignType,ownerOrganizationId,status:"DRAFT",startsAt,endsAt,budgetMinor,currency,rules,createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"campaign.create",resourceType:"campaign",resourceId:row.id,occurredAt:now});
    return this.store.insert("campaigns",row);
  }

  transition({id,to,actorId}){
    if(!actorId||!STATES.has(to)) throw new Error("CAMPAIGN_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("campaigns",id,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"campaign."+to.toLowerCase(),resourceType:"campaign",resourceId:id,occurredAt:now});
    return row;
  }

  addPlacement({campaignId,surface,slotKey,sponsoredLabel="Sponsorlu",actorId}){
    if(!campaignId||!surface||!slotKey||!actorId) throw new TypeError("CAMPAIGN_PLACEMENT_FIELDS_REQUIRED");
    const c=this.store.get("campaigns",campaignId);if(!c)throw new Error("CAMPAIGN_NOT_FOUND");
    const row={id:newId("placement"),campaignId,surface,slotKey,sponsoredLabel,status:"ACTIVE",createdAt:new Date().toISOString()};
    return this.store.insert("campaignPlacements",row);
  }
}