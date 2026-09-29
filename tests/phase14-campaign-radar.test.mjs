import test from "node:test";import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {CampaignService} from "../packages/core/src/campaign-service.mjs";
import {MarketRadarService} from "../packages/core/src/market-radar-service.mjs";

test("campaign visibility is explicitly sponsored",()=>{const s=new MemoryStore(),svc=new CampaignService(s);const c=svc.create({name:"Ürün",campaignType:"SPONSORED_PRODUCT",actorId:"admin"});const p=svc.addPlacement({campaignId:c.id,surface:"SEARCH",slotKey:"top-1",actorId:"admin"});assert.equal(p.sponsoredLabel,"Sponsorlu");});
test("market radar records observation only",()=>{const s=new MemoryStore(),radar=new MarketRadarService(s);radar.record({observationType:"PRICE_SIGNAL",subjectType:"product",subjectId:"p",metricKey:"median_price_minor",metricValue:12500});assert.equal(s.find("radarObservations",()=>true).length,1);assert.equal(s.find("supplierOfferPrices",()=>true).length,0);assert.equal(s.find("orders",()=>true).length,0);});