from pathlib import Path
import re,sys
p=Path(sys.argv[1] if len(sys.argv)>1 else 'baseline/zaman.mjs')
s=p.read_text()
api=r'''
const dailyInboxSetup=new WeakMap();
async function dailyInboxEnsure(DB){
 if(dailyInboxSetup.has(DB))return dailyInboxSetup.get(DB);
 const job=DB.prepare("CREATE TABLE IF NOT EXISTS oky_daily_inbox_status_v1(source TEXT NOT NULL,source_id TEXT NOT NULL,status TEXT NOT NULL,actor_id TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')),PRIMARY KEY(source,source_id))").run();
 dailyInboxSetup.set(DB,job);try{await job}catch(e){dailyInboxSetup.delete(DB);throw e}
}
const DAILY_INBOX_SOURCES={contact:{table:'inquiries',name:'name',company:'company',subject:'subject',ref:'id'},photo:{table:'photo_inquiries',name:'contact_name',company:'business_name',subject:"'Fotoğrafla teklif'",ref:'request_no'},quote:{table:'b2b_quotes_v1',name:'contact_name',company:'company_name',subject:"'Ürün teklifi'",ref:'quote_no'}};
async function dailyInboxRoute(request,env,auth,headers,url){
 if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
 const DB=env.COMMERCE_DB||env.ADMIN_DB||env.DB;if(!DB)throw http(503,'DB_NOT_BOUND');
 await dailyInboxEnsure(DB);
 const tables=new Set(((await DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name IN ('inquiries','photo_inquiries','b2b_quotes_v1')").all()).results||[]).map(x=>x.name));
 if(request.method==='POST'){
  if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE');
  const b=await readJson(request),source=String(b.source||''),id=String(b.id||''),status=String(b.status||'');const spec=DAILY_INBOX_SOURCES[source];
  if(!spec||!tables.has(spec.table)||!id||id.length>200||!['NEW','IN_PROGRESS','ANSWERED','COMPLETED'].includes(status))throw http(400,'INVALID_INBOX_STATUS');
  if(!await DB.prepare('SELECT id FROM '+spec.table+' WHERE id=?').bind(id).first())throw http(404,'INBOX_ITEM_NOT_FOUND');
  const before=await DB.prepare('SELECT status FROM oky_daily_inbox_status_v1 WHERE source=? AND source_id=?').bind(source,id).first();
  await DB.prepare("INSERT INTO oky_daily_inbox_status_v1(source,source_id,status,actor_id,updated_at) VALUES(?,?,?,?,datetime('now')) ON CONFLICT(source,source_id) DO UPDATE SET status=excluded.status,actor_id=excluded.actor_id,updated_at=excluded.updated_at").bind(source,id,status,auth.user.id).run();
  await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'DAILY_INBOX_STATUS',entityType:source,entityId:id,before,after:{status}});
  return json({ok:true,status},200,headers);
 }
 if(request.method!=='GET')throw http(405,'METHOD_NOT_ALLOWED');
 const chunks=Object.entries(DAILY_INBOX_SOURCES).filter(([k,v])=>tables.has(v.table)).map(([key,v])=>"SELECT '"+key+"' source,p.id,"+v.ref+" reference,"+v.name+" name,"+v.company+" company,p.phone,"+(key==='photo'?"NULL":"p.email")+" email,"+v.subject+" subject,p.created_at,p.status native_status,COALESCE(s.status,CASE WHEN UPPER(COALESCE(p.status,'NEW')) IN ('WON','LOST','ARCHIVED','COMPLETED','CANCELLED') THEN 'COMPLETED' WHEN UPPER(p.status) IN ('REPLIED','PRICED','QUOTED','ANSWERED','SENT') THEN 'ANSWERED' WHEN UPPER(p.status) IN ('OPENED','READ','CONTACTED','REVIEWING','DELETED','DELETE_PENDING','IN_PROGRESS') THEN 'IN_PROGRESS' ELSE 'NEW' END) status FROM "+v.table+" p LEFT JOIN oky_daily_inbox_status_v1 s ON s.source='"+key+"' AND s.source_id=p.id");
 if(!chunks.length)return json({ok:true,data:[],counts:{NEW:0,IN_PROGRESS:0,ANSWERED:0,COMPLETED:0},total:0,offset:0,limit:50},200,headers);
 const union=chunks.join(' UNION ALL '),counts={NEW:0,IN_PROGRESS:0,ANSWERED:0,COMPLETED:0};
 for(const row of (await DB.prepare('SELECT status,COUNT(*) n FROM ('+union+') GROUP BY status').all()).results||[])counts[row.status]=Number(row.n||0);
 const requested=String(url.searchParams.get('status')||''),source=String(url.searchParams.get('source')||''),term=String(url.searchParams.get('q')||'').slice(0,150);let where=[],params=[];
 if(requested==='WAITING')where.push("status IN ('NEW','IN_PROGRESS')");else if(requested){if(!Object.hasOwn(counts,requested))throw http(400,'INVALID_FILTER');where.push('status=?');params.push(requested)}
 if(source){if(!DAILY_INBOX_SOURCES[source])throw http(400,'INVALID_SOURCE');where.push('source=?');params.push(source)}
 if(term){where.push("(COALESCE(name,'')||' '||COALESCE(company,'')||' '||COALESCE(reference,'')||' '||COALESCE(subject,'')) LIKE ? ESCAPE '\\'");params.push('%'+term.replace(/[\\%_]/g,'\\$&')+'%')}
 const tail=where.length?' WHERE '+where.join(' AND '):'',limit=Math.min(100,Math.max(1,parseInt(url.searchParams.get('limit'),10)||50)),offset=Math.max(0,parseInt(url.searchParams.get('offset'),10)||0);
 const total=Number((await DB.prepare('SELECT COUNT(*) n FROM ('+union+')'+tail).bind(...params).first())?.n||0);
 const rows=(await DB.prepare('SELECT * FROM ('+union+')'+tail+' ORDER BY created_at DESC,source,id LIMIT ? OFFSET ?').bind(...params,limit,offset).all()).results||[];
 return json({ok:true,data:rows,counts,total,limit,offset,canWrite:['owner','admin','editor'].includes(auth.user.role)},200,headers);
}
'''
s=s.replace('async function apiRoute(request, env, auth, headers) {',api+'\nasync function apiRoute(request, env, auth, headers) {',1)
s=s.replace("const resource = parts[1], id = parts[2], action = parts[3];","const resource = parts[1], id = parts[2], action = parts[3];\n      if(resource==='daily-inbox')return dailyInboxRoute(request,env,auth,headers,url);",1)
# Keep all detailed modules accessible under daily groups.
s=s.replace('<nav class="tabs"><button data-r="products"', '<nav class="tabs" id="dailyNav"><button data-daily="control" class="active">Kontrol Merkezi</button><button data-daily="product">Ürünler ve Fiyatlar</button><button data-daily="vitrine">Vitrin</button><button data-daily="inbox">Gelen Kutusu</button><button data-daily="customer">Teklifler / Müşteriler</button><button data-daily="campaign">Kampanyalar</button><button data-daily="settings">Ayarlar</button></nav><nav class="tabs" id="detailNav"><button data-r="products"',1)
s=s.replace("let current='products';","let current='control';",1)
client=r'''
let inboxOffset=0,inboxFilter='WAITING',inboxSource='',inboxSearch='';
const dailyGroups={product:['products','bulk','brands'],vitrine:['opening','categories','banners','sections'],campaign:['campaigns','campaign-rules'],settings:['settings','delivery','media','seo','newsletter','help']};
async function dailyRead(path,opt={}){const r=await fetch('/api/'+path,{credentials:'same-origin',...opt,headers:{'accept':'application/json','content-type':'application/json','X-CSRF-Token':csrfToken()}});let j;try{j=await r.json()}catch{throw Error('Sunucu yanıtı okunamadı.')}if(!r.ok||!j.ok)throw Error(j.error||'İşlem tamamlanamadı');return j}
const inboxLabels={NEW:'Yeni',IN_PROGRESS:'İşlemde',ANSWERED:'Yanıtlandı',COMPLETED:'Tamamlandı'};
async function loadDailyInbox(control=false){
 const j=await dailyRead('daily-inbox?status='+encodeURIComponent(control?'NEW':inboxFilter)+'&source='+encodeURIComponent(inboxSource)+'&q='+encodeURIComponent(inboxSearch)+'&offset='+(control?0:inboxOffset)+'&limit=50');
 stats.innerHTML=Object.entries(j.counts).map(([k,v])=>'<article class="stat"><b>'+v+'</b><span>'+inboxLabels[k]+'</span></article>').join('');
 if(control){content.innerHTML='<h2>Kontrol Merkezi</h2><p>'+j.counts.NEW+' yeni talep • '+(j.counts.NEW+j.counts.IN_PROGRESS)+' yanıt bekleyen talep</p><p>Ürünler ve fiyatlar, vitrin ve müşteri taleplerini üstteki günlük bölümlerden yönetin.</p><button id="openDailyInbox" type="button">Gelen Kutusunu Aç</button>';document.getElementById('openDailyInbox').onclick=()=>document.querySelector('[data-daily="inbox"]').click();return}
 const sourceLabels={contact:'İletişim / Teklif',photo:'Fotoğrafla Teklif',quote:'Ürün Teklifi'};
 content.innerHTML='<h2>Gelen Kutusu</h2><p>Durum iş takibini gösterir. Yanıtlandı seçimi mesaj göndermez. WhatsApp yazışmaları ayrı entegrasyon gerektirir.</p><div class="grid"><label>Durum<select id="inboxFilter"><option value="WAITING">Yanıt bekleyenler</option><option value="">Tümü</option>'+Object.entries(inboxLabels).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select></label><label>Kaynak<select id="inboxSource"><option value="">Tümü</option>'+Object.entries(sourceLabels).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select></label><label>Ara<input id="inboxSearch" value="'+esc(inboxSearch)+'" placeholder="İsim, işletme veya referans"></label><button id="inboxApply" type="button">Filtrele / Yenile</button></div><p>'+j.total+' talep • '+(j.total?inboxOffset+1:0)+'–'+Math.min(j.total,inboxOffset+j.data.length)+'</p><div class="table"><table><thead><tr><th>Tarih</th><th>Kaynak / Referans</th><th>Müşteri</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>'+j.data.map((x,i)=>'<tr><td>'+esc(x.created_at)+'</td><td>'+esc(sourceLabels[x.source])+'<br>'+esc(x.reference)+'</td><td>'+esc(x.name)+'<br>'+esc(x.company)+'<br>'+esc(x.phone||x.email||'')+'</td><td>'+inboxLabels[x.status]+'<br><small>Kaynak: '+esc(x.native_status)+'</small></td><td><a href="'+(x.source==='quote'?'/commerce?quote=':'/?view='+(x.source==='photo'?'photo-messages':'messages')+'&id=')+encodeURIComponent(x.id)+'">Talebi Aç</a>'+(j.canWrite?'<select data-inbox-row="'+i+'">'+Object.entries(inboxLabels).map(([k,v])=>'<option value="'+k+'" '+(k===x.status?'selected':'')+'>'+v+'</option>').join('')+'</select><button type="button" data-inbox-save="'+i+'">Durumu Kaydet</button>':'')+'</td></tr>').join('')+'</tbody></table></div><p id="inboxResult" role="status"></p><button id="inboxPrev" '+(inboxOffset===0?'disabled':'')+'>Önceki</button> <button id="inboxNext" '+(inboxOffset+j.limit>=j.total?'disabled':'')+'>Sonraki</button>';
 document.getElementById('inboxFilter').value=inboxFilter;document.getElementById('inboxSource').value=inboxSource;
 document.getElementById('inboxApply').onclick=()=>{inboxFilter=document.getElementById('inboxFilter').value;inboxSource=document.getElementById('inboxSource').value;inboxSearch=document.getElementById('inboxSearch').value;inboxOffset=0;load().catch(e=>document.getElementById('inboxResult').textContent=e.message)};
 document.getElementById('inboxPrev').onclick=()=>{inboxOffset=Math.max(0,inboxOffset-j.limit);load()};document.getElementById('inboxNext').onclick=()=>{inboxOffset+=j.limit;load()};
 content.querySelectorAll('[data-inbox-save]').forEach(b=>b.onclick=async()=>{const i=Number(b.dataset.inboxSave),x=j.data[i],status=content.querySelector('[data-inbox-row="'+i+'"]').value;b.disabled=true;const out=document.getElementById('inboxResult');try{await dailyRead('daily-inbox',{method:'POST',body:JSON.stringify({source:x.source,id:x.id,status})});out.textContent='Durum kaydedildi ✓';await load()}catch(e){out.textContent='Kaydedilemedi: '+e.message;b.disabled=false}});
}
function setupDailyNav(){document.querySelectorAll('[data-daily]').forEach(b=>b.onclick=async()=>{document.querySelectorAll('[data-daily]').forEach(x=>x.classList.toggle('active',x===b));const group=b.dataset.daily;document.querySelectorAll('#detailNav [data-r]').forEach(x=>x.hidden=!(dailyGroups[group]||[]).includes(x.dataset.r));current=group==='product'?'products':group==='vitrine'?'sections':group==='campaign'?'campaigns':group==='settings'?'settings':group;editingId='';try{await load()}catch(e){content.textContent='Yüklenemedi: '+e.message}});document.querySelectorAll('#detailNav [data-r]').forEach(x=>x.hidden=true)}
setupDailyNav();
'''
# Escape backslashes once because this JS lives inside a template string in the worker.
client=client.replace('\\','\\\\')
client += r'''
async function loadDailyCustomers(){
 const [quotes,customers]=await Promise.all([dailyRead('b2b'),dailyRead('b2b-customers')]);
 content.innerHTML='<h2>Teklifler / Müşteriler</h2><p>Tekliflerin mevcut fiyatlandırma ve sipariş durumları korunur.</p><div class="table"><table><thead><tr><th>Teklif</th><th>Müşteri</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>'+quotes.data.map((q,i)=>'<tr><td>'+esc(q.quote_no)+'</td><td>'+esc(q.company_name)+'</td><td>'+esc(q.status)+'</td><td><button type="button" data-quote-detail="'+i+'">Aç</button></td></tr>').join('')+'</tbody></table></div><div id="dailyQuoteDetail"></div><h3>Müşteriler</h3><div class="table"><table><thead><tr><th>İşletme</th><th>Yetkili</th><th>Telefon</th></tr></thead><tbody>'+customers.data.map(c=>'<tr><td>'+esc(c.company_name)+'</td><td>'+esc(c.contact_name)+'</td><td>'+esc(c.phone)+'</td></tr>').join('')+'</tbody></table></div>';
 content.querySelectorAll('[data-quote-detail]').forEach(b=>b.onclick=()=>showDailyQuote(quotes.data[Number(b.dataset.quoteDetail)].id));
}
async function showDailyQuote(id){
 const box=document.getElementById('dailyQuoteDetail'),j=await dailyRead('b2b/'+encodeURIComponent(id)),q=j.data.quote;box.innerHTML='<h3>'+esc(q.quote_no)+'</h3><p>'+esc(q.company_name)+' • '+esc(q.contact_name)+' • '+esc(q.phone)+' • '+esc(q.email)+'</p><p>'+esc(q.note)+'</p><div class="table"><table><thead><tr><th>Ürün</th><th>Miktar</th><th>Birim fiyat</th></tr></thead><tbody>'+j.data.items.map(x=>'<tr><td>'+esc(x.product_name)+'</td><td>'+esc(x.quantity)+' '+esc(x.unit)+'</td><td>'+esc(x.unit_price??'Fiyat bekleniyor')+'</td></tr>').join('')+'</tbody></table></div><p>Toplam: '+esc(q.total)+' '+esc(q.currency)+'</p>';
}
'''.replace('\\','\\\\')
s=s.replace('async function load(){',client+'\nasync function load(){\n if(current===\'control\'||current===\'inbox\'){await loadDailyInbox(current===\'control\');return}\n if(current===\'customer\'){await loadDailyCustomers();return}\n',1)
s=s.replace('async function boot(){try{await summary();await load()}',"async function boot(){try{const quoteId=new URLSearchParams(location.search).get('quote');if(quoteId){current='customer';await load();await showDailyQuote(quoteId)}else await load()}",1)
out=Path(sys.argv[2] if len(sys.argv)>2 else 'work/zaman-admin-test.mjs');out.write_text(s)
print(out)
