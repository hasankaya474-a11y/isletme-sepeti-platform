export const ACTIVE_PUBLIC_MODULES = Object.freeze({
  PRODUCTS: true,
  QUOTE: true,
  PHOTO: true,
  WHATSAPP: true,
  SEO: true,
  MEMBERSHIP: true,
  DIGITAL_MENU: true,
  COST: false,
  COST_RADAR: false,
  ACADEMY: false,
  CESNI: false
});

export const DIGITAL_MENU_THEMES = Object.freeze([
  'modern-clean','modern-dark','modern-elegant','modern-fresh','minimal-light','minimal-premium',
  'fine-dining-classic','fine-dining-black','chef-table','elegant-gold','premium-marble','coffee-warm',
  'urban-cafe','artisan-bakery','soft-brunch','street-food-bold','burger-house','fast-casual',
  'neon-snack','seafood-blue','grill-house','fresh-catch','family-table','casual-bistro',
  'homestyle-kitchen','hotel-signature','lounge-menu','event-catering','social-vibe','trend-minimal'
]);

export const DIGITAL_MENU_TEMPLATES = Object.freeze([
  'single-long','single-sectioned','sticky-categories','card-flow','large-image-flow','category-grid',
  'category-list','left-nav-content','tabbed-categories','accordion-categories','cover-category',
  'chef-signature','signature-products','photo-heavy','minimal-text','quick-select','compact-list',
  'mobile-quick-order','counter-quick-view','qr-fast-order','drinks-cards','dessert-drinks','coffee-focus',
  'brunch-flow','daily-menu','campaign-menu','seasonal-menu','multilingual-menu','branch-menu','qr-landing'
]);

export const VISUAL_SLOTS = Object.freeze({
  productMaster:{width:1600,height:1200,ratio:'4:3'},
  productWeb:{width:800,height:600,ratio:'4:3'},
  productMobile:{width:600,height:450,ratio:'4:3'},
  category:{width:1200,height:900,ratio:'4:3'},
  heroDesktop:{width:1600,height:600},
  heroMobile:{width:900,height:1200},
  promoWide:{width:1200,height:600},
  digitalMenuCoverDesktop:{width:1600,height:900},
  digitalMenuCoverMobile:{width:1080,height:1440},
  digitalMenuCategoryHero:{width:1200,height:700},
  digitalMenuItem:{width:1200,height:900}
});

export function securityHeaders(extra={}){
  return {
    'content-type':'text/html; charset=UTF-8',
    'cache-control':'no-store',
    'x-content-type-options':'nosniff',
    'referrer-policy':'strict-origin-when-cross-origin',
    'x-frame-options':'DENY',
    'permissions-policy':'camera=(self), microphone=(), geolocation=()',
    ...extra
  };
}

export function json(data,status=200,extra={}){
  return new Response(JSON.stringify(data),{status,headers:{...securityHeaders({'content-type':'application/json; charset=UTF-8'}),...extra}});
}
export function html(body,status=200,extra={}){ return new Response(body,{status,headers:{...securityHeaders(),...extra}}); }
export function clean(value,max=300){ return String(value??'').trim().replace(/[\u0000-\u001F\u007F]/g,' ').slice(0,max); }
export function validEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v||'')); }
export function nowIso(){ return new Date().toISOString(); }
export function requestNo(prefix='OKY'){ return `${prefix}-${new Date().toISOString().slice(0,10).replaceAll('-','')}-${crypto.randomUUID().replaceAll('-','').slice(0,8).toUpperCase()}`; }
export async function sha256Text(value){ const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(value)));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''); }

export function detectImageMime(bytes){
  if(bytes.length>=3&&bytes[0]===0xff&&bytes[1]===0xd8&&bytes[2]===0xff)return'image/jpeg';
  if(bytes.length>=8&&bytes[0]===0x89&&bytes[1]===0x50&&bytes[2]===0x4e&&bytes[3]===0x47)return'image/png';
  if(bytes.length>=12&&String.fromCharCode(...bytes.slice(0,4))==='RIFF'&&String.fromCharCode(...bytes.slice(8,12))==='WEBP')return'image/webp';
  return '';
}

