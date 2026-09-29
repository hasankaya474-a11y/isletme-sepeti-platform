
export const BUILD = "2026.09.29-sales-v1";
export const ACTIVE_PUBLIC_FEATURES = Object.freeze({
  PRODUCTS:true, QUOTE:true, PHOTO:true, WHATSAPP:true, SEO:true, MEMBERSHIP:true, DIGITAL_MENU:true,
  COST:false, COST_RADAR:false, ACADEMY:false, CESNI:false
});
export const HELP_ACTIVE = Object.freeze(["products","quote","photo","whatsapp","membership","digital-menu"]);
export const DIGITAL_MENU_THEMES = Object.freeze([
  "modern-clean","modern-dark","modern-elegant","modern-fresh","minimal-light","minimal-premium",
  "fine-dining-classic","fine-dining-black","chef-table","elegant-gold","premium-marble",
  "coffee-warm","urban-cafe","artisan-bakery","soft-brunch","street-food-bold","burger-house",
  "fast-casual","neon-snack","seafood-blue","grill-house","fresh-catch","family-table",
  "casual-bistro","homestyle-kitchen","hotel-signature","lounge-menu","event-catering",
  "social-vibe","trend-minimal"
]);
export const DIGITAL_MENU_TEMPLATES = Object.freeze([
  "long-scroll","sectioned-scroll","sticky-category","card-scroll","visual-scroll",
  "category-grid","category-list","left-nav-content","tabbed-category","accordion-category",
  "cover-category","chef-choice","signature-products","photo-heavy","minimal-text",
  "quick-select","compact-list","mobile-quick-order","counter-view","qr-quick-order",
  "beverage-cards","dessert-beverage","coffee-focus","brunch-flow","daily-menu",
  "campaign-menu","seasonal-menu","multilingual-menu","branch-menu","qr-landing"
]);

export function json(data,status=200,extra={}) {
  return new Response(JSON.stringify(data),{status,headers:{
    "content-type":"application/json; charset=utf-8","cache-control":"no-store",
    "x-content-type-options":"nosniff","referrer-policy":"same-origin",...extra
  }});
}
export function html(body,status=200,extra={}) {
  return new Response(body,{status,headers:{
    "content-type":"text/html; charset=utf-8","cache-control":"no-store",
    "x-content-type-options":"nosniff","x-frame-options":"SAMEORIGIN","referrer-policy":"same-origin",...extra
  }});
}
export function clean(v,n=500){ return String(v??"").replace(/\0/g,"").trim().slice(0,n); }
export function esc(v){ return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
export function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v||"")); }
export function validPhone(v){
  const s=String(v||""); const digits=s.replace(/\D/g,"");
  return /^\+?[0-9 ()-]+$/.test(s) && digits.length>=10 && digits.length<=15;
}
export function uuid(){ return crypto.randomUUID(); }
export async function sha256(v){
  const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(String(v)));
  return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("");
}
export function cookieMap(req){
  const out={}; for(const part of String(req.headers.get("cookie")||"").split(";")){
    const i=part.indexOf("="); if(i>0)out[part.slice(0,i).trim()]=part.slice(i+1).trim();
  } return out;
}
export function sameOrigin(req){
  const site=(req.headers.get("sec-fetch-site")||"").toLowerCase();
  if(site==="cross-site")return false;
  if(site==="same-origin")return true;
  try{
    const u=new URL(req.url); const origin=req.headers.get("origin"); const ref=req.headers.get("referer");
    return [origin,ref].filter(Boolean).some(x=>new URL(x).origin===u.origin);
  }catch{return false}
}
export function securityHeaders(){
  return {
    "content-security-policy":"default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'self'; base-uri 'self'; form-action 'self'",
    "permissions-policy":"camera=(self), microphone=(), geolocation=()",
    "x-content-type-options":"nosniff","referrer-policy":"same-origin"
  };
}
export async function readJson(req,max=200000){
  const declared=Number(req.headers.get("content-length")||0); if(declared>max)throw Object.assign(new Error("PAYLOAD_TOO_LARGE"),{status:413});
  let data; try{data=await req.json()}catch{throw Object.assign(new Error("INVALID_JSON"),{status:400})}
  if(!data||typeof data!=="object"||Array.isArray(data))throw Object.assign(new Error("INVALID_JSON"),{status:400});
  return data;
}
export function featureEnabled(env,key){
  const override=env?.[`FEATURE_${key}`];
  if(override!==undefined)return String(override).toLowerCase()==="true";
  return Boolean(ACTIVE_PUBLIC_FEATURES[key]);
}
export function requireDb(env){ if(!env?.DB)throw Object.assign(new Error("DB_NOT_BOUND"),{status:503}); return env.DB; }

