from pathlib import Path
import sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'final/zaman.mjs');s=p.read_text()
s=s.replace('async function dailyInboxRoute(request,env,auth,headers,url){','async function dailyInboxSingleDatabaseRoute(request,env,auth,headers,url){',1)
s=s.replace(".filter(([k,v])=>tables.has(v.table)).map(([key,v])", ".filter(([k,v])=>tables.has(v.table)&&(!env.DAILY_INBOX_SOURCES_ALLOWED||env.DAILY_INBOX_SOURCES_ALLOWED.includes(k))).map(([key,v])",1)
wrapper=r'''
async function dailyInboxRoute(request,env,auth,headers,url){
 if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
 // DENIZ contact/photo inserts use ADMIN_DB; member/B2B quotes use DB.
 // Commerce product management may use COMMERCE_DB independently.
 const fallback=env['Veritabanı']||env['Veritabani']||env['Veritabanı1'];
 const databases=[...new Set([env.ADMIN_DB,env.DB,env.COMMERCE_DB,fallback].filter(Boolean))];
 if(!databases.length)throw http(503,'DB_NOT_BOUND');
 const present=new Map();
 for(const DB of databases)present.set(DB,new Set(((await DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('inquiries','photo_inquiries','b2b_quotes_v1')").all()).results||[]).map(x=>x.name)));
 const locations=new Map();
 for(const [source,spec] of Object.entries(DAILY_INBOX_SOURCES)){
  const preference=source==='quote'?[env.DB,env.ADMIN_DB,env.COMMERCE_DB,fallback]:[env.ADMIN_DB,env.DB,env.COMMERCE_DB,fallback];
  const DB=preference.find(db=>db&&present.get(db)?.has(spec.table));if(DB)locations.set(source,DB);
 }
 if(request.method==='POST'){
  if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE');
  const b=await request.clone().json().catch(()=>null);if(!b)throw http(400,'INVALID_JSON');
  const DB=locations.get(String(b.source||''));if(!DB)throw http(404,'INBOX_SOURCE_NOT_FOUND');
  return dailyInboxSingleDatabaseRoute(request,{...env,COMMERCE_DB:DB},auth,headers,url);
 }
 if(request.method!=='GET')throw http(405,'METHOD_NOT_ALLOWED');
 const groups=new Map();for(const [source,DB] of locations){if(!groups.has(DB))groups.set(DB,[]);groups.get(DB).push(source)}
 const limit=Math.min(100,Math.max(1,parseInt(url.searchParams.get('limit'),10)||50)),offset=Math.max(0,parseInt(url.searchParams.get('offset'),10)||0);
 // Single DB retains SQL pagination. Separate DBs merge bounded metadata pages.
 if(groups.size===1){const [DB,allowed]=groups.entries().next().value;return dailyInboxSingleDatabaseRoute(request,{...env,COMMERCE_DB:DB,DAILY_INBOX_SOURCES_ALLOWED:allowed},auth,headers,url)}
 const counts={NEW:0,IN_PROGRESS:0,ANSWERED:0,COMPLETED:0};let rows=[],total=0;
 for(const [DB,allowed] of groups){
  const scoped={...env,COMMERCE_DB:DB,DAILY_INBOX_SOURCES_ALLOWED:allowed};let cursor=0,groupTotal=0;
  do{
   const groupURL=new URL(url);groupURL.searchParams.set('limit','100');groupURL.searchParams.set('offset',String(cursor));
   const response=await dailyInboxSingleDatabaseRoute(request,scoped,auth,headers,groupURL);const j=await response.json();
   if(!response.ok||!j.ok)throw http(response.status,j.error||'INBOX_READ_FAILED');
   if(cursor===0){groupTotal=j.total;total+=groupTotal;for(const key of Object.keys(counts))counts[key]+=j.counts[key]||0}
   rows.push(...j.data);cursor+=j.limit;
  }while(cursor<groupTotal&&cursor<offset+limit);
 }
 rows.sort((a,b)=>String(b.created_at||'').localeCompare(String(a.created_at||''))||String(a.source).localeCompare(String(b.source))||String(a.id).localeCompare(String(b.id)));
 return json({ok:true,data:rows.slice(offset,offset+limit),counts,total,limit,offset,canWrite:['owner','admin','editor'].includes(auth.user.role)},200,headers);
}
'''
s=s.replace('async function dailyInboxSingleDatabaseRoute(request,env,auth,headers,url){',wrapper+'\nasync function dailyInboxSingleDatabaseRoute(request,env,auth,headers,url){',1)
out=Path(sys.argv[2] if len(sys.argv)>2 else 'work/zaman-bindings-test.mjs');out.write_text(s)
print(out)
