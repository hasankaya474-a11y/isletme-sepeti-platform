import test from "node:test";import assert from "node:assert/strict";
import {MemoryStore} from "../packages/core/src/memory-store.mjs";
import {MetricDictionaryService} from "../packages/core/src/metric-dictionary-service.mjs";
import {ReportDefinitionService} from "../packages/core/src/report-definition-service.mjs";
import {ReportExportService} from "../packages/core/src/report-export-service.mjs";

test("report requires active metrics and approved filters",()=>{
 const s=new MemoryStore(),metrics=new MetricDictionaryService(s),reports=new ReportDefinitionService(s),exports=new ReportExportService(s);
 const m=metrics.create({metricKey:"gross_sales",name:"Brüt Satış",description:"Sipariş brüt toplamı",unit:"TRY_MINOR",sourceType:"orders",sourceRef:"grossMinor",actorId:"admin"});
 assert.throws(()=>reports.create({reportKey:"sales",name:"Satış",metricKeys:["gross_sales"],allowedFilters:["dateFrom"],actorId:"admin"}),/REPORT_METRIC_INACTIVE/);
 metrics.transition({id:m.id,to:"ACTIVE",actorId:"admin2"});
 const r=reports.create({reportKey:"sales",name:"Satış",metricKeys:["gross_sales"],allowedFilters:["dateFrom"],actorId:"admin"});
 reports.transition({id:r.id,to:"ACTIVE",actorId:"admin2"});
 assert.throws(()=>exports.request({reportDefinitionId:r.id,requestedBy:"u",format:"PDF",filters:{supplierId:"s"}}),/REPORT_FILTER_NOT_ALLOWED/);
 const job=exports.request({reportDefinitionId:r.id,requestedBy:"u",format:"XLSX",filters:{dateFrom:"2026-09-01"}});
 assert.equal(job.status,"QUEUED");
});
