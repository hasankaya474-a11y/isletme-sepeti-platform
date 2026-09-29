function j(data,status=200,headers={}){const h=new Headers(headers);h.set("content-type","application/json; charset=utf-8");h.set("cache-control","no-store");return new Response(JSON.stringify(data),{status,headers:h})}
function page(body,headers={}){const h=new Headers(headers);h.set("content-type","text/html; charset=utf-8");h.set("cache-control","no-store");return new Response(body,{status:200,headers:h})}
function clean(v,n=500){return String(v==null?"":v).trim().slice(0,n)}
function canWrite(auth){return ["owner","admin","editor"].includes(auth?.user?.role)}
async function read(request){try{return await request.json()}catch{return {}}}
async function upsertProductMeta(env,productId,b){
 const old=await env.DB.prepare("SELECT * FROM oky_product_meta_v1 WHERE product_id=?").bind(productId).first();
 const pick=(k,alt,def="")=>Object.prototype.hasOwnProperty.call(b,k)?b[k]:(alt&&Object.prototype.hasOwnProperty.call(b,alt)?b[alt]:(old?.[def||k]??""));
 const brandId=clean(pick("brandId","brand_id","brand_id"),120)||null;
 const description=clean(pick("description",null,"description"),5000);
 const seoTitle=clean(pick("seoTitle","seo_title","seo_title"),220);
 const seoDescription=clean(pick("seoDescription","seo_description","seo_description"),500);
 const sortOrder=Object.prototype.hasOwnProperty.call(b,"sortOrder")?Number(b.sortOrder||0):Number(old?.sort_order||0);
 const featured=Object.prototype.hasOwnProperty.call(b,"featured")?(b.featured?1:0):Number(old?.featured||0);
 await env.DB.prepare(`INSERT INTO oky_product_meta_v1(product_id,brand_id,description,seo_title,seo_description,sort_order,featured,updated_at)
 VALUES(?,?,?,?,?,?,?,datetime('now'))
 ON CONFLICT(product_id) DO UPDATE SET brand_id=excluded.brand_id,description=excluded.description,seo_title=excluded.seo_title,seo_description=excluded.seo_description,sort_order=excluded.sort_order,featured=excluded.featured,updated_at=datetime('now')`)
 .bind(productId,brandId,description,seoTitle,seoDescription,sortOrder,featured).run();
}

async function ensure(env){
 const q=[
 `CREATE TABLE IF NOT EXISTS oky_storefront_categories_v1(id TEXT PRIMARY KEY,parent_id TEXT,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,image_url TEXT,icon TEXT,description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,seo_title TEXT,seo_description TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_banners_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,subtitle TEXT,desktop_image TEXT,mobile_image TEXT,cta_text TEXT,cta_url TEXT,start_at TEXT,end_at TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,audience TEXT NOT NULL DEFAULT 'ALL',device_target TEXT NOT NULL DEFAULT 'ALL',updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_sections_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,kind TEXT NOT NULL,source TEXT,payload_json TEXT NOT NULL DEFAULT '{}',sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_help_articles_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,category TEXT NOT NULL DEFAULT 'GENEL',body TEXT NOT NULL,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_storefront_settings_v1(key TEXT PRIMARY KEY,value TEXT,updated_by TEXT,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_brands_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,slug TEXT NOT NULL UNIQUE,logo_url TEXT,description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_campaigns_v1(id TEXT PRIMARY KEY,title TEXT NOT NULL,description TEXT,cta_text TEXT,cta_url TEXT,start_at TEXT,end_at TEXT,priority INTEGER NOT NULL DEFAULT 0,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_delivery_rules_v1(id TEXT PRIMARY KEY,region TEXT NOT NULL DEFAULT 'İstanbul',district TEXT,min_order REAL,fee REAL,free_threshold REAL,cutoff TEXT,delivery_days TEXT,cold_chain INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
,
 `CREATE TABLE IF NOT EXISTS oky_media_assets_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,url TEXT NOT NULL,kind TEXT NOT NULL DEFAULT 'product',alt_text TEXT,tags TEXT,sort_order INTEGER NOT NULL DEFAULT 0,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
 `CREATE TABLE IF NOT EXISTS oky_product_meta_v1(product_id TEXT PRIMARY KEY,brand_id TEXT,description TEXT,seo_title TEXT,seo_description TEXT,sort_order INTEGER NOT NULL DEFAULT 0,featured INTEGER NOT NULL DEFAULT 0,updated_at TEXT NOT NULL DEFAULT (datetime('now')))`
 ];for(const s of q)await env.DB.prepare(s).run();
 const cats=[["deniz-urunleri","Deniz Ürünleri","🐟"],["donuk-urunler","Donuk Ürünler","❄"],["et-kanatli","Et & Kanatlı","🥩"],["sut-sarkuteri","Süt & Şarküteri","🧀"],["yaglar","Yağlar","🫗"],["soslar","Soslar","🥫"],["kuru-gida","Kuru Gıda","🌾"],["baharat","Baharat","✦"]];
 for(let i=0;i<cats.length;i++)await env.DB.prepare("INSERT OR IGNORE INTO oky_storefront_categories_v1(id,name,slug,icon,sort_order,active) VALUES(?,?,?,?,?,1)").bind(crypto.randomUUID(),cats[i][1],cats[i][0],cats[i][2],i).run();
}

