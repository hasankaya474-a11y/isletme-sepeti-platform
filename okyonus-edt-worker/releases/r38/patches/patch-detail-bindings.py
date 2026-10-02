from pathlib import Path
import sys,re
p=Path(sys.argv[1] if len(sys.argv)>1 else 'final/zaman.mjs');s=p.read_text()
helper=r'''
const dailyMessageReplySchema=new WeakMap();
async function dailyDetailEnvironment(env,kind){
 const table=kind==='photo'?'photo_inquiries':'inquiries';
 const candidates=[...new Set([env.ADMIN_DB,env.DB,env.COMMERCE_DB,env['Veritabanı'],env['Veritabani'],env['Veritabanı1']].filter(Boolean))];let DB=null;
 for(const candidate of candidates){if(await candidate.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").bind(table).first()){DB=candidate;break}}
 if(!DB)throw http(503,kind==='photo'?'PHOTO_SOURCE_NOT_READY':'MESSAGE_SOURCE_NOT_READY');
 if(kind!=='photo'){
  if(!dailyMessageReplySchema.has(DB)){
   const setup=(async()=>{await DB.prepare("CREATE TABLE IF NOT EXISTS inquiry_replies(id TEXT PRIMARY KEY,inquiry_id TEXT NOT NULL,author_id TEXT,channel TEXT NOT NULL DEFAULT 'email',recipient TEXT,subject TEXT,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'draft',created_at TEXT NOT NULL)").run();await DB.prepare("CREATE INDEX IF NOT EXISTS idx_inquiry_replies_inquiry ON inquiry_replies(inquiry_id)").run()})();
   dailyMessageReplySchema.set(DB,setup);try{await setup}catch(e){dailyMessageReplySchema.delete(DB);throw e}
  }else await dailyMessageReplySchema.get(DB);
 }
 return {...env,DB,OKY_AUTH_AUDIT_DB:env.OKY_AUTH_AUDIT_DB||env.DB};
}
'''
s=s.replace('    async function messageCenterRoute(request, env, auth, headers, id, action, url) {',helper+'\n    async function messageCenterRoute(request, env, auth, headers, id, action, url) {',1)
for name,kind in [('messageCenterRoute','contact'),('photoMessageRouteV2','photo'),('photoMessageRoute','photo')]:
 pattern=r'(async function '+name+r'\([^\n]+\{\n\s*if\s*\([^\n]+throw http\(403,\s*[\x27\x22]FORBIDDEN[\x27\x22]\);)'
 s,n=re.subn(pattern,lambda m:m.group(1)+"\n      env=await dailyDetailEnvironment(env,'"+kind+"');",s,count=1)
 if n!=1:raise RuntimeError('Route insertion missing '+name)
s=s.replace("const view=String(url.searchParams.get('view')||'summary');", "const view=String(url.searchParams.get('view')||'summary');\n      if(view==='messages'||view==='photo-messages')env=await dailyDetailEnvironment(env,view==='photo-messages'?'photo':'contact');",1)
start=s.index('    async function audit(env, e) {');end=s.index('\n    }',start)
section=s[start:end].replace('await env.DB.prepare(', 'await (env.OKY_AUTH_AUDIT_DB||env.DB).prepare(',1);s=s[:start]+section+s[end:]
out=Path(sys.argv[2] if len(sys.argv)>2 else 'work/zaman-details-test.mjs');out.write_text(s);print(out)
