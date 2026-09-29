import {newId} from "./id.mjs";
const STATES=new Set(["DRAFT","REVIEW","ACTIVE","INACTIVE","ARCHIVED"]);

export class SearchAdminService{
  constructor(store){this.store=store;}
  createSynonym({term,synonym,actorId}){
    if(!term||!synonym||!actorId) throw new TypeError("SEARCH_SYNONYM_FIELDS_REQUIRED");
    if(this.store.find("searchSynonyms",x=>x.term===term&&x.synonym===synonym).length) throw new Error("SEARCH_SYNONYM_DUPLICATE");
    const now=new Date().toISOString();
    const row={id:newId("synonym"),term,synonym,status:"DRAFT",createdBy:actorId,createdAt:now,updatedAt:now};
    this.store.insert("audit",{id:newId("audit"),actorId,action:"search.synonym.create",resourceType:"search_synonym",resourceId:row.id,occurredAt:now});
    return this.store.insert("searchSynonyms",row);
  }
  transition({id,to,actorId}){
    if(!actorId||!STATES.has(to)) throw new Error("SEARCH_SYNONYM_STATE_INVALID");
    const now=new Date().toISOString();
    const row=this.store.update("searchSynonyms",id,x=>({...x,status:to,updatedAt:now}));
    this.store.insert("audit",{id:newId("audit"),actorId,action:"search.synonym."+to.toLowerCase(),resourceType:"search_synonym",resourceId:id,occurredAt:now});
    return row;
  }
}