export async function commerceAdminApi(request,env,auth,headers){
 await ensure(env);const u=new URL(request.url),p=u.pathname.split("/").filter(Boolean),resource=p[2],id=p[3];
 const tables={categories:"oky_storefront_categories_v1",banners:"oky_storefront_banners_v1",sections:"oky_storefront_sections_v1",help:"oky_help_articles_v1",brands:"oky_brands_v1",campaigns:"oky_campaigns_v1",delivery:"oky_delivery_rules_v1",media:"oky_media_assets_v1"};
 if(resource==="summary"){
  const out={};for(const [k,t] of Object.entries(tables))out[k]=Number((await env.DB.prepare("SELECT COUNT(*) n FROM "+t).first())?.n||0);
  out.products=Number((await env.DB.prepare("SELECT COUNT(*) n FROM b2b_products_v1").first())?.n||0);
  out.settings=Number((await env.DB.prepare("SELECT COUNT(*) n FROM oky_storefront_settings_v1").first())?.n||0);
  return j({ok:true,data:out},200,headers);
 }
 if(resource==="settings"){
  if(request.method==="GET"){const rows=(await env.DB.prepare("SELECT key,value,updated_at FROM oky_storefront_settings_v1 ORDER BY key").all()).results||[];return j({ok:true,data:Object.fromEntries(rows.map(x=>[x.key,x.value])),rows},200,headers)}
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request),allowed=["siteTitle","logoUrl","phone","email","whatsapp","announcement","heroTitle","heroSubtitle","address","footerText"];
  for(const key of allowed)if(Object.prototype.hasOwnProperty.call(b,key))await env.DB.prepare("INSERT INTO oky_storefront_settings_v1(key,value,updated_by,updated_at) VALUES(?,?,?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_by=excluded.updated_by,updated_at=datetime('now')").bind(key,clean(b[key],key==="heroSubtitle"||key==="footerText"?1000:500),auth.user.id).run();
  return j({ok:true},200,headers);
 }
 if(resource==="legacy-catalog-sync"){
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const origin=clean(env.PUBLIC_SITE_URL||"https://www.okyonusedt.com",500).replace(/\/$/,"");
  let payload;try{const rr=await fetch(origin+"/api/products",{headers:{accept:"application/json"}});if(!rr.ok)return j({ok:false,error:"LEGACY_CATALOG_FETCH_FAILED",status:rr.status},502,headers);payload=await rr.json()}catch{return j({ok:false,error:"LEGACY_CATALOG_FETCH_FAILED"},502,headers)}
  const items=Array.isArray(payload?.products)?payload.products.slice(0,1000):[];
  let created=0,updated=0,failed=0;
  for(const x of items){
    const sourceId=clean(x.id,120),name=clean(x.name,220);if(!sourceId||!name){failed++;continue}
    const txt=[x.category,x.masterCategory,x.subCategory,x.name].filter(Boolean).join(" ").toLocaleLowerCase("tr-TR");
    let category=clean(x.category,120)||"Diğer Ürünler";
    if(/deniz|balık|karides|kalamar|ahtapot|su ürün/.test(txt))category="Deniz Ürünleri";
    else if(/donuk|patates|dondur/.test(txt))category="Donuk Ürünler";
    else if(/et|kanat|tavuk|piliç|köfte|şarküteri|sucuk|sosis/.test(txt))category="Et & Şarküteri";
    else if(/süt|peynir|krema|tereyağ|yoğurt/.test(txt))category="Süt & Şarküteri";
    else if(/yağ/.test(txt))category="Yağlar";
    else if(/sos|ketçap|mayonez|hardal|sirke/.test(txt))category="Soslar";
    else if(/baharat|çeşni/.test(txt))category="Baharat";
    else if(/bakliyat|pirinç|bulgur|makarna|un|şeker|tuz|kuru/.test(txt))category="Kuru Gıda";
    const pack=[clean(x.amount,100),clean(x.package,100)].filter(Boolean).join(" • "),unit=/kg/i.test(pack)?"Kg":/litre|\bL\b/i.test(pack)?"Litre":"Adet";
    try{
      const row=await env.DB.prepare("SELECT id FROM b2b_products_v1 WHERE source_product_id=? LIMIT 1").bind(sourceId).first();
      if(row){await env.DB.prepare("UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,active=1,updated_at=datetime('now') WHERE id=?").bind(name,category,unit,pack,row.id).run();updated++}
      else{await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,NULL,'ORDER',1,datetime('now'))").bind(crypto.randomUUID(),sourceId,name,category,unit,pack).run();created++}
    }catch{failed++}
  }
  return j({ok:true,source:origin,count:items.length,created,updated,failed},200,headers);
 }
 if(resource==="product-history"&&id&&request.method==="GET"){
  const rows=(await env.DB.prepare("SELECT old_price,new_price,actor,created_at FROM b2b_price_history_v1 WHERE product_id=? ORDER BY created_at DESC LIMIT 50").bind(id).all()).results||[];
  return j({ok:true,data:rows},200,headers);
 }
 if(resource==="catalog-import"){
  if(request.method!=="POST")return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request),items=Array.isArray(b.items)?b.items:[];
  if(!items.length||items.length>500)return j({ok:false,error:"INVALID_IMPORT_SIZE"},400,headers);
  let created=0,updated=0;const failed=[];
  for(let i=0;i<items.length;i++){
    const x=items[i]||{},name=clean(x.name,220),category=clean(x.category,120),unit=clean(x.unit,30)||"Adet",sourceId=clean(x.sourceProductId||x.source_product_id,120),image=clean(x.imageUrl||x.image_url,1500);
    if(!name||!category){failed.push({index:i,error:"NAME_CATEGORY_REQUIRED"});continue}
    if(image&&!/^https:\/\//i.test(image)){failed.push({index:i,error:"INVALID_IMAGE_URL"});continue}
    try{
      let row=null;
      if(sourceId)row=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE source_product_id=? LIMIT 1").bind(sourceId).first();
      if(!row)row=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE name=? AND category=? LIMIT 1").bind(name,category).first();
      const id=row?.id||crypto.randomUUID();
      if(row){
        await env.DB.prepare("UPDATE b2b_products_v1 SET source_product_id=?,name=?,category=?,unit=?,package_text=?,image_url=?,stock_status=?,active=?,updated_at=datetime('now') WHERE id=?")
          .bind(sourceId||row.source_product_id||null,name,category,unit,clean(x.packageText||x.package_text,140),image||null,clean(x.stockStatus||x.stock_status,30)||row.stock_status||"ORDER",x.active===false?0:1,id).run();
        updated++;
      }else{
        await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,datetime('now'))")
          .bind(id,sourceId||null,name,category,unit,clean(x.packageText||x.package_text,140),image||null,clean(x.stockStatus||x.stock_status,30)||"ORDER",x.active===false?0:1).run();
        created++;
      }
      await upsertProductMeta(env,id,x);
      if(x.price!==undefined&&Number.isFinite(Number(x.price))){
        const current=await env.DB.prepare("SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1").bind(id).first();
        if(Number(current?.price)!==Number(x.price)){
          await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
          await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),id,Number(x.price),"TRY").run();
          await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),id,current?.price??null,Number(x.price),auth.user.id).run();
        }
      }
    }catch(e){failed.push({index:i,error:"IMPORT_ROW_FAILED"})}
  }
  return j({ok:failed.length===0,created,updated,failed},failed.length?207:200,headers);
 }
 if(resource==="products"){
  if(request.method==="GET"){const rows=(await env.DB.prepare(`SELECT p.*,
 (SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1) current_price,
 m.brand_id,m.description,m.seo_title,m.seo_description,m.sort_order,m.featured,
 (SELECT name FROM oky_brands_v1 b WHERE b.id=m.brand_id LIMIT 1) brand_name
 FROM b2b_products_v1 p LEFT JOIN oky_product_meta_v1 m ON m.product_id=p.id
 ORDER BY p.active DESC,m.featured DESC,m.sort_order,p.name LIMIT 500`).all()).results||[];return j({ok:true,data:rows},200,headers)}
  if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
  const b=await read(request);
  if(request.method==="DELETE"&&id){
    const old=await env.DB.prepare("SELECT id FROM b2b_products_v1 WHERE id=?").bind(id).first();
    if(!old)return j({ok:false,error:"PRODUCT_NOT_FOUND"},404,headers);
    await env.DB.prepare("UPDATE b2b_products_v1 SET active=0,updated_at=datetime('now') WHERE id=?").bind(id).run();
    await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
    return j({ok:true,id,softDeleted:true},200,headers);
  }
  if(request.method==="POST"&&!id){
    const name=clean(b.name,220),category=clean(b.category,120),unit=clean(b.unit,30)||"Adet",image=clean(b.imageUrl,1500),rid=crypto.randomUUID();
    if(!name||!category)return j({ok:false,error:"NAME_CATEGORY_REQUIRED"},400,headers);
    if(image&&!/^https:\/\//i.test(image))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);
    await env.DB.prepare("INSERT INTO b2b_products_v1(id,source_product_id,name,category,unit,package_text,image_url,stock_status,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,datetime('now'))")
      .bind(rid,null,name,category,unit,clean(b.packageText,140),image||null,clean(b.stockStatus,30)||"ORDER",b.active===false?0:1).run();
    await upsertProductMeta(env,rid,b);
    if(b.price!==undefined&&Number.isFinite(Number(b.price))){
      await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),rid,Number(b.price),"TRY").run();
      await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),rid,null,Number(b.price),auth.user.id).run();
    }
    return j({ok:true,id:rid},201,headers);
  }
  if(request.method==="POST"&&id){
    const old=await env.DB.prepare("SELECT * FROM b2b_products_v1 WHERE id=?").bind(id).first();if(!old)return j({ok:false,error:"PRODUCT_NOT_FOUND"},404,headers);
    const image=clean(b.imageUrl,1500);if(image&&!/^https:\/\//i.test(image))return j({ok:false,error:"INVALID_IMAGE_URL"},400,headers);
    await env.DB.prepare("UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,image_url=?,stock_status=?,active=?,updated_at=datetime('now') WHERE id=?").bind(clean(b.name,220)||old.name,clean(b.category,120)||old.category,clean(b.unit,30)||old.unit,clean(b.packageText,140),image||null,clean(b.stockStatus,30)||old.stock_status,b.active===false?0:1,id).run();
    await upsertProductMeta(env,id,b);
    if(b.price!==undefined&&Number.isFinite(Number(b.price))){
      const oldPrice=await env.DB.prepare("SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1").bind(id).first();
      await env.DB.prepare("UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1").bind(id).run();
      await env.DB.prepare("INSERT INTO b2b_prices_v1(id,product_id,price,currency,active) VALUES(?,?,?,?,1)").bind(crypto.randomUUID(),id,Number(b.price),"TRY").run();
      await env.DB.prepare("INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)").bind(crypto.randomUUID(),id,oldPrice?.price??null,Number(b.price),auth.user.id).run();
    }
    return j({ok:true,id},200,headers);
  }
  return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
 }
 const table=tables[resource];if(!table)return j({ok:false,error:"NOT_FOUND"},404,headers);
 if(request.method==="GET"){const rows=(await env.DB.prepare("SELECT * FROM "+table+" ORDER BY sort_order,rowid").all()).results||[];return j({ok:true,data:rows},200,headers)}
 if(!canWrite(auth))return j({ok:false,error:"READ_ONLY_ROLE"},403,headers);
 if(request.method==="DELETE"&&id){await env.DB.prepare("DELETE FROM "+table+" WHERE id=?").bind(id).run();return j({ok:true,id},200,headers)}
 if(request.method==="POST"){
  const b=await read(request),rid=id||crypto.randomUUID();
  if(resource==="categories"){await env.DB.prepare(`INSERT INTO oky_storefront_categories_v1(id,parent_id,name,slug,image_url,icon,description,sort_order,active,seo_title,seo_description,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET parent_id=excluded.parent_id,name=excluded.name,slug=excluded.slug,image_url=excluded.image_url,icon=excluded.icon,description=excluded.description,sort_order=excluded.sort_order,active=excluded.active,seo_title=excluded.seo_title,seo_description=excluded.seo_description,updated_at=datetime('now')`).bind(rid,clean(b.parentId,100)||null,clean(b.name,180),clean(b.slug,180),clean(b.imageUrl,1500)||null,clean(b.icon,20),clean(b.description,1200),Number(b.sortOrder||0),b.active===false?0:1,clean(b.seoTitle,220),clean(b.seoDescription,500)).run()}
  if(resource==="banners"){await env.DB.prepare(`INSERT INTO oky_storefront_banners_v1(id,title,subtitle,desktop_image,mobile_image,cta_text,cta_url,start_at,end_at,sort_order,active,audience,device_target,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,subtitle=excluded.subtitle,desktop_image=excluded.desktop_image,mobile_image=excluded.mobile_image,cta_text=excluded.cta_text,cta_url=excluded.cta_url,start_at=excluded.start_at,end_at=excluded.end_at,sort_order=excluded.sort_order,active=excluded.active,audience=excluded.audience,device_target=excluded.device_target,updated_at=datetime('now')`).bind(rid,clean(b.title,220),clean(b.subtitle,600),clean(b.desktopImage,1500)||null,clean(b.mobileImage,1500)||null,clean(b.ctaText,100),clean(b.ctaUrl,500),b.startAt||null,b.endAt||null,Number(b.sortOrder||0),b.active===false?0:1,clean(b.audience,50)||"ALL",clean(b.deviceTarget,20)||"ALL").run()}
  if(resource==="sections"){let payload={};if(b.payload&&typeof b.payload==="object")payload=b.payload;else if(b.payloadJson){try{payload=JSON.parse(String(b.payloadJson))}catch{return j({ok:false,error:"INVALID_SECTION_PAYLOAD_JSON"},400,headers)}}await env.DB.prepare(`INSERT INTO oky_storefront_sections_v1(id,title,kind,source,payload_json,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,kind=excluded.kind,source=excluded.source,payload_json=excluded.payload_json,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')`).bind(rid,clean(b.title,180),clean(b.kind,60),clean(b.source,100),JSON.stringify(payload),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="help"){await env.DB.prepare(`INSERT INTO oky_help_articles_v1(id,title,slug,category,body,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,datetime('now')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,slug=excluded.slug,category=excluded.category,body=excluded.body,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime('now')`).bind(rid,clean(b.title,220),clean(b.slug,180),clean(b.category,80)||"GENEL",clean(b.body,20000),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="brands"){await env.DB.prepare("INSERT INTO oky_brands_v1(id,name,slug,logo_url,description,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET name=excluded.name,slug=excluded.slug,logo_url=excluded.logo_url,description=excluded.description,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.name,180),clean(b.slug,180),clean(b.logoUrl,1500)||null,clean(b.description,2000),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="campaigns"){await env.DB.prepare("INSERT INTO oky_campaigns_v1(id,title,description,cta_text,cta_url,start_at,end_at,priority,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET title=excluded.title,description=excluded.description,cta_text=excluded.cta_text,cta_url=excluded.cta_url,start_at=excluded.start_at,end_at=excluded.end_at,priority=excluded.priority,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.title,220),clean(b.description,2000),clean(b.ctaText,120),clean(b.ctaUrl,500),b.startAt||null,b.endAt||null,Number(b.priority||0),Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="delivery"){await env.DB.prepare("INSERT INTO oky_delivery_rules_v1(id,region,district,min_order,fee,free_threshold,cutoff,delivery_days,cold_chain,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET region=excluded.region,district=excluded.district,min_order=excluded.min_order,fee=excluded.fee,free_threshold=excluded.free_threshold,cutoff=excluded.cutoff,delivery_days=excluded.delivery_days,cold_chain=excluded.cold_chain,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.region,120)||"İstanbul",clean(b.district,120)||null,Number(b.minOrder||0),Number(b.fee||0),Number(b.freeThreshold||0),clean(b.cutoff,20),clean(b.deliveryDays,120),b.coldChain===false?0:1,Number(b.sortOrder||0),b.active===false?0:1).run()}
  if(resource==="media"){const mediaUrl=clean(b.url,1500);if(!/^https:\/\//i.test(mediaUrl))return j({ok:false,error:"INVALID_MEDIA_URL"},400,headers);await env.DB.prepare("INSERT INTO oky_media_assets_v1(id,name,url,kind,alt_text,tags,sort_order,active,updated_at) VALUES(?,?,?,?,?,?,?,?,datetime(\'now\')) ON CONFLICT(id) DO UPDATE SET name=excluded.name,url=excluded.url,kind=excluded.kind,alt_text=excluded.alt_text,tags=excluded.tags,sort_order=excluded.sort_order,active=excluded.active,updated_at=datetime(\'now\')").bind(rid,clean(b.name,220),mediaUrl,clean(b.kind,50)||"product",clean(b.altText,500),clean(b.tags,500),Number(b.sortOrder||0),b.active===false?0:1).run()}
  return j({ok:true,id:rid},id?200:201,headers);
 }
 return j({ok:false,error:"METHOD_NOT_ALLOWED"},405,headers);
}

export function commerceAdminPage(headers={}){
return page(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Ticaret Yönetimi | Okyanus EDT</title><style>*{box-sizing:border-box}body{margin:0;font-family:Arial;background:#f3f7fa;color:#0b3150}.top{padding:18px 22px;background:#fff;border-bottom:1px solid #dce8f0;display:flex;justify-content:space-between;align-items:center}.top h1{margin:0}.tabs{display:flex;gap:8px;overflow:auto;padding:12px 22px;background:#fff}.tabs button{border:1px solid #cfe0ea;background:#fff;border-radius:10px;padding:10px 14px;font-weight:800;cursor:pointer}.tabs button.active{background:#0768b2;color:#fff}.wrap{padding:22px}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}.stat,.panel{background:#fff;border:1px solid #dce8f0;border-radius:15px;padding:16px}.stat b{font-size:28px;display:block}.panel{margin-top:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.form{display:grid;gap:8px}.form input,.form textarea,.form select{width:100%;padding:10px;border:1px solid #bfd2df;border-radius:9px}.form button{padding:11px;border:0;border-radius:9px;background:#0768b2;color:#fff;font-weight:800}.table{overflow:auto}.table table{border-collapse:collapse;width:100%;font-size:12px}.table th,.table td{padding:9px;border-bottom:1px solid #edf3f7;text-align:left}.table img{width:60px;height:45px;object-fit:cover;border-radius:6px}.tabs button,.form button,.table button{min-height:44px}.table button{margin:2px;padding:8px 10px;border:0;border-radius:8px;background:#0768b2;color:#fff;font-weight:800}.table{max-width:100%;-webkit-overflow-scrolling:touch}@media(max-width:800px){.top{padding:12px;gap:10px;align-items:flex-start;flex-direction:column}.tabs{padding:8px 12px}.stats{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.wrap{padding:12px}.panel{padding:10px}.table table{min-width:760px}.form input,.form textarea,.form select{min-height:44px}}</style></head><body><header class="top"><h1>Ticaret Yönetimi</h1><a href="/">← Yönetici Ana Sayfa</a></header><nav class="tabs"><button data-r="products" class="active">Ürün & Fiyat</button><button data-r="categories">Kategoriler</button><button data-r="banners">Banner</button><button data-r="sections">Vitrin</button><button data-r="brands">Markalar</button><button data-r="campaigns">Kampanyalar</button><button data-r="delivery">Teslimat</button><button data-r="media">Medya</button><button data-r="help">Site Yardım</button></nav><main class="wrap"><div id="stats" class="stats"></div><section class="panel"><div id="content">Yükleniyor…</div></section></main><script>
const root='/api/commerce-admin/';let current='products';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
async function api(path,opt){const r=await fetch(root+path,{headers:{'content-type':'application/json'},...opt});const j=await r.json();if(!r.ok)throw Error(j.error||'İstek başarısız');return j}
async function summary(){const j=await api('summary');stats.innerHTML=Object.entries(j.data).map(([k,v])=>'<article class="stat"><b>'+v+'</b><span>'+esc(k)+'</span></article>').join('')}
function productForm(x={}){
 return '<div class="grid"><form class="form" id="pf"><h3>'+(x.id?'Ürün Düzenle':'Yeni Ürün')+'</h3><input name="name" value="'+esc(x.name||'')+'" placeholder="Ürün adı" required><input name="category" value="'+esc(x.category||'')+'" placeholder="Kategori" required><input name="unit" value="'+esc(x.unit||'Adet')+'" placeholder="Birim" required><input name="packageText" value="'+esc(x.package_text||'')+'" placeholder="Paket"><input name="imageUrl" value="'+esc(x.image_url||'')+'" placeholder="https:// görsel"><input name="price" type="number" step="0.01" min="0" value="'+esc(x.current_price??'')+'" placeholder="Fiyat"><input name="brandId" list="brandIds" value="'+esc(x.brand_id||'')+'" placeholder="Marka seç / ID"><datalist id="brandIds"></datalist><textarea name="description" placeholder="Ürün açıklaması">'+esc(x.description||'')+'</textarea><input name="seoTitle" value="'+esc(x.seo_title||'')+'" placeholder="SEO başlık"><textarea name="seoDescription" placeholder="SEO açıklama">'+esc(x.seo_description||'')+'</textarea><input name="sortOrder" type="number" value="'+esc(x.sort_order??0)+'" placeholder="Sıra"><label><input type="checkbox" name="featured" '+(Number(x.featured)===1?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">Öne çıkar</label><select name="stockStatus"><option value="'+esc(x.stock_status||'ORDER')+'">'+esc(x.stock_status||'ORDER')+'</option><option>AVAILABLE</option><option>LIMITED</option><option>ORDER</option><option>OUT</option></select><label><input type="checkbox" name="active" '+(Number(x.active)!==0?'checked':'')+' style="width:auto;display:inline-block;margin-right:8px">Aktif</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button>Kaydet</button>'+(x.id?'<button type="button" id="cancelProduct" style="background:#60778a">Vazgeç</button>':'')+'</div></form><div><h3>Ürün Yönetimi</h3><p>Görsel, fiyat, kategori, paket, stok ve görünürlük buradan yönetilir.</p><p>Silme işlemi güvenlik için ürünü pasife alır ve aktif fiyatını kapatır.</p></div></div>';
}
function catalogImportUI(){return '<div class="panel" style="margin:0 0 14px"><h3>Toplu Katalog İçe Aktar</h3><p>En fazla 500 ürün. JSON dizi formatı: name, category, unit, packageText, imageUrl, stockStatus, price, sourceProductId, brandId, description, seoTitle, seoDescription, featured, sortOrder.</p><textarea id="catalogImportJson" style="width:100%;min-height:150px" placeholder=\'[{"name":"Donuk Patates","category":"Donuk Ürünler","unit":"Koli","packageText":"4x2,5 kg","imageUrl":"https://...","stockStatus":"AVAILABLE","price":0}]\'></textarea><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button type="button" onclick="runCatalogImport()">İçe Aktar</button><span id="catalogImportResult"></span></div></div>'}
function productUI(rows){return catalogImportUI()+productForm()+'<div class="table" style="margin-top:14px"><table><thead><tr><th>Görsel</th><th>Ürün</th><th>Kategori</th><th>Paket</th><th>Fiyat</th><th>Stok</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+(x.image_url?'<img src="'+esc(x.image_url)+'">':'—')+'</td><td>'+esc(x.name)+'</td><td>'+esc(x.category)+'</td><td>'+esc(x.package_text)+'</td><td>'+esc(x.current_price??'—')+'</td><td>'+esc(x.stock_status)+'</td><td>'+(Number(x.active)!==0?'Aktif':'Pasif')+'</td><td><button type="button" onclick="editProduct(\''+esc(x.id)+'\')">Düzenle</button><button type="button" onclick="showPriceHistory(\''+esc(x.id)+'\')">Fiyat Geçmişi</button><button type="button" onclick="disableProduct(\''+esc(x.id)+'\')" style="background:#9d2635">Pasife Al</button></td></tr>').join('')+'</tbody></table></div>'}
async function runCatalogImport(){
 const out=document.getElementById('catalogImportResult'),ta=document.getElementById('catalogImportJson');if(!out||!ta)return;
 let items;try{items=JSON.parse(ta.value)}catch(_){out.textContent='Geçersiz JSON';return}
 if(!Array.isArray(items)){out.textContent='JSON bir dizi olmalı';return}
 out.textContent='İçe aktarılıyor...';
 try{const j=await api('catalog-import',{method:'POST',body:JSON.stringify({items})});out.textContent='Oluşturulan: '+(j.created||0)+' • Güncellenen: '+(j.updated||0)+' • Hatalı: '+((j.failed||[]).length);await load();await summary()}catch(e){out.textContent=e.message}
}
async function bindProductForm(id=''){
 const f=document.getElementById('pf');if(!f)return;
 try{const bj=await api('brands'),dl=document.getElementById('brandIds');if(dl&&Array.isArray(bj.data))dl.innerHTML=bj.data.filter(x=>Number(x.active)!==0).map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join('')}catch(_){}
 const cancel=document.getElementById('cancelProduct');if(cancel)cancel.onclick=()=>load();
 f.onsubmit=async e=>{e.preventDefault();const b=Object.fromEntries(new FormData(f));b.active=!!f.elements.active?.checked;b.featured=!!f.elements.featured?.checked;b.sortOrder=Number(b.sortOrder||0);if(b.price!=='')b.price=Number(b.price);else delete b.price;await api('products'+(id?'/'+encodeURIComponent(id):''),{method:'POST',body:JSON.stringify(b)});await load();await summary()}
}
async function editProduct(id){const j=await api('products'),x=j.data.find(v=>String(v.id)===String(id));if(!x)return;content.innerHTML=productForm(x)+'<div style="margin-top:12px"><button type="button" onclick="load()">← Ürün listesine dön</button></div>';await bindProductForm(id)}
async function disableProduct(id){if(!confirm('Bu ürün pasife alınsın mı?'))return;await api('products/'+encodeURIComponent(id),{method:'DELETE'});await load();await summary()}
async function showPriceHistory(id){
 const j=await api('product-history/'+encodeURIComponent(id));
 const rows=Array.isArray(j.data)?j.data:[];
 const box='<div class="panel"><h3>Fiyat Geçmişi</h3><div class="table"><table><thead><tr><th>Tarih</th><th>Eski</th><th>Yeni</th><th>İşlemi Yapan</th></tr></thead><tbody>'+rows.map(x=>'<tr><td>'+esc(x.created_at||'')+'</td><td>'+esc(x.old_price??'—')+'</td><td>'+esc(x.new_price??'—')+'</td><td>'+esc(x.actor||'—')+'</td></tr>').join('')+'</tbody></table></div><p><button type="button" onclick="load()">← Ürün listesine dön</button></p></div>';
 content.innerHTML=box;
}
const fieldSets={
 banners:['title','subtitle','desktopImage','mobileImage','ctaText','ctaUrl','startAt','endAt','sortOrder'],
 categories:['name','slug','icon','imageUrl','description','sortOrder'],
 brands:['name','slug','logoUrl','description','sortOrder'],
 campaigns:['title','description','ctaText','ctaUrl','startAt','endAt','priority','sortOrder'],
 delivery:['region','district','minOrder','fee','freeThreshold','cutoff','deliveryDays','sortOrder'],
 media:['name','url','kind','altText','tags','sortOrder'],
 help:['title','slug','category','body','sortOrder'],
 sections:['title','kind','source','payloadJson','sortOrder']
};
const dbMap={desktopImage:'desktop_image',mobileImage:'mobile_image',ctaText:'cta_text',ctaUrl:'cta_url',startAt:'start_at',endAt:'end_at',sortOrder:'sort_order',imageUrl:'image_url',logoUrl:'logo_url',minOrder:'min_order',freeThreshold:'free_threshold',deliveryDays:'delivery_days',altText:'alt_text',payloadJson:'payload_json'};
let editingId='';
function genericUI(resource,rows){
 const fields=fieldSets[resource]||fieldSets.sections;
 return '<div class="grid"><form class="form" id="gf"><h3 id="gfTitle">Yeni Kayıt</h3>'+
 fields.map(f=>(f==='body'||f==='description'||f==='subtitle'||f==='payloadJson')?'<textarea name="'+f+'" placeholder="'+(f==='payloadJson'?'JSON: {"limit":5,"ctaText":"Tümünü Gör","ctaUrl":"/urunler"}':f)+'"></textarea>':'<input name="'+f+'" '+(f==='kind'&&resource==='sections'?'list="sectionKinds" ':'')+'placeholder="'+f+'">').join('')+(resource==='sections'?'<datalist id="sectionKinds"><option value="PRODUCT_GRID"><option value="CATEGORY_STRIP"><option value="CAMPAIGN"><option value="PROMO"><option value="CONTENT"></datalist><small>kind: PRODUCT_GRID, CATEGORY_STRIP, CAMPAIGN, PROMO veya CONTENT. source ürün grubu/marka filtresi olabilir.</small>':'')+
 '<label><input type="checkbox" name="active" checked style="width:auto;display:inline-block;margin-right:8px">Aktif</label><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="submit">Kaydet</button><button type="button" id="cancelEdit" style="background:#60778a;display:none">Vazgeç</button></div></form><div class="table"><table><thead><tr><th>Kayıt</th><th>Durum</th><th>İşlem</th></tr></thead><tbody>'+
 rows.map(x=>'<tr><td><b>'+esc(x.title||x.name||x.region||x.id)+'</b><br><small>'+esc(x.slug||x.kind||x.district||'')+'</small></td><td>'+(Number(x.active)!==0?'Aktif':'Pasif')+'</td><td><button type="button" onclick="startEdit(\''+esc(resource)+'\',\''+esc(x.id)+'\')">Düzenle</button><button type="button" onclick="removeRow(\''+esc(resource)+'\',\''+esc(x.id)+'\')" style="background:#9d2635">Sil</button></td></tr>').join('')+
 '</tbody></table></div></div>';
}
async function startEdit(resource,id){
 const j=await api(resource),x=j.data.find(v=>String(v.id)===String(id));if(!x)return;
 editingId=id;current=resource;
 const f=document.getElementById('gf');if(!f)return;
 document.getElementById('gfTitle').textContent='Kaydı Düzenle';
 document.getElementById('cancelEdit').style.display='inline-block';
 for(const name of fieldSets[resource]||[]){
   const el=f.elements[name];if(!el)continue;
   const key=dbMap[name]||name;el.value=x[key]??'';
 }
 if(f.elements.active)f.elements.active.checked=Number(x.active)!==0;
 f.scrollIntoView({behavior:'smooth',block:'start'});
}
async function removeRow(resource,id){
 if(!confirm('Bu kayıt silinsin mi?'))return;
 await api(resource+'/'+encodeURIComponent(id),{method:'DELETE'});
 editingId='';await load();await summary();
}
async function load(){
 const j=await api(current);
 content.innerHTML=current==='products'?productUI(j.data):genericUI(current,j.data);
 if(current==='products'){await bindProductForm();return}
 const f=document.getElementById('gf');
 if(f){
   const cancel=document.getElementById('cancelEdit');
   cancel.onclick=()=>{editingId='';load()};
   f.onsubmit=async e=>{
     e.preventDefault();
     const b=Object.fromEntries(new FormData(f));
     b.active=!!f.elements.active?.checked;
     for(const k of ['sortOrder','priority','minOrder','fee','freeThreshold']) if(k in b)b[k]=Number(b[k]||0);
     const target=current+(editingId?'/'+encodeURIComponent(editingId):'');
     await api(target,{method:'POST',body:JSON.stringify(b)});
     editingId='';await load();await summary();
   };
 }
}
document.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{current=b.dataset.r;editingId='';document.querySelectorAll('[data-r]').forEach(x=>x.classList.toggle('active',x===b));load()});summary();load();
</script></body></html>`,headers)}
