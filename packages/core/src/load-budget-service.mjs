import {newId} from "./id.mjs";
export class LoadBudgetService{
 constructor(store){this.store=store;}
 evaluate({scenarioKey,targetRps,observedRps,p95Ms,errorRate,maxP95Ms,maxErrorRate,actorId,evidence={}}){if(!scenarioKey||!actorId||targetRps<=0)throw new TypeError("LOAD_FIELDS_REQUIRED");const pass=observedRps>=targetRps&&p95Ms<=maxP95Ms&&errorRate<=maxErrorRate;const row={id:newId("loadtest"),scenarioKey,targetRps,observedRps,p95Ms,errorRate,status:pass?"PASS":"FAIL",evidence,createdBy:actorId,createdAt:new Date().toISOString()};return this.store.insert("loadTestResults",row);}
}