export async function ensureSchema(env){
  if(!env?.DB) throw new Error('DB_NOT_BOUND');
  const sql=[
    `CREATE TABLE IF NOT EXISTS app_features(key TEXT PRIMARY KEY,enabled INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_quotes_v1(id TEXT PRIMARY KEY,quote_no TEXT NOT NULL UNIQUE,company_name TEXT NOT NULL,contact_name TEXT,phone TEXT,email TEXT,delivery_region TEXT,note TEXT,status TEXT NOT NULL DEFAULT 'NEW',source_channel TEXT NOT NULL DEFAULT 'WEB',total REAL NOT NULL DEFAULT 0,currency TEXT NOT NULL DEFAULT 'TRY',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_quote_items_v1(id TEXT PRIMARY KEY,quote_id TEXT NOT NULL,product_id TEXT,product_name TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Kg',quantity REAL NOT NULL,unit_price REAL,line_total REAL,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS contact_messages(id TEXT PRIMARY KEY,request_no TEXT NOT NULL UNIQUE,name TEXT NOT NULL,phone TEXT,email TEXT NOT NULL,subject TEXT NOT NULL,body TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'NEW',notification_state TEXT NOT NULL DEFAULT 'PENDING',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS photo_inquiries(id TEXT PRIMARY KEY,request_no TEXT NOT NULL UNIQUE,business_name TEXT NOT NULL,contact_name TEXT NOT NULL,phone TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'NEW',temp_media_key TEXT NOT NULL,media_name TEXT,media_mime TEXT,media_size INTEGER,media_sha256 TEXT,idempotency_key TEXT UNIQUE,notification_state TEXT NOT NULL DEFAULT 'PENDING',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS storefront_sections(id TEXT PRIMARY KEY,title TEXT NOT NULL,kind TEXT NOT NULL,active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,payload_json TEXT NOT NULL DEFAULT '{}',updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS digital_menu_profiles(id TEXT PRIMARY KEY,business_id TEXT,name TEXT NOT NULL,theme TEXT NOT NULL,template TEXT NOT NULL,payload_json TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'DRAFT',published_at TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS audit_log(id TEXT PRIMARY KEY,actor TEXT,action TEXT NOT NULL,entity_type TEXT,entity_id TEXT,detail_json TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')))`
  ];
  for(const s of sql) await env.DB.prepare(s).run();
  for(const [k,v] of Object.entries(ACTIVE_PUBLIC_MODULES)) await env.DB.prepare(`INSERT OR IGNORE INTO app_features(key,enabled) VALUES(?,?)`).bind(k,v?1:0).run();
}

export async function featureMap(env){
  const map={...ACTIVE_PUBLIC_MODULES};
  if(!env?.DB) return map;
  try{ await ensureSchema(env); const rows=(await env.DB.prepare('SELECT key,enabled FROM app_features').all()).results||[]; for(const r of rows)map[r.key]=Boolean(r.enabled); }catch{}
  return map;
}

export async function sendBoundEmail(env,{replyTo='',subject,text,to=''}){
  if(!env?.EMAIL||typeof env.EMAIL.send!=='function') return {ok:false,reason:'EMAIL_BINDING_NOT_CONFIGURED'};
  const target=clean(to||env.ADMIN_MAIL_TO||env.MAIL_TO||'',180);
  const from=clean(env.MAIL_FROM||'info@okyonusedt.com',180);
  if(!target) return {ok:false,reason:'EMAIL_TARGET_MISSING'};
  await env.EMAIL.send({to:target,from,replyTo:clean(replyTo,180),subject:clean(subject,180),text:String(text||'').slice(0,12000)});
  return {ok:true};
}

export async function audit(env,{actor='system',action,entityType='',entityId='',detail={}}){
  if(!env?.DB)return;
  try{await ensureSchema(env);await env.DB.prepare(`INSERT INTO audit_log(id,actor,action,entity_type,entity_id,detail_json) VALUES(?,?,?,?,?,?)`).bind(crypto.randomUUID(),actor,action,entityType,entityId,JSON.stringify(detail).slice(0,8000)).run()}catch{}
}