export async function ensureCoreSchema(env){
  const db=requireDb(env);
  const q=[
`CREATE TABLE IF NOT EXISTS products(
 id TEXT PRIMARY KEY, sku TEXT, name TEXT NOT NULL, category TEXT NOT NULL, brand TEXT,
 unit TEXT NOT NULL DEFAULT 'Adet', pack_text TEXT, net_qty TEXT, price REAL, price_mode TEXT NOT NULL DEFAULT 'QUOTE',
 stock_status TEXT NOT NULL DEFAULT 'ORDER', image_url TEXT, description TEXT, active INTEGER NOT NULL DEFAULT 1,
 sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS quote_requests(
 id TEXT PRIMARY KEY, quote_no TEXT NOT NULL UNIQUE, name TEXT NOT NULL, business TEXT, phone TEXT NOT NULL, email TEXT NOT NULL,
 note TEXT, status TEXT NOT NULL DEFAULT 'NEW', consent_version TEXT, source TEXT NOT NULL DEFAULT 'WEB',
 created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS quote_items(
 id TEXT PRIMARY KEY, quote_id TEXT NOT NULL, product_id TEXT, product_name TEXT NOT NULL, quantity REAL NOT NULL,
 unit TEXT NOT NULL, created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS contact_messages(
 id TEXT PRIMARY KEY, message_no TEXT NOT NULL UNIQUE, name TEXT NOT NULL, business TEXT, phone TEXT NOT NULL, email TEXT NOT NULL,
 subject TEXT, message TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'NEW', created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS photo_inquiries(
 id TEXT PRIMARY KEY, request_no TEXT NOT NULL UNIQUE, idempotency_key TEXT UNIQUE, name TEXT NOT NULL, business TEXT, phone TEXT NOT NULL,
 email TEXT NOT NULL, note TEXT, object_key TEXT NOT NULL, mime TEXT NOT NULL, size_bytes INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'NEW',
 notify_status TEXT NOT NULL DEFAULT 'PENDING', created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS members(
 id TEXT PRIMARY KEY, business_id TEXT NOT NULL, email TEXT NOT NULL UNIQUE, display_name TEXT NOT NULL, business_name TEXT,
 phone TEXT, password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'owner', status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS member_sessions(
 id TEXT PRIMARY KEY, member_id TEXT NOT NULL, token_hash TEXT NOT NULL UNIQUE, expires_at TEXT NOT NULL, revoked_at TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')), last_seen_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS digital_menus(
 menu_id TEXT PRIMARY KEY, business_id TEXT NOT NULL, user_id TEXT NOT NULL, menu_name TEXT NOT NULL, business_name TEXT NOT NULL,
 theme TEXT NOT NULL, template TEXT NOT NULL, payload_json TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active',
 created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS audit_log(
 id TEXT PRIMARY KEY, actor TEXT, action TEXT NOT NULL, entity_type TEXT, entity_id TEXT, detail_json TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
`CREATE TABLE IF NOT EXISTS feature_state(
 key TEXT PRIMARY KEY, state TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
  ];
  for(const s of q)await db.prepare(s).run();
}
export async function audit(env,{actor="system",action,entityType="",entityId="",detail={}}){
  if(!env?.DB)return;
  try{await env.DB.prepare(`INSERT INTO audit_log(id,actor,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?)`)
    .bind(uuid(),clean(actor,160),clean(action,120),clean(entityType,80),clean(entityId,120),JSON.stringify(detail).slice(0,8000)).run()}catch{}
}
export function quoteNo(){ return "OKY-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,8).toUpperCase(); }
export function messageNo(){ return "MSG-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,8).toUpperCase(); }
export function photoNo(){ return "FOT-"+new Date().toISOString().slice(0,10).replaceAll("-","")+"-"+Math.random().toString(36).slice(2,8).toUpperCase(); }

export function mailConfig(env){
  return {to:clean(env?.MAIL_TO||"hasan.kaya474@gmail.com",200),from:clean(env?.MAIL_FROM||"teklif@okyonusedt.com",200)};
}
export function safeMailHeader(v){return String(v||"").replace(/[\r\n]+/g," ").trim()}
export async function sendBoundEmail(env,message){
  if(!env?.EMAIL||typeof env.EMAIL.send!=="function")return null;
  const cfg=mailConfig(env); const from=safeMailHeader(cfg.from); const to=safeMailHeader(message.to||env.ADMIN_MAIL_TO||cfg.to); const replyTo=safeMailHeader(message.replyTo);
  if(!validEmail(from)||!validEmail(to)||!validEmail(replyTo))throw new Error("EMAIL_ADDRESS_NOT_CONFIGURED");
  const result=await env.EMAIL.send({to,from,replyTo,subject:safeMailHeader(message.subject).slice(0,180),text:String(message.text||""),html:String(message.html||"")});
  return result||{messageId:null};
}
export async function postWebhook(url,payload){
  if(!url)return null;
  const r=await fetch(url,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(payload)});
  if(!r.ok)throw new Error("WEBHOOK_"+r.status);
  return true;
}
export async function hashPassword(password,saltHex=""){
  const salt=saltHex||[...crypto.getRandomValues(new Uint8Array(16))].map(x=>x.toString(16).padStart(2,"0")).join("");
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(String(password)),"PBKDF2",false,["deriveBits"]);
  const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(salt.match(/../g).map(x=>parseInt(x,16))),iterations:100000},key,256);
  const hash=[...new Uint8Array(bits)].map(x=>x.toString(16).padStart(2,"0")).join("");
  return `${salt}$${hash}`;
}
export async function verifyPassword(password,stored){
  const [salt]=String(stored||"").split("$"); if(!salt)return false;
  return (await hashPassword(password,salt))===stored;
}
export async function memberSession(request,env){
  if(!env?.SESSION_PEPPER||!env?.DB)return null;
  const token=cookieMap(request).__Host_oky_member; if(!token)return null;
  const tokenHash=await sha256(token+env.SESSION_PEPPER);
  const row=await env.DB.prepare(`SELECT s.id session_id,s.expires_at,s.revoked_at,m.* FROM member_sessions s JOIN members m ON m.id=s.member_id WHERE s.token_hash=? LIMIT 1`).bind(tokenHash).first();
  if(!row||row.revoked_at||row.status!=="active"||row.expires_at<=new Date().toISOString())return null;
  env.DB.prepare(`UPDATE member_sessions SET last_seen_at=datetime('now') WHERE id=?`).bind(row.session_id).run().catch(()=>{});
  return row;
}
export function memberCookie(token,maxAge){return `__Host_oky_member=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`}