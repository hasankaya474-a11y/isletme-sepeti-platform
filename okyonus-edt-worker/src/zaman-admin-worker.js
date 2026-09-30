import { commerceAdminApi, commerceAdminPage } from "./commerce-admin-v2.js";
/*
OKYANUS EDT — ZAMAN/ADMIN B2B YONETIM WORKER
v1.40 PRODUCT-CARD + CONTACT-FLOW PASS — 2026-09-23
Mimari: ZAMAN/ADMIN -> D1 -> DENIZ
Not: Mevcut admin, mesaj, studio ve yetki omurgasi korunur.
*/
const APP = 'Okyanus EDT Yönetici';
    const SESSION_SECONDS = 1800;
    const PASSWORD_ITERATIONS = 100000;
    const enc = new TextEncoder();

    export default {
      async fetch(request, env) {
        try {
          env={...env,DB:env.DB||env['Veritabanı']||env['Veritabani'],PHOTO_TEMP:env['FOTOĞRAF_TEMP']||env.PHOTO_TEMP,MEDIA_STORE:env.MEDIA_STORE||env['MEDYA_MAĞAZASI']||env['MEDYA_DEPO']};
          const url = new URL(request.url);
          const headers = securityHeaders();
          if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
          if (url.pathname === '/health') return json({
            ok: true,
            app: APP,
            release: '1.12.0-product-card-contact-flow-candidate',
            bindings: {
              database: !!env.DB,
              mediaStore: !!env.MEDIA_STORE,
              photoTemp: !!env.PHOTO_TEMP
            }
          }, 200, headers);
          if (url.pathname === '/setup') return json({ ok: false, error: 'NOT_FOUND' }, 404, headers);
          if (url.pathname.startsWith('/studio-media/')) return await publicStudioMedia(request, env, headers, url);
          if (url.pathname === '/login') return await loginRoute(request, env, headers);
          if (url.pathname === '/logout') return await logoutRoute(request, env, headers);

          const auth = await authenticate(request, env);
          if (!auth) return request.method === 'GET' && !url.pathname.startsWith('/api/')
            ? redirect('/login', headers)
            : json({ ok: false, error: 'UNAUTHORIZED' }, 401, headers);

          if (url.pathname === '/') return html(await dashboard(auth, env, url), 200, headers);
          if (url.pathname === '/commerce') { if (auth.user.role !== 'owner') throw http(403, 'OWNER_ONLY'); return commerceAdminPage(headers); }
           if (url.pathname === '/cesni') return html(await cesniAdminPage(auth, env), 200, headers);
          if (url.pathname === '/account/password') return await passwordRoute(request, env, auth, headers);
          if (url.pathname === '/print') return html(printPage(), 200, headers);
          if (url.pathname === '/api/me') return json({ ok: true, user: publicUser(auth.user) }, 200, headers);
          if (url.pathname === '/api/summary') return await summaryRoute(env, headers);
          if (url.pathname.startsWith('/api/')) {
            if (!['GET', 'HEAD'].includes(request.method)) { enforceOrigin(request); await requireCsrf(request, auth, env); }
            return await apiRoute(request, env, auth, headers);
          }
          return json({ ok: false, error: 'NOT_FOUND' }, 404, headers);
        } catch (error) {
          console.error(error?.stack || error);
          const status = error?.status || 500;
          return json({ ok: false, error: status === 500 ? 'INTERNAL_ERROR' : error.message }, status, securityHeaders());
        }
      }
    };

    async function setupRoute(request, env, headers) {
      const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM users').first();
      if (Number(count?.n || 0) > 0) return json({ ok: false, error: 'SETUP_CLOSED' }, 409, headers);
      if (request.method === 'GET') return html(setupPage(), 200, headers);
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      const isForm = String(request.headers.get('content-type')||'').includes('application/x-www-form-urlencoded');
      const body = isForm ? Object.fromEntries(await request.formData()) : await readJson(request);
      if (!env.BOOTSTRAP_TOKEN || !timingSafe(body.bootstrapToken || '', env.BOOTSTRAP_TOKEN)) throw http(403, 'INVALID_BOOTSTRAP_TOKEN');
      validateEmail(body.email); validatePassword(body.password);
      const now = new Date().toISOString();
      const id = crypto.randomUUID();
      const passwordHash = await hashPassword(body.password);
      await env.DB.prepare(`INSERT INTO users
        (id,email,display_name,password_hash,role,status,failed_login_count,password_changed_at,created_at,updated_at,version)
        VALUES (?,?,?,?,?,'active',0,?,?,?,1)`)
        .bind(id, body.email.trim().toLowerCase(), clean(body.displayName, 100), passwordHash, 'owner', now, now, now).run();
      await audit(env, { actorUserId: id, action: 'BOOTSTRAP_OWNER', entityType: 'user', entityId: id, after: { email: body.email.trim().toLowerCase(), role: 'owner' } });
      return isForm ? redirect('/login?setup=ok', headers) : json({ ok: true, message: 'OWNER_CREATED' }, 201, headers);
    }

    async function loginRoute(request, env, headers) {
      if (!env.SESSION_PEPPER) throw http(503, 'SESSION_SECRET_MISSING');
      if (request.method === 'GET') return html(loginPage(), 200, headers);
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      enforceAccess(request, env);
      const isForm = String(request.headers.get('content-type')||'').includes('application/x-www-form-urlencoded');
      const body = isForm ? Object.fromEntries(await request.formData()) : await readJson(request); validateEmail(body.email);
      const email = body.email.trim().toLowerCase();
      const user = await env.DB.prepare('SELECT * FROM users WHERE email=? LIMIT 1').bind(email).first();
      const suppliedPassword=String(body.password||'');
      if(user&&isFutureSqlite(user.locked_until)) throw http(401,'INVALID_CREDENTIALS');
      const passwordOk=Boolean(user&&await verifyPassword(suppliedPassword,user.password_hash));
      if (!user || user.status !== 'active' || !passwordOk) {
        if (user) await env.DB.prepare(`UPDATE users SET failed_login_count=failed_login_count+1,
          locked_until=CASE WHEN failed_login_count+1>=5 THEN datetime('now','+15 minutes') ELSE locked_until END,
          updated_at=datetime('now') WHERE id=?`).bind(user.id).run();
        throw http(401, 'INVALID_CREDENTIALS');
      }
      await env.DB.prepare(`UPDATE users SET failed_login_count=0,locked_until=NULL,last_login_at=datetime('now'),updated_at=datetime('now') WHERE id=?`).bind(user.id).run();
      const rawToken = randomToken(32), csrf = randomToken(24), now = new Date(), expires = new Date(now.getTime() + SESSION_SECONDS * 1000);
      const tokenHash = await sha256(rawToken + (env.SESSION_PEPPER || ''));
      const csrfHash = await sha256(csrf + (env.SESSION_PEPPER || ''));
      await env.DB.prepare(`INSERT INTO sessions(id,user_id,token_hash,csrf_secret_hash,ip_hash,user_agent,created_at,last_seen_at,expires_at)
        VALUES(?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(), user.id, tokenHash, csrfHash,
          await sha256(request.headers.get('CF-Connecting-IP') || ''), clean(request.headers.get('User-Agent') || '', 500),
          now.toISOString(), now.toISOString(), expires.toISOString()).run();
      await audit(env, { actorUserId: user.id, action: 'LOGIN', entityType: 'session', entityId: tokenHash.slice(0, 16) });
      const out = isForm ? redirect('/', headers) : json({ ok: true, csrf, user: publicUser(user) }, 200, headers);
      out.headers.append('Set-Cookie', `__Host-oky_admin=${rawToken}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
      out.headers.append('Set-Cookie', `__Host-oky_csrf=${csrf}; Path=/; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`);
      return out;
    }

    async function logoutRoute(request, env, headers) {
      if (request.method !== 'POST') return json({ ok: false, error: 'METHOD_NOT_ALLOWED' }, 405, headers);
      enforceOrigin(request);
      const auth = await authenticate(request, env);
      if (auth) { await requireCsrf(request, auth, env); await env.DB.prepare(`UPDATE sessions SET revoked_at=datetime('now'),revoke_reason='logout' WHERE id=?`).bind(auth.session.id).run(); }
      const out = json({ ok: true }, 200, headers);
      out.headers.append('Set-Cookie', '__Host-oky_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0');
      out.headers.append('Set-Cookie', '__Host-oky_csrf=; Path=/; Secure; SameSite=Strict; Max-Age=0');
      return out;
    }

    async function authenticate(request, env) {
      if (!env.SESSION_PEPPER) return null;
      enforceAccess(request, env);
      const token = cookie(request.headers.get('Cookie') || '', '__Host-oky_admin');
      if (!token) return null;
      const tokenHash = await sha256(token + (env.SESSION_PEPPER || ''));
      const row = await env.DB.prepare(`SELECT s.id session_id,s.user_id,s.csrf_secret_hash,s.expires_at,s.revoked_at,
        u.id,u.email,u.display_name,u.password_hash,u.role,u.status FROM sessions s JOIN users u ON u.id=s.user_id
        WHERE s.token_hash=? LIMIT 1`).bind(tokenHash).first();
      if (!row || row.revoked_at || row.expires_at <= new Date().toISOString() || row.status !== 'active') return null;
      await env.DB.prepare(`UPDATE sessions SET last_seen_at=datetime('now') WHERE id=?`).bind(row.session_id).run();
      return { session: { id: row.session_id }, user: row, csrfHash: row.csrf_secret_hash };
    }

    async function passwordRoute(request,env,auth,headers){
      if(request.method==='GET') return html(passwordPage(),200,headers);
      if(request.method!=='POST') throw http(405,'METHOD_NOT_ALLOWED');
      enforceOrigin(request); await requireCsrf(request,auth,env);
      const b=await readJson(request);
      if(!await verifyPassword(String(b.currentPassword||''),auth.user.password_hash)) throw http(401,'CURRENT_PASSWORD_INVALID');
      validatePassword(b.newPassword);
      if(String(b.currentPassword)===String(b.newPassword)) throw http(400,'PASSWORD_UNCHANGED');
      const hash=await hashPassword(String(b.newPassword));
      await env.DB.prepare(`UPDATE users SET password_hash=?,password_changed_at=datetime('now'),failed_login_count=0,locked_until=NULL,updated_at=datetime('now') WHERE id=?`).bind(hash,auth.user.id).run();
      await env.DB.prepare(`UPDATE sessions SET revoked_at=datetime('now'),revoke_reason='password_changed' WHERE user_id=? AND id<>? AND revoked_at IS NULL`).bind(auth.user.id,auth.session.id).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PASSWORD_CHANGED',entityType:'user',entityId:auth.user.id});
      return json({ok:true,message:'PASSWORD_CHANGED'},200,headers);
    }


    /* ==========================================================================
       DENIZ B2B ADMIN v1.0.0 | 2026-09-23
       ========================================================================== */
    async function adminB2bEnsure(env){
      if(!env||!env.DB) throw http(503,'B2B_DB_NOT_BOUND');
      const q=[
    `CREATE TABLE IF NOT EXISTS b2b_customers_v1(id TEXT PRIMARY KEY,business_id TEXT,company_name TEXT NOT NULL,contact_name TEXT,phone TEXT,email TEXT,delivery_region TEXT,sales_rep_id TEXT,status TEXT NOT NULL DEFAULT 'active',last_order_at TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_products_v1(id TEXT PRIMARY KEY,source_product_id TEXT,name TEXT NOT NULL,category TEXT NOT NULL DEFAULT 'Deniz Ürünleri',origin TEXT,freshness TEXT,processing TEXT,unit TEXT NOT NULL DEFAULT 'Kg',package_text TEXT,image_url TEXT,min_order REAL,stock_status TEXT NOT NULL DEFAULT 'ORDER',active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_prices_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,price REAL NOT NULL,currency TEXT NOT NULL DEFAULT 'TRY',valid_from TEXT NOT NULL DEFAULT (datetime('now')),valid_until TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_customer_prices_v1(id TEXT PRIMARY KEY,business_id TEXT NOT NULL,product_id TEXT NOT NULL,price REAL NOT NULL,currency TEXT NOT NULL DEFAULT 'TRY',valid_from TEXT NOT NULL DEFAULT (datetime('now')),valid_until TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')),UNIQUE(business_id,product_id))`,
    `CREATE TABLE IF NOT EXISTS b2b_quotes_v1(id TEXT PRIMARY KEY,quote_no TEXT NOT NULL UNIQUE,business_id TEXT,customer_id TEXT,company_name TEXT NOT NULL,contact_name TEXT,phone TEXT,email TEXT,delivery_region TEXT,note TEXT,status TEXT NOT NULL DEFAULT 'NEW',sales_rep_id TEXT,valid_until TEXT,total REAL NOT NULL DEFAULT 0,currency TEXT NOT NULL DEFAULT 'TRY',created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_quote_items_v1(id TEXT PRIMARY KEY,quote_id TEXT NOT NULL,product_id TEXT,product_name TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Kg',quantity REAL NOT NULL,unit_price REAL,line_total REAL,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_orders_v1(id TEXT PRIMARY KEY,order_no TEXT NOT NULL UNIQUE,quote_id TEXT,business_id TEXT,customer_id TEXT,status TEXT NOT NULL DEFAULT 'NEW',total REAL NOT NULL DEFAULT 0,currency TEXT NOT NULL DEFAULT 'TRY',delivery_region TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE UNIQUE INDEX IF NOT EXISTS idx_b2b_orders_quote_once ON b2b_orders_v1(quote_id) WHERE quote_id IS NOT NULL AND status<>'CANCELLED'`,
    `CREATE TABLE IF NOT EXISTS b2b_order_items_v1(id TEXT PRIMARY KEY,order_id TEXT NOT NULL,product_id TEXT,product_name TEXT NOT NULL,unit TEXT NOT NULL DEFAULT 'Kg',quantity REAL NOT NULL,unit_price REAL,line_total REAL,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_activity_v1(id TEXT PRIMARY KEY,business_id TEXT,customer_id TEXT,quote_id TEXT,order_id TEXT,action TEXT NOT NULL,detail TEXT,actor TEXT NOT NULL DEFAULT 'system',created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_price_history_v1(id TEXT PRIMARY KEY,product_id TEXT NOT NULL,business_id TEXT,old_price REAL,new_price REAL NOT NULL,actor TEXT,created_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_sales_representatives_v1(id TEXT PRIMARY KEY,name TEXT NOT NULL,phone TEXT,email TEXT,region TEXT,active INTEGER NOT NULL DEFAULT 1,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE TABLE IF NOT EXISTS b2b_showcase_v1(id TEXT PRIMARY KEY,slot TEXT NOT NULL DEFAULT 'seafood_b2b',category TEXT NOT NULL DEFAULT 'Deniz Ürünleri',title TEXT NOT NULL,subtitle TEXT,image_url TEXT,cta_text TEXT NOT NULL DEFAULT 'Ürünleri İncele',cta_url TEXT NOT NULL DEFAULT '/deniz-urunleri-b2b#urunler',active INTEGER NOT NULL DEFAULT 1,sort_order INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT (datetime('now')),updated_at TEXT NOT NULL DEFAULT (datetime('now')))`,
    `CREATE INDEX IF NOT EXISTS idx_b2b_showcase_active ON b2b_showcase_v1(slot,active,sort_order)`
      ];for(const s of q)await env.DB.prepare(s).run();
      const pcols=((await env.DB.prepare("PRAGMA table_info(b2b_products_v1)").all()).results||[]).map(x=>x.name);if(!pcols.includes("image_url"))await env.DB.prepare("ALTER TABLE b2b_products_v1 ADD COLUMN image_url TEXT").run();
      const qcols=((await env.DB.prepare("PRAGMA table_info(b2b_quotes_v1)").all()).results||[]).map(x=>x.name);
      for(const [name,type] of [["source_channel","TEXT"],["source_landing","TEXT"],["source_title","TEXT"],["source_group","TEXT"]])if(!qcols.includes(name))await env.DB.prepare(`ALTER TABLE b2b_quotes_v1 ADD COLUMN ${name} ${type}`).run();
      await env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_b2b_quotes_source_landing ON b2b_quotes_v1(source_landing,created_at)").run();
    }
    async function b2bAdminApi(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      await adminB2bEnsure(env);
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(request.method==='GET'&&!id){
        const status=String(url.searchParams.get('status')||'');
        const rows=status?(await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE status=? ORDER BY created_at DESC LIMIT 200`).bind(status).all()).results:
          (await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 ORDER BY created_at DESC LIMIT 200`).all()).results;
        return json({ok:true,data:rows||[]},200,headers);
      }
      if(request.method==='GET'&&id){
        const quote=await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!quote)throw http(404,'QUOTE_NOT_FOUND');
        const items=(await env.DB.prepare(`SELECT * FROM b2b_quote_items_v1 WHERE quote_id=? ORDER BY rowid`).bind(id).all()).results||[];
        return json({ok:true,data:{quote,items}},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toUpperCase();
        if(!['NEW','REVIEWING','PRICED','SENT','WAITING','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');
        const before=await env.DB.prepare(`SELECT id,status FROM b2b_quotes_v1 WHERE id=?`).bind(id).first();if(!before)throw http(404,'QUOTE_NOT_FOUND');
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(status,id).run();
        await env.DB.prepare(`INSERT INTO b2b_activity_v1(id,quote_id,action,detail,actor) VALUES(?,?,?,?,?)`).bind(crypto.randomUUID(),id,'QUOTE_STATUS_CHANGED',status,auth.user.id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_QUOTE_STATUS',entityType:'b2b_quote',entityId:id,before,after:{status}});
        return json({ok:true,status},200,headers);
      }
      if(request.method==='POST'&&id&&action==='price'){
        const b=await readJson(request);if(!Array.isArray(b.items))throw http(400,'INVALID_ITEMS');
        let total=0;
        for(const x of b.items){const itemId=String(x.id||''),price=Number(x.unitPrice);if(!itemId||!Number.isFinite(price)||price<0)throw http(400,'INVALID_PRICE');
          const row=await env.DB.prepare(`SELECT quantity FROM b2b_quote_items_v1 WHERE id=? AND quote_id=?`).bind(itemId,id).first();if(!row)throw http(404,'ITEM_NOT_FOUND');
          const line=Number(row.quantity)*price;total+=line;await env.DB.prepare(`UPDATE b2b_quote_items_v1 SET unit_price=?,line_total=? WHERE id=? AND quote_id=?`).bind(price,line,itemId,id).run();}
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET total=?,status='PRICED',valid_until=?,updated_at=datetime('now') WHERE id=?`).bind(total,b.validUntil||null,id).run();
        return json({ok:true,total,status:'PRICED'},200,headers);
      }
      if(request.method==='POST'&&id&&action==='order'){
        const q=await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE id=?`).bind(id).first();if(!q)throw http(404,'QUOTE_NOT_FOUND');
        if(!['PRICED','SENT','WAITING','WON'].includes(q.status))throw http(409,'QUOTE_NOT_READY');
        const existingOrder=await env.DB.prepare(`SELECT id,order_no FROM b2b_orders_v1 WHERE quote_id=? AND status<>'CANCELLED' LIMIT 1`).bind(id).first();
        if(existingOrder) return json({ok:true,orderId:existingOrder.id,orderNo:existingOrder.order_no,duplicate:true},200,headers);
        const orderId=crypto.randomUUID(),orderNo='OE-SIP-'+new Date().getUTCFullYear()+'-'+crypto.randomUUID().replace(/-/g,'').slice(0,8).toUpperCase();
        await env.DB.prepare(`INSERT INTO b2b_orders_v1(id,order_no,quote_id,business_id,customer_id,status,total,currency,delivery_region) VALUES(?,?,?,?,?,'NEW',?,?,?)`).bind(orderId,orderNo,id,q.business_id,q.customer_id,q.total,q.currency,q.delivery_region).run();
        const items=(await env.DB.prepare(`SELECT * FROM b2b_quote_items_v1 WHERE quote_id=?`).bind(id).all()).results||[];
        for(const x of items)await env.DB.prepare(`INSERT INTO b2b_order_items_v1(id,order_id,product_id,product_name,unit,quantity,unit_price,line_total) VALUES(?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),orderId,x.product_id,x.product_name,x.unit,x.quantity,x.unit_price,x.line_total).run();
        await env.DB.prepare(`UPDATE b2b_quotes_v1 SET status='WON',updated_at=datetime('now') WHERE id=?`).bind(id).run();
        if(q.customer_id)await env.DB.prepare(`UPDATE b2b_customers_v1 SET last_order_at=datetime('now'),status='active',updated_at=datetime('now') WHERE id=?`).bind(q.customer_id).run();
        await env.DB.prepare(`INSERT INTO b2b_activity_v1(id,business_id,customer_id,quote_id,order_id,action,detail,actor) VALUES(?,?,?,?,?,'ORDER_CREATED',? ,?)`).bind(crypto.randomUUID(),q.business_id,q.customer_id,id,orderId,orderNo,auth.user.id).run();
        return json({ok:true,orderId,orderNo},201,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }


    /* === DENIZ B2B ADMIN COMPLETION PACK v1.1 === */
    function b2bRoleWrite(auth){if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE')}
    function b2bTxt(v,n=500){return String(v??'').trim().replace(/[\u0000-\u001f]/g,' ').slice(0,n)}
    function b2bMoney(v){const n=Number(v);if(!Number.isFinite(n)||n<0||n>100000000)throw http(400,'INVALID_PRICE');return n}
    async function b2bCustomersApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'&&!id){
        const q=b2bTxt(url.searchParams.get('q')||'',80),like='%'+q+'%';
        const rows=(await env.DB.prepare(`SELECT c.*,
          (SELECT COUNT(*) FROM b2b_quotes_v1 q WHERE q.business_id=c.business_id OR q.customer_id=c.id) quote_count,
          (SELECT MAX(created_at) FROM b2b_quotes_v1 q WHERE q.business_id=c.business_id OR q.customer_id=c.id) last_quote_at
          FROM b2b_customers_v1 c WHERE (?='' OR company_name LIKE ? OR contact_name LIKE ? OR phone LIKE ? OR email LIKE ?)
          ORDER BY COALESCE(last_order_at,created_at) DESC LIMIT 300`).bind(q,like,like,like,like).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(request.method==='GET'&&id){
        const customer=await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!customer)throw http(404,'CUSTOMER_NOT_FOUND');
        const quotes=(await env.DB.prepare(`SELECT * FROM b2b_quotes_v1 WHERE customer_id=? OR (business_id IS NOT NULL AND business_id=?) ORDER BY created_at DESC LIMIT 100`).bind(id,customer.business_id||'').all()).results||[];
        const orders=(await env.DB.prepare(`SELECT * FROM b2b_orders_v1 WHERE customer_id=? OR (business_id IS NOT NULL AND business_id=?) ORDER BY created_at DESC LIMIT 100`).bind(id,customer.business_id||'').all()).results||[];
        return json({ok:true,data:{customer,quotes,orders}},200,headers);
      }
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){
        const b=await readJson(request),company=b2bTxt(b.companyName,160);if(!company)throw http(400,'COMPANY_REQUIRED');
        const cid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_customers_v1(id,business_id,company_name,contact_name,phone,email,delivery_region,sales_rep_id,status) VALUES(?,?,?,?,?,?,?,?,?)`)
          .bind(cid,b2bTxt(b.businessId,80)||null,company,b2bTxt(b.contactName,120),b2bTxt(b.phone,40),b2bTxt(b.email,200),b2bTxt(b.deliveryRegion,160),b2bTxt(b.salesRepId,80)||null,'active').run();
        return json({ok:true,id:cid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toLowerCase();if(!['active','follow_up','risky','dormant'].includes(status))throw http(400,'INVALID_STATUS');
        await env.DB.prepare(`UPDATE b2b_customers_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(status,id).run();return json({ok:true,status},200,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bProductsAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT p.*,
        (SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1) current_price
        FROM b2b_products_v1 p ORDER BY active DESC,name LIMIT 500`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){
        const b=await readJson(request),name=b2bTxt(b.name,220);if(!name)throw http(400,'PRODUCT_NAME_REQUIRED');const pid=crypto.randomUUID();
        await env.DB.prepare(`INSERT INTO b2b_products_v1(id,source_product_id,name,category,origin,freshness,processing,unit,package_text,image_url,min_order,stock_status,active) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1)`)
          .bind(pid,b2bTxt(b.sourceProductId,100)||null,name,b2bTxt(b.category,120)||'Deniz Ürünleri',b2bTxt(b.origin,100),b2bTxt(b.freshness,60),b2bTxt(b.processing,100),b2bTxt(b.unit,30)||'Kg',b2bTxt(b.packageText,140),b2bTxt(b.imageUrl,1200)||null,Number(b.minOrder||0),b2bTxt(b.stockStatus,30)||'ORDER').run();
        return json({ok:true,id:pid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='edit'){
        const b=await readJson(request),name=b2bTxt(b.name,220),category=b2bTxt(b.category,120),unit=b2bTxt(b.unit,30),image=b2bTxt(b.imageUrl,1200);
        if(!name||!category||!unit)throw http(400,'PRODUCT_FIELDS_REQUIRED');
        if(image&&!/^https:\/\/[^\s<>"']+$/i.test(image))throw http(400,'INVALID_IMAGE_URL');
        const old=await env.DB.prepare(`SELECT id,name,category,unit,package_text,image_url FROM b2b_products_v1 WHERE id=? LIMIT 1`).bind(id).first();if(!old)throw http(404,'PRODUCT_NOT_FOUND');
        await env.DB.prepare(`UPDATE b2b_products_v1 SET name=?,category=?,unit=?,package_text=?,image_url=?,updated_at=datetime('now') WHERE id=?`)
          .bind(name,category,unit,b2bTxt(b.packageText,140),image||null,id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_PRODUCT_EDIT',entityType:'b2b_product',entityId:id,before:old,after:{name,category,unit,package_text:b2bTxt(b.packageText,140),image_url:image||null}});
        return json({ok:true,id},200,headers);
      }
      if(request.method==='POST'&&id&&action==='stock'){const b=await readJson(request),st=String(b.stockStatus||'').toUpperCase();if(!['AVAILABLE','LIMITED','ORDER','OUT'].includes(st))throw http(400,'INVALID_STOCK_STATUS');await env.DB.prepare(`UPDATE b2b_products_v1 SET stock_status=?,updated_at=datetime('now') WHERE id=?`).bind(st,id).run();return json({ok:true,stockStatus:st},200,headers)}
      if(request.method==='POST'&&id&&action==='toggle'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_products_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active:!!active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bPricesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT * FROM b2b_prices_v1 ORDER BY created_at DESC LIMIT 500`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'){
        const b=await readJson(request),productId=b2bTxt(b.productId,100);if(!productId)throw http(400,'PRODUCT_REQUIRED');const price=b2bMoney(b.price);
        const old=await env.DB.prepare(`SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1`).bind(productId).first();
        await env.DB.prepare(`UPDATE b2b_prices_v1 SET active=0 WHERE product_id=? AND active=1`).bind(productId).run();
        await env.DB.prepare(`INSERT INTO b2b_prices_v1(id,product_id,price,currency,valid_until,active) VALUES(?,?,?,?,?,1)`).bind(crypto.randomUUID(),productId,price,b2bTxt(b.currency,8)||'TRY',b.validUntil||null).run();
        await env.DB.prepare(`INSERT INTO b2b_price_history_v1(id,product_id,old_price,new_price,actor) VALUES(?,?,?,?,?)`).bind(crypto.randomUUID(),productId,old?.price??null,price,auth.user.id).run();
        return json({ok:true,productId,price},201,headers);
      } throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bCustomerPricesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const businessId=b2bTxt(url.searchParams.get('businessId')||'',100);const rows=businessId?(await env.DB.prepare(`SELECT * FROM b2b_customer_prices_v1 WHERE business_id=? ORDER BY updated_at DESC`).bind(businessId).all()).results:[];return json({ok:true,data:rows||[]},200,headers)}
      b2bRoleWrite(auth);if(request.method==='POST'){const b=await readJson(request),businessId=b2bTxt(b.businessId,100),productId=b2bTxt(b.productId,100),price=b2bMoney(b.price);if(!businessId||!productId)throw http(400,'SCOPE_REQUIRED');
        const old=await env.DB.prepare(`SELECT price FROM b2b_customer_prices_v1 WHERE business_id=? AND product_id=?`).bind(businessId,productId).first();
        await env.DB.prepare(`INSERT INTO b2b_customer_prices_v1(id,business_id,product_id,price,currency,valid_until,active) VALUES(?,?,?,?,?,?,1)
          ON CONFLICT(business_id,product_id) DO UPDATE SET price=excluded.price,currency=excluded.currency,valid_until=excluded.valid_until,active=1,updated_at=datetime('now')`)
          .bind(crypto.randomUUID(),businessId,productId,price,b2bTxt(b.currency,8)||'TRY',b.validUntil||null).run();
        await env.DB.prepare(`INSERT INTO b2b_price_history_v1(id,product_id,business_id,old_price,new_price,actor) VALUES(?,?,?,?,?,?)`).bind(crypto.randomUUID(),productId,businessId,old?.price??null,price,auth.user.id).run();
        return json({ok:true},201,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bOrdersAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT * FROM b2b_orders_v1 ORDER BY created_at DESC LIMIT 300`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      if(request.method==='GET'&&id){const order=await env.DB.prepare(`SELECT * FROM b2b_orders_v1 WHERE id=?`).bind(id).first();if(!order)throw http(404,'ORDER_NOT_FOUND');const items=(await env.DB.prepare(`SELECT * FROM b2b_order_items_v1 WHERE order_id=?`).bind(id).all()).results||[];return json({ok:true,data:{order,items}},200,headers)}
      b2bRoleWrite(auth);if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),st=String(b.status||'').toUpperCase();if(!['NEW','CONFIRMED','PREPARING','DELIVERING','DELIVERED','CANCELLED'].includes(st))throw http(400,'INVALID_STATUS');await env.DB.prepare(`UPDATE b2b_orders_v1 SET status=?,updated_at=datetime('now') WHERE id=?`).bind(st,id).run();return json({ok:true,status:st},200,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bReportsAdminApi(request,env,auth,headers,url){
      await adminB2bEnsure(env);
      const totals=await env.DB.prepare(`SELECT COUNT(*) quote_count,COALESCE(SUM(total),0) quote_value,
        SUM(CASE WHEN status='WON' THEN 1 ELSE 0 END) won_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_value FROM b2b_quotes_v1`).first();
      const orders=await env.DB.prepare(`SELECT COUNT(*) order_count,COALESCE(SUM(total),0) order_value FROM b2b_orders_v1 WHERE status<>'CANCELLED'`).first();
      const products=(await env.DB.prepare(`SELECT product_name,SUM(quantity) quantity,COALESCE(SUM(line_total),0) value FROM b2b_order_items_v1 GROUP BY product_name ORDER BY quantity DESC LIMIT 20`).all()).results||[];
      const dormant=(await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE status IN ('risky','dormant') OR (last_order_at IS NOT NULL AND datetime(last_order_at)<datetime('now','-30 days')) ORDER BY last_order_at ASC LIMIT 100`).all()).results||[];
      const landingPerformance=(await env.DB.prepare(`SELECT COALESCE(source_landing,'DIRECT') source_landing,COALESCE(source_group,'') source_group,COUNT(*) quote_count,SUM(CASE WHEN status='WON' THEN 1 ELSE 0 END) won_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_value FROM b2b_quotes_v1 GROUP BY COALESCE(source_landing,'DIRECT'),COALESCE(source_group,'') ORDER BY quote_count DESC LIMIT 150`).all()).results||[];
      return json({ok:true,totals,orders,topProducts:products,dormantCustomers:dormant,landingPerformance},200,headers);
    }
    async function b2bDashboardApi(request,env,auth,headers){
      await adminB2bEnsure(env);
      const s=await env.DB.prepare(`SELECT COUNT(*) total,SUM(status='NEW') new_count,SUM(status='REVIEWING') reviewing_count,SUM(status='PRICED') priced_count,SUM(status='WON') won_count,SUM(status='LOST') lost_count,COALESCE(SUM(CASE WHEN status='WON' THEN total ELSE 0 END),0) won_total FROM b2b_quotes_v1`).first();
      const today=(await env.DB.prepare(`SELECT * FROM b2b_customers_v1 WHERE status IN ('follow_up','risky','dormant') ORDER BY COALESCE(last_order_at,created_at) ASC LIMIT 30`).all()).results||[];
      return json({ok:true,summary:s,todayCall:today},200,headers);
    }

    
    async function b2bRepresentativesAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT r.*,(SELECT COUNT(*) FROM b2b_customers_v1 c WHERE c.sales_rep_id=r.id) customer_count,(SELECT COUNT(*) FROM b2b_quotes_v1 q WHERE q.sales_rep_id=r.id) quote_count FROM b2b_sales_representatives_v1 r ORDER BY active DESC,name`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){const b=await readJson(request),name=b2bTxt(b.name,120);if(!name)throw http(400,'NAME_REQUIRED');const rid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_sales_representatives_v1(id,name,phone,email,region,active) VALUES(?,?,?,?,?,1)`).bind(rid,name,b2bTxt(b.phone,40),b2bTxt(b.email,200),b2bTxt(b.region,120)).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_REP_CREATE',entityType:'b2b_sales_rep',entityId:rid});return json({ok:true,id:rid},201,headers)}
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_sales_representatives_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function b2bShowcaseAdminApi(request,env,auth,headers,id,action,url){
      await adminB2bEnsure(env);
      if(request.method==='GET'){const rows=(await env.DB.prepare(`SELECT * FROM b2b_showcase_v1 ORDER BY active DESC,sort_order,id`).all()).results||[];return json({ok:true,data:rows},200,headers)}
      b2bRoleWrite(auth);
      if(request.method==='POST'&&!id){const b=await readJson(request),title=b2bTxt(b.title,160);if(!title)throw http(400,'TITLE_REQUIRED');const sid=crypto.randomUUID();await env.DB.prepare(`INSERT INTO b2b_showcase_v1(id,slot,category,title,subtitle,image_url,cta_text,cta_url,active,sort_order) VALUES(?,'seafood_b2b','Deniz Ürünleri',?,?,?,?,?,1,?)`).bind(sid,title,b2bTxt(b.subtitle,400),b2bTxt(b.imageUrl,1500),b2bTxt(b.ctaText,80)||'Ürünleri İncele',b2bTxt(b.ctaUrl,300)||'/deniz-urunleri-b2b#urunler',Number.isFinite(Number(b.sortOrder))?Number(b.sortOrder):0).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'B2B_SHOWCASE_CREATE',entityType:'b2b_showcase',entityId:sid});return json({ok:true,id:sid},201,headers)}
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),active=b.active?1:0;await env.DB.prepare(`UPDATE b2b_showcase_v1 SET active=?,updated_at=datetime('now') WHERE id=?`).bind(active,id).run();return json({ok:true,active},200,headers)}
      throw http(405,'METHOD_NOT_ALLOWED');
    }


    async function moduleFlagsEnsure(env){
      if(!env||!env.DB)throw http(503,'DB_NOT_BOUND');
      await env.DB.prepare(`CREATE TABLE IF NOT EXISTS oky_module_flags_v1(
        module_key TEXT PRIMARY KEY,
        enabled INTEGER NOT NULL DEFAULT 0 CHECK(enabled IN (0,1)),
        visibility TEXT NOT NULL DEFAULT 'HIDDEN' CHECK(visibility IN ('ACTIVE','HIDDEN','INTERNAL','SCHEDULED','ARCHIVED')),
        updated_by TEXT,
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      )`).run();
      const defaults={PRODUCTS:[1,'ACTIVE'],QUOTE:[1,'ACTIVE'],PHOTO:[1,'ACTIVE'],WHATSAPP:[1,'ACTIVE'],SEO:[1,'ACTIVE'],MEMBERSHIP:[1,'ACTIVE'],DIGITAL_MENU:[1,'ACTIVE'],COST:[0,'HIDDEN'],COST_RADAR:[0,'HIDDEN'],ACADEMY:[0,'HIDDEN'],CESNI:[0,'HIDDEN'],EASY_RECIPE:[0,'HIDDEN'],ABOUT:[0,'HIDDEN']};
      for(const [key,[enabled,visibility]] of Object.entries(defaults))await env.DB.prepare(`INSERT OR IGNORE INTO oky_module_flags_v1(module_key,enabled,visibility) VALUES(?,?,?)`).bind(key,enabled,visibility).run();
    }
    async function moduleFlagsRoute(request,env,auth,headers){
      await moduleFlagsEnsure(env);
      if(request.method==='GET'){
        const rows=(await env.DB.prepare(`SELECT module_key,enabled,visibility,updated_by,updated_at FROM oky_module_flags_v1 ORDER BY module_key`).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(!['owner','admin'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      if(request.method!=='POST')throw http(405,'METHOD_NOT_ALLOWED');
      const b=await readJson(request),key=String(b.moduleKey||'').trim().toUpperCase(),visibility=String(b.visibility||'').trim().toUpperCase(),enabled=b.enabled?1:0;
      if(!/^[A-Z0-9_]{2,50}$/.test(key))throw http(400,'INVALID_MODULE_KEY');
      if(!['ACTIVE','HIDDEN','INTERNAL','SCHEDULED','ARCHIVED'].includes(visibility))throw http(400,'INVALID_VISIBILITY');
      await env.DB.prepare(`INSERT INTO oky_module_flags_v1(module_key,enabled,visibility,updated_by,updated_at) VALUES(?,?,?,?,datetime('now')) ON CONFLICT(module_key) DO UPDATE SET enabled=excluded.enabled,visibility=excluded.visibility,updated_by=excluded.updated_by,updated_at=datetime('now')`).bind(key,enabled,visibility,auth.user.id).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'MODULE_FLAG_CHANGED',entityType:'module_flag',entityId:key,after:{enabled:Boolean(enabled),visibility}});
      return json({ok:true,moduleKey:key,enabled:Boolean(enabled),visibility},200,headers);
    }

async function apiRoute(request, env, auth, headers) {
      const url = new URL(request.url), parts = url.pathname.split('/').filter(Boolean);
      const resource = parts[1], id = parts[2], action = parts[3];

      // Mesaj Merkezi: mevcut inquiries + inquiry_replies tablolarını kullanır.
      if (resource === 'module-flags') return await moduleFlagsRoute(request,env,auth,headers);
      if (resource === 'commerce-admin') { if (auth.user.role !== 'owner') throw http(403,'OWNER_ONLY'); return await commerceAdminApi(request,env,auth,headers); }
      if (resource === 'b2b') return await b2bAdminApi(request, env, auth, headers, id, action, url);
      if (resource === 'b2b-customers') return await b2bCustomersApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-products') return await b2bProductsAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-prices') return await b2bPricesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-customer-prices') return await b2bCustomerPricesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-orders') return await b2bOrdersAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-reports') return await b2bReportsAdminApi(request,env,auth,headers,url);
      if (resource === 'b2b-dashboard') return await b2bDashboardApi(request,env,auth,headers);
      if (resource === 'b2b-representatives') return await b2bRepresentativesAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'b2b-showcase') return await b2bShowcaseAdminApi(request,env,auth,headers,id,action,url);
      if (resource === 'messages') return await messageCenterRoute(request, env, auth, headers, id, action, url);
      if (resource === 'photo-messages') return await photoMessageRouteV2(request, env, auth, headers, id, action, url);
      if (resource === 'studio') return await studioRoute(request, env, auth, headers, id, action, url);
      if (resource === 'studio-media') return await studioMediaRoute(request, env, auth, headers, id, action, url);
      if (resource === 'admin-cleanup') return await adminCleanupRoute(request, env, auth, headers, id, action, url);

      if (resource === 'release_items' && id) throw http(400, 'COMPOSITE_KEY_REQUIRED');
      const allowed = {
        inquiries: ['owner','admin','editor','viewer'],
        inquiry_replies: ['owner','admin','editor','viewer'],
        media: ['owner','admin','editor','viewer'],
        content: ['owner','admin','editor','viewer'],
        content_revisions: ['owner','admin','editor','viewer'],
        releases: ['owner','admin','editor','viewer'],
        release_items: ['owner','admin','editor','viewer'],
        users: ['owner','admin']
      };
      if (!allowed[resource] || !allowed[resource].includes(auth.user.role)) throw http(403, 'FORBIDDEN');
      if (request.method === 'GET') {
        const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 50), 1), 100);
        const rows = id
          ? [await env.DB.prepare(`SELECT * FROM ${resource} WHERE id=? LIMIT 1`).bind(id).first()].filter(Boolean)
          : (await env.DB.prepare(`SELECT * FROM ${resource} ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        await audit(env, { actorUserId: auth.user.id, actorSessionId: auth.session.id, action: 'READ', entityType: resource, entityId: id || 'list' });
        return json({ ok: true, data: redact(resource, rows) }, 200, headers);
      }
      if (!['owner','admin','editor'].includes(auth.user.role)) throw http(403, 'READ_ONLY_ROLE');
      if (request.method === 'POST' && resource === 'inquiry_replies') return createReply(request, env, auth, headers);
      if (request.method === 'POST' && resource === 'media') return createMediaLink(request, env, auth, headers);
      if (request.method === 'POST' && resource === 'content_revisions') return createRevision(request, env, auth, headers);
      throw http(405, 'METHOD_NOT_ALLOWED');
    }

    async function photoMessageRouteV2(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);if(!env.PHOTO_TEMP)throw http(503,'PHOTO_TEMP_NOT_BOUND');
      const publicCols=`id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at`;
      if(request.method==='GET'&&!id){const rows=(await env.DB.prepare(`SELECT ${publicCols} FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];const exists=await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='photo_notification_jobs_v1'").first();if(exists){const jobs=(await env.DB.prepare(`SELECT inquiry_id,state,attempts,last_error FROM photo_notification_jobs_v1 WHERE inquiry_id IN (SELECT id FROM photo_inquiries ORDER BY rowid DESC LIMIT 100)`).all()).results||[];const byId=new Map(jobs.map(j=>[j.inquiry_id,j]));for(const row of rows)row.notification=byId.get(row.id)||{state:'NOT_QUEUED'}}return json({ok:true,data:rows},200,headers)}
      if(request.method==='GET'&&id&&action==='file'){
        const token=String(url.searchParams.get('token')||'');if(!token)throw http(403,'TRANSFER_TOKEN_REQUIRED');const row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.deleted_at||['DELETE_PENDING','DELETED'].includes(row.status)||!row.temp_media_key)throw http(410,'PHOTO_DELETED');if(row.status!=='OPENED'||row.claimed_by!==auth.user.id||!row.claimed_at||Date.now()-Date.parse(String(row.claimed_at).replace(' ','T')+'Z')>600000||!timingSafe(await sha256(token),String(row.last_error||'')))throw http(409,'INVALID_TRANSFER_SESSION');
        const value=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(!value)throw http(410,'PHOTO_EXPIRED');if(value.byteLength!==Number(row.media_size)||await bytesSha256(value)!==String(row.media_sha256))throw http(409,'PHOTO_INTEGRITY_FAILED');await env.DB.prepare(`UPDATE photo_inquiries SET downloaded_at=datetime('now'),updated_at=datetime('now') WHERE id=? AND status='OPENED' AND claimed_by=?`).bind(id,auth.user.id).run();
        const h=new Headers(headers),safe=String(row.request_no||'okyanus').replace(/[^A-Za-z0-9_-]/g,'_'),ext=row.media_mime==='image/png'?'png':row.media_mime==='image/webp'?'webp':'jpg';h.set('Content-Type',['image/jpeg','image/png','image/webp'].includes(row.media_mime)?row.media_mime:'application/octet-stream');h.set('Content-Length',String(value.byteLength));h.set('Content-Disposition',`attachment; filename="${safe}.${ext}"`);h.set('Cache-Control','private, no-store, max-age=0');h.set('Pragma','no-cache');return new Response(value,{status:200,headers:h});
      }
      if(request.method==='GET'&&id){const row=await env.DB.prepare(`SELECT ${publicCols} FROM photo_inquiries WHERE id=? LIMIT 1`).bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');return json({ok:true,data:row},200,headers)}
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='view-start'){
        const token=randomToken(32),tokenHash=await sha256(token);const result=await env.DB.prepare(`UPDATE photo_inquiries SET status='OPENED',opened_at=COALESCE(opened_at,datetime('now')),claimed_by=?,claimed_at=datetime('now'),downloaded_at=NULL,last_error=?,updated_at=datetime('now'),version=version+1 WHERE id=? AND deleted_at IS NULL AND (status='NEW' OR (status='OPENED' AND (claimed_by=? OR claimed_at IS NULL OR datetime(claimed_at)<datetime('now','-10 minutes'))))`).bind(auth.user.id,tokenHash,id,auth.user.id).run();if(Number(result?.meta?.changes||0)!==1){const x=await env.DB.prepare('SELECT status,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!x)throw http(404,'PHOTO_NOT_FOUND');if(x.deleted_at||['DELETE_PENDING','DELETED'].includes(x.status))throw http(410,'PHOTO_DELETED');throw http(409,'PHOTO_ALREADY_CLAIMED')}await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_VIEW_STARTED',entityType:'photo_inquiry',entityId:id});return json({ok:true,transferToken:token,expiresIn:600},200,headers);
      }
      if(request.method==='POST'&&id&&action==='ack-delete'){
        const b=await readJson(request),token=String(b.transferToken||''),row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.status==='DELETED'||row.deleted_at)return json({ok:true,status:'DELETED',duplicate:true},200,headers);if(!['OPENED','DELETE_PENDING'].includes(row.status)||row.claimed_by!==auth.user.id||!row.downloaded_at||!token||!timingSafe(await sha256(token),String(row.last_error||''))||String(b.sha256||'')!==String(row.media_sha256||'')||Number(b.byteCount)!==Number(row.media_size))throw http(409,'TRANSFER_PROOF_MISMATCH');
        if(row.status==='OPENED'){const cas=await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETE_PENDING',updated_at=datetime('now'),version=version+1 WHERE id=? AND status='OPENED' AND claimed_by=? AND downloaded_at IS NOT NULL`).bind(id,auth.user.id).run();if(Number(cas?.meta?.changes||0)!==1)throw http(409,'DELETE_STATE_CONFLICT')}
        try{await env.PHOTO_TEMP.delete(row.temp_media_key);const remains=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(remains){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_PENDING',updated_at=datetime('now') WHERE id=?`).bind(id).run();return json({ok:true,status:'DELETE_PENDING',retry:true,message:'Silme doğrulanıyor; yeniden deneyin.'},202,headers)}await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETED',temp_media_key=NULL,deleted_at=datetime('now'),deletion_result='KV_DELETE_VERIFIED',last_error=NULL,updated_at=datetime('now'),version=version+1 WHERE id=? AND status='DELETE_PENDING'`).bind(id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_SUCCESS',entityType:'photo_inquiry',entityId:id});return json({ok:true,status:'DELETED'},200,headers)}catch(e){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_FAILED',updated_at=datetime('now') WHERE id=?`).bind(id).run();throw http(503,'PHOTO_DELETE_RETRY_REQUIRED')}
      }
      if(request.method==='POST'&&id&&action==='status'){const b=await readJson(request),status=String(b.status||'').toUpperCase();if(!['CONTACTED','QUOTED','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');const row=await env.DB.prepare('SELECT id,status,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(!row.deleted_at)throw http(409,'PHOTO_MUST_BE_DELETED_FIRST');await env.DB.prepare('UPDATE photo_inquiries SET status=?,updated_at=datetime(\'now\'),version=version+1 WHERE id=?').bind(status,id).run();return json({ok:true,status},200,headers)}throw http(405,'METHOD_NOT_ALLOWED');
    }
    async function bytesSha256(buffer){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',buffer))].map(x=>x.toString(16).padStart(2,'0')).join('')}

    async function photoMessageRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(!env.PHOTO_TEMP)throw http(503,'PHOTO_TEMP_NOT_BOUND');
      if(request.method==='GET'&&!id){
        const rows=(await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_sha256,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];
        return json({ok:true,data:rows},200,headers);
      }
      if(request.method==='GET'&&id&&action==='file'){
        const row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'PHOTO_NOT_FOUND');
        if(row.deleted_at||['DELETE_PENDING','DELETED'].includes(row.status)||!row.temp_media_key)throw http(410,'PHOTO_DELETED');
        if(row.status!=='OPENED'||row.claimed_by!==auth.user.id)throw http(409,'PHOTO_NOT_CLAIMED_BY_USER');
        const value=await env.PHOTO_TEMP.get(row.temp_media_key,{type:'arrayBuffer'});if(!value)throw http(410,'PHOTO_EXPIRED');
        const h=new Headers(headers);h.set('Content-Type',['image/jpeg','image/png','image/webp'].includes(row.media_mime)?row.media_mime:'application/octet-stream');h.set('Content-Length',String(row.media_size||value.byteLength));h.set('Content-Disposition',`attachment; filename="${String(row.request_no||'okyanus').replace(/[^A-Za-z0-9_-]/g,'_')}.${row.media_mime==='image/png'?'png':row.media_mime==='image/webp'?'webp':'jpg'}"`);h.set('Cache-Control','private, no-store, max-age=0');h.set('Pragma','no-cache');
        return new Response(value,{status:200,headers:h});
      }
      if(request.method==='GET'&&id){const row=await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,media_name,media_mime,media_size,media_sha256,media_expires_at,opened_at,downloaded_at,deleted_at,claimed_by,created_at,updated_at FROM photo_inquiries WHERE id=? LIMIT 1`).bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');return json({ok:true,data:row},200,headers)}
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST'&&id&&action==='view-start'){
        const current=await env.DB.prepare('SELECT id,status,claimed_by,deleted_at FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!current)throw http(404,'PHOTO_NOT_FOUND');if(current.deleted_at||['DELETE_PENDING','DELETED'].includes(current.status))throw http(410,'PHOTO_DELETED');
        if(current.status==='NEW'){const result=await env.DB.prepare(`UPDATE photo_inquiries SET status='OPENED',opened_at=COALESCE(opened_at,datetime('now')),claimed_by=?,claimed_at=COALESCE(claimed_at,datetime('now')),updated_at=datetime('now'),version=version+1 WHERE id=? AND status='NEW' AND deleted_at IS NULL`).bind(auth.user.id,id).run();if(Number(result?.meta?.changes||0)!==1)throw http(409,'PHOTO_ALREADY_CLAIMED')}
        else if(current.status!=='OPENED'||current.claimed_by!==auth.user.id)throw http(409,'PHOTO_ALREADY_CLAIMED');
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_VIEW_STARTED',entityType:'photo_inquiry',entityId:id});
        return json({ok:true},200,headers);
      }
      if(request.method==='POST'&&id&&action==='ack-delete'){
        const b=await readJson(request),row=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(row.status==='DELETED'||row.deleted_at)return json({ok:true,status:'DELETED',duplicate:true},200,headers);if(row.status!=='OPENED'||row.claimed_by!==auth.user.id)throw http(409,'INVALID_PHOTO_STATE');if(String(b.sha256||'')!==String(row.media_sha256||'')||Number(b.byteCount)!==Number(row.media_size))throw http(409,'TRANSFER_PROOF_MISMATCH');
        await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETE_PENDING',downloaded_at=datetime('now'),updated_at=datetime('now'),version=version+1 WHERE id=? AND status='OPENED' AND claimed_by=?`).bind(id,auth.user.id).run();
        try{await env.PHOTO_TEMP.delete(row.temp_media_key);await env.DB.prepare(`UPDATE photo_inquiries SET status='DELETED',temp_media_key=NULL,deleted_at=datetime('now'),deletion_result='KV_DELETE_OK',updated_at=datetime('now'),version=version+1 WHERE id=?`).bind(id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_SUCCESS',entityType:'photo_inquiry',entityId:id});return json({ok:true,status:'DELETED'},200,headers)}catch(e){await env.DB.prepare(`UPDATE photo_inquiries SET delete_attempts=delete_attempts+1,deletion_result='KV_DELETE_FAILED',last_error=?,updated_at=datetime('now') WHERE id=?`).bind(String(e?.message||e).slice(0,160),id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_DELETE_FAILED',entityType:'photo_inquiry',entityId:id});throw http(503,'PHOTO_DELETE_RETRY_REQUIRED')}
      }
      if(request.method==='POST'&&id&&action==='status'){
        const b=await readJson(request),status=String(b.status||'').toUpperCase();if(!['CONTACTED','QUOTED','WON','LOST'].includes(status))throw http(400,'INVALID_STATUS');const row=await env.DB.prepare('SELECT id,status FROM photo_inquiries WHERE id=? LIMIT 1').bind(id).first();if(!row)throw http(404,'PHOTO_NOT_FOUND');if(!row.status||!['DELETED','CONTACTED','QUOTED','WON','LOST'].includes(row.status))throw http(409,'PHOTO_MUST_BE_DELETED_FIRST');await env.DB.prepare('UPDATE photo_inquiries SET status=?,updated_at=datetime(\'now\'),version=version+1 WHERE id=?').bind(status,id).run();await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'PHOTO_STATUS',entityType:'photo_inquiry',entityId:id,before:row,after:{status}});return json({ok:true,status},200,headers)
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }

    async function messageCenterRoute(request, env, auth, headers, id, action, url) {
      if (!['owner','admin','editor','viewer'].includes(auth.user.role)) throw http(403,'FORBIDDEN');
      const canWrite = ['owner','admin','editor'].includes(auth.user.role);
      if (request.method === 'GET' && !id) {
        const box = String(url.searchParams.get('box') || 'inbox');
        const limit = Math.min(Math.max(Number(url.searchParams.get('limit') || 100),1),100);
        let rows=[];
        if(box==='sent') rows=(await env.DB.prepare(`SELECT r.*,i.name customer_name,i.email customer_email FROM inquiry_replies r LEFT JOIN inquiries i ON i.id=r.inquiry_id WHERE r.status='sent' ORDER BY r.rowid DESC LIMIT ?`).bind(limit).all()).results;
        else if(box==='archive') rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE status='archived' ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        else rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE COALESCE(status,'new')<>'archived' ORDER BY rowid DESC LIMIT ?`).bind(limit).all()).results;
        const unread=await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first();
        return json({ok:true,data:rows,unread:Number(unread?.n||0)},200,headers);
      }
      if (request.method === 'GET' && id) {
        const inquiry=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!inquiry)throw http(404,'MESSAGE_NOT_FOUND');
        const replies=(await env.DB.prepare('SELECT * FROM inquiry_replies WHERE inquiry_id=? ORDER BY rowid ASC').bind(id).all()).results;
        return json({ok:true,data:{inquiry,replies}},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      if(request.method==='POST' && id && action==='status'){
        const b=await readJson(request), status=String(b.status||'');
        if(!['new','read','replied','archived'].includes(status))throw http(400,'INVALID_STATUS');
        const before=await env.DB.prepare('SELECT id,status FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!before)throw http(404,'MESSAGE_NOT_FOUND');
        await env.DB.prepare('UPDATE inquiries SET status=? WHERE id=?').bind(status,id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'MESSAGE_STATUS',entityType:'inquiry',entityId:id,before,after:{status}});
        return json({ok:true,status},200,headers);
      }
      if(request.method==='POST' && id && action==='reply'){
        const b=await readJson(request), body=clean(b.body||'',10000), subject=clean(b.subject||'',200), mode=String(b.mode||'draft');
        if(!body)throw http(400,'MISSING_BODY');
        const inquiry=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(id).first();
        if(!inquiry)throw http(404,'MESSAGE_NOT_FOUND');
        const replyId=crypto.randomUUID(), now=new Date().toISOString(), recipient=clean(inquiry.email||'',320), finalSubject=subject||('Okyanus EDT · '+clean(inquiry.subject||'Mesajınız',150));
        if(mode!=='send'){
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'draft',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_DRAFT_REPLY',entityType:'inquiry_reply',entityId:replyId});
          return json({ok:true,id:replyId,status:'draft',message:'Taslak kaydedildi.'},201,headers);
        }
        validateEmail(recipient);
        try{
          await sendAdminEmail(env,{to:recipient,subject:finalSubject,text:body});
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'sent',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await env.DB.prepare(`UPDATE inquiries SET status='replied' WHERE id=?`).bind(id).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'SEND_REPLY',entityType:'inquiry_reply',entityId:replyId,after:{recipient}});
          return json({ok:true,id:replyId,status:'sent',message:'İleti başarıyla gönderildi.'},201,headers);
        }catch(e){
          console.error('ADMIN_REPLY_SEND_ERROR',e);
          await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at) VALUES(?,?,?,'email',?,?,?,'draft',?)`).bind(replyId,id,auth.user.id,recipient,finalSubject,body,now).run();
          await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'SEND_REPLY_FAILED',entityType:'inquiry_reply',entityId:replyId,after:{recipient,error:String(e?.message||e).slice(0,160)}});
          return json({ok:false,error:'SEND_FAILED_DRAFT_SAVED',draftId:replyId,message:'Gönderim başarısız oldu; yanıt taslak olarak saklandı.'},502,headers);
        }
      }
      throw http(404,'NOT_FOUND');
    }

    function adminMailConfig(env){return{from:String(env.ADMIN_MAIL_FROM||env.MAIL_FROM||'').trim()}}
    async function sendAdminEmail(env,m){
      if(!env||!env.EMAIL||typeof env.EMAIL.send!=='function')throw new Error('EMAIL_BINDING_MISSING');
      const cfg=adminMailConfig(env); if(!cfg.from)throw new Error('MAIL_FROM_MISSING');
      validateEmail(cfg.from); validateEmail(m.to);
      return await env.EMAIL.send({to:m.to,from:cfg.from,replyTo:cfg.from,subject:clean(m.subject,180),text:String(m.text||'')});
    }

    async function createReply(request, env, auth, headers) {
      const b = await readJson(request), id = crypto.randomUUID(), now = new Date().toISOString();
      if (!b.inquiryId || !b.body) throw http(400, 'MISSING_FIELDS');
      await env.DB.prepare(`INSERT INTO inquiry_replies(id,inquiry_id,author_id,channel,recipient,subject,body,status,created_at)
        VALUES(?,?,?,'internal_note',?,?,?,'draft',?)`).bind(id,b.inquiryId,auth.user.id,clean(b.recipient||'',320),clean(b.subject||'',200),clean(b.body,10000),now).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_DRAFT_REPLY',entityType:'inquiry_reply',entityId:id});
      return json({ok:true,id},201,headers);
    }

    async function studioRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role)) throw http(403,'FORBIDDEN');
      const canWrite=['owner','admin','editor'].includes(auth.user.role);
      if(request.method==='GET'&&!id){
        const rows=(await env.DB.prepare(`SELECT * FROM studio_projects ORDER BY updated_at DESC LIMIT 100`).all()).results||[];
        return json({ok:true,data:rows.map(studioPublic)},200,headers);
      }
      if(request.method==='GET'&&id){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND'); return json({ok:true,data:studioPublic(row)},200,headers);
      }
      if(!canWrite)throw http(403,'READ_ONLY_ROLE');
      const b=await readJson(request);
      if(request.method==='POST'&&!id){
        const pid=crypto.randomUUID(),now=new Date().toISOString(),payload=normalizeStudioPayload(b);
        await env.DB.prepare(`INSERT INTO studio_projects(id,title,status,platform,aspect_ratio,payload_json,created_by,created_at,updated_at) VALUES(?,?,'draft',?,?,?,?,?,?)`)
          .bind(pid,clean(b.title||'Adsız Stüdyo Projesi',180),payload.platform,payload.aspectRatio,JSON.stringify(payload),auth.user.id,now,now).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_CREATE',entityType:'studio_project',entityId:pid});
        return json({ok:true,id:pid},201,headers);
      }
      if(request.method==='POST'&&id&&action==='save'){
        const payload=normalizeStudioPayload(b); const title=clean(b.title||'Adsız Stüdyo Projesi',180);
        const r=await env.DB.prepare(`UPDATE studio_projects SET title=?,platform=?,aspect_ratio=?,payload_json=?,updated_at=datetime('now') WHERE id=?`).bind(title,payload.platform,payload.aspectRatio,JSON.stringify(payload),id).run();
        if(!r.meta?.changes)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_SAVE',entityType:'studio_project',entityId:id});
        return json({ok:true,id},200,headers);
      }
      if(request.method==='POST'&&id&&action==='remix'){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first(); if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        let p={};try{p=JSON.parse(row.payload_json||'{}')}catch{}; const scenes=Array.isArray(p.scenes)?p.scenes:[];
        const seed=crypto.randomUUID();
        p.scenes=studioRemixScenes(scenes,seed); p.rejiSeed=seed; p.rejiMode='automatic'; p.version=2;
        await env.DB.prepare(`UPDATE studio_projects SET payload_json=?,updated_at=datetime('now') WHERE id=?`).bind(JSON.stringify(p),id).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_REMIX',entityType:'studio_project',entityId:id});
        return json({ok:true,data:p},200,headers);
      }
      if(request.method==='POST'&&id&&action==='publish'){
        const row=await env.DB.prepare('SELECT * FROM studio_projects WHERE id=? LIMIT 1').bind(id).first();
        if(!row)throw http(404,'STUDIO_PROJECT_NOT_FOUND');
        let p={};try{p=JSON.parse(row.payload_json||'{}')}catch{throw http(409,'STUDIO_PAYLOAD_INVALID')}
        const scenes=Array.isArray(p.scenes)?p.scenes:[];
        if(!scenes.length)throw http(409,'STUDIO_SCENES_REQUIRED');
        const pubId=crypto.randomUUID(),now=new Date().toISOString();

        // D1 batch: vitrin durumu tek kontrollü yazma grubu içinde güncellenir.
        await env.DB.batch([
          env.DB.prepare(`UPDATE studio_publications SET active=0,updated_at=? WHERE slot='homepage_vitrine' AND active=1`).bind(now),
          env.DB.prepare(`UPDATE studio_projects SET status='superseded',updated_at=? WHERE status='published' AND id<>?`).bind(now,id),
          env.DB.prepare(`INSERT INTO studio_publications(id,project_id,slot,title,payload_json,active,published_by,published_at,updated_at) VALUES(?,?,'homepage_vitrine',?,?,1,?,?,?)`)
            .bind(pubId,id,clean(row.title,180),JSON.stringify(p),auth.user.id,now,now),
          env.DB.prepare(`UPDATE studio_projects SET status='published',updated_at=? WHERE id=?`).bind(now,id)
        ]);

        // Yazma sonrası doğrulama: yalnız bir aktif kayıt ve doğru proje.
        const check=await env.DB.prepare(`SELECT id,project_id,title,published_at FROM studio_publications WHERE slot='homepage_vitrine' AND active=1 ORDER BY published_at DESC LIMIT 2`).all();
        const activeRows=check.results||[];
        if(activeRows.length!==1||String(activeRows[0].id)!==pubId||String(activeRows[0].project_id)!==String(id)){
          throw http(500,'VITRINE_PUBLISH_VERIFY_FAILED');
        }

        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_PUBLISH_VITRINE',entityType:'studio_publication',entityId:pubId,after:{projectId:id,slot:'homepage_vitrine',verified:true}});
        return json({ok:true,publicationId:pubId,projectId:id,active:true,publishedAt:now,verified:true},201,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }
    function normalizeStudioPayload(b){
      const scenes=Array.isArray(b.scenes)?b.scenes.slice(0,30).map((s,i)=>({id:clean(s.id||('scene-'+(i+1)),80),type:['image','video','text'].includes(s.type)?s.type:'image',url:clean(s.url||'',2000),headline:clean(s.headline||'',180),text:clean(s.text||'',600),cta:clean(s.cta||'',80),duration:Math.min(Math.max(Number(s.duration||5),1),30),transition:['cut','fade','slide','zoom'].includes(s.transition)?s.transition:'fade',position:i})):[];
      return {version:2,platform:['web','instagram','tiktok','linkedin'].includes(b.platform)?b.platform:'web',aspectRatio:['16:9','1:1','9:16','4:5'].includes(b.aspectRatio)?b.aspectRatio:'16:9',rejiMode:b.rejiMode==='manual'?'manual':'automatic',musicUrl:clean(b.musicUrl||'',2000),voiceUrl:clean(b.voiceUrl||'',2000),logoUrl:clean(b.logoUrl||'',2000),scenes};
    }
    function studioRemixScenes(scenes,seed){
      const list=scenes.map((x,i)=>({...x,position:i})); if(list.length<2)return list;
      let h=0;for(const c of String(seed))h=(h*31+c.charCodeAt(0))>>>0;
      for(let i=list.length-1;i>0;i--){h=(1664525*h+1013904223)>>>0;const j=h%(i+1);[list[i],list[j]]=[list[j],list[i]]}
      const transitions=['fade','slide','zoom','cut'];return list.map((x,i)=>({...x,position:i,transition:transitions[(h+i)%transitions.length]}));
    }
    function studioPublic(r){let payload={};try{payload=JSON.parse(r.payload_json||'{}')}catch{};return {id:r.id,title:r.title,status:r.status,platform:r.platform,aspectRatio:r.aspect_ratio,payload,createdAt:r.created_at,updatedAt:r.updated_at}}


    async function publicStudioMedia(request,env,headers,url){
      if(!['GET','HEAD'].includes(request.method))throw http(405,'METHOD_NOT_ALLOWED');
      if(!env.MEDIA_STORE)throw http(503,'MEDIA_STORE_NOT_BOUND');
      const id=decodeURIComponent(url.pathname.slice('/studio-media/'.length)).replace(/[^A-Za-z0-9._-]/g,'');
      if(!id)throw http(404,'MEDIA_NOT_FOUND');
      const got=await env.MEDIA_STORE.getWithMetadata('studio/'+id,{type:'arrayBuffer',cacheTtl:60});
      if(!got||!got.value)throw http(404,'MEDIA_NOT_FOUND');
      const meta=got.metadata||{};
      const h=new Headers(headers);h.set('Content-Type',String(meta.mime||'application/octet-stream'));h.set('Cache-Control','public, max-age=3600, s-maxage=86400');h.set('X-Content-Type-Options','nosniff');
      if(meta.size)h.set('Content-Length',String(meta.size));
      return new Response(request.method==='HEAD'?null:got.value,{status:200,headers:h});
    }

    async function studioMediaRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin','editor','viewer'].includes(auth.user.role))throw http(403,'FORBIDDEN');
      if(!env.MEDIA_STORE)throw http(503,'MEDIA_STORE_NOT_BOUND');
      if(request.method==='POST'&&!id){
        if(!['owner','admin','editor'].includes(auth.user.role))throw http(403,'READ_ONLY_ROLE');
        const ct=String(request.headers.get('content-type')||'');if(!ct.includes('multipart/form-data'))throw http(415,'MULTIPART_REQUIRED');
        const fd=await request.formData(),file=fd.get('file');if(!file||typeof file.arrayBuffer!=='function')throw http(400,'FILE_REQUIRED');
        const mime=String(file.type||'').toLowerCase(),allowed=['image/jpeg','image/png','image/webp'];if(!allowed.includes(mime))throw http(415,'IMAGE_TYPE_NOT_ALLOWED');
        const max=8*1024*1024;if(Number(file.size||0)<1||Number(file.size)>max)throw http(413,'IMAGE_MAX_8_MB');
        const bytes=await file.arrayBuffer();if(bytes.byteLength>max)throw http(413,'IMAGE_MAX_8_MB');
        const ext=mime==='image/png'?'png':mime==='image/webp'?'webp':'jpg',mid=crypto.randomUUID()+'.'+ext,key='studio/'+mid;
        const originalName=clean(file.name||('gorsel.'+ext),255),now=new Date().toISOString(),digest=await bytesSha256(bytes);
        await env.MEDIA_STORE.put(key,bytes,{metadata:{mime,size:bytes.byteLength,name:originalName,uploadedBy:auth.user.id,uploadedAt:now}});
        const publicUrl=new URL('/studio-media/'+mid,request.url).href;
        try{
          await env.DB.prepare(`INSERT INTO media(id,storage_key,original_name,media_type,mime_type,byte_size,sha256,width,height,duration_ms,alt_text,title,metadata_json,status,created_by,created_at,updated_at) VALUES(?,?,?,?,?,?,?,NULL,NULL,NULL,?,?,?,'ready',?,?,?)`)
            .bind(mid,publicUrl,originalName,'image',mime,bytes.byteLength,digest,'',originalName,JSON.stringify({source:'studio-upload',kvKey:key}),auth.user.id,now,now).run();
        }catch(e){
          try{await env.MEDIA_STORE.delete(key)}catch(_){}
          throw e;
        }
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_MEDIA_UPLOAD',entityType:'media',entityId:mid,after:{mime,size:bytes.byteLength,url:publicUrl,sha256:digest}});
        return json({ok:true,id:mid,url:publicUrl,mime,size:bytes.byteLength,sha256:digest},201,headers);
      }
      if(request.method==='DELETE'&&id){
        if(!['owner','admin'].includes(auth.user.role))throw http(403,'FORBIDDEN');
        const safe=String(id).replace(/[^A-Za-z0-9._-]/g,'');if(!safe)throw http(400,'INVALID_MEDIA_ID');await env.MEDIA_STORE.delete('studio/'+safe);
        await env.DB.prepare(`DELETE FROM media WHERE id=? AND json_extract(metadata_json,'$.source')='studio-upload'`).bind(safe).run();
        await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'STUDIO_MEDIA_DELETE',entityType:'media',entityId:safe});return json({ok:true},200,headers);
      }
      throw http(405,'METHOD_NOT_ALLOWED');
    }

    async function adminCleanupRoute(request,env,auth,headers,id,action,url){
      if(!['owner','admin'].includes(auth.user.role))throw http(403,'OWNER_ADMIN_REQUIRED');
      if(request.method!=='POST')throw http(405,'METHOD_NOT_ALLOWED');
      const b=await readJson(request),kind=String(b.kind||''),ids=[...new Set((Array.isArray(b.ids)?b.ids:[]).map(x=>String(x||'').trim()).filter(Boolean))].slice(0,100);
      if(!ids.length)throw http(400,'NO_SELECTION');

      const result={deleted:[],blocked:[],failed:[],diagnostics:[]};
      for(const rid of ids){
        try{
          if(kind==='messages'){
            const row=await env.DB.prepare('SELECT id FROM inquiries WHERE id=? LIMIT 1').bind(rid).first();
            if(!row){result.failed.push({id:rid,error:'MESSAGE_NOT_FOUND'});continue}
            await env.DB.batch([
              env.DB.prepare('DELETE FROM inquiry_replies WHERE inquiry_id=?').bind(rid),
              env.DB.prepare('DELETE FROM inquiries WHERE id=?').bind(rid)
            ]);
            await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_DELETE_MESSAGE',entityType:'inquiry',entityId:rid});
            result.deleted.push(rid);
            continue;
          }

          if(kind==='media'){
            let stage='MEDIA_SELECT';
            try{
              const row=await env.DB.prepare('SELECT * FROM media WHERE id=? LIMIT 1').bind(rid).first();
              if(!row){result.failed.push({id:rid,error:'MEDIA_NOT_FOUND',stage});continue}
              const mediaUrl=String(row.storage_key||'');

              stage='PROJECT_REFERENCE_CHECK';
              const projectRef=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM studio_projects WHERE instr(COALESCE(payload_json,''), ?) > 0`).bind(mediaUrl).first())?.n||0);

              stage='PUBLICATION_REFERENCE_CHECK';
              const publicationRef=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM studio_publications WHERE active=1 AND instr(COALESCE(payload_json,''), ?) > 0`).bind(mediaUrl).first())?.n||0);
              if(projectRef||publicationRef){result.blocked.push({id:rid,error:'MEDIA_IN_USE',projectRef,publicationRef});continue}

              stage='METADATA_PARSE';
              let meta={};try{meta=JSON.parse(row.metadata_json||'{}')}catch(parseError){
                result.diagnostics.push({id:rid,stage,error:'INVALID_METADATA_JSON',detail:String(parseError?.message||parseError).slice(0,180)});
                meta={};
              }

              stage='MEDIA_SOFT_DELETE_UPDATE';
              const deletedAt=new Date().toISOString();
              const nextMeta={...meta,adminDeleted:true,adminDeletedAt:deletedAt,adminDeletedBy:auth.user.id};
              const upd=await env.DB.prepare(`UPDATE media SET metadata_json=?,updated_at=? WHERE id=?`).bind(JSON.stringify(nextMeta),deletedAt,rid).run();
              if(!upd?.success)throw new Error('D1_UPDATE_NOT_SUCCESSFUL');

              // Audit is important, but an audit write failure must not falsely report that
              // a successful media update itself failed. It is returned as a warning.
              stage='AUDIT_WRITE';
              try{
                await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_SOFT_DELETE_MEDIA',entityType:'media',entityId:rid,before:{storageKey:mediaUrl,source:meta.source||''},after:{adminDeleted:true}});
              }catch(auditError){
                console.error('ADMIN_MEDIA_AUDIT_ERROR',rid,auditError?.message||auditError);
                result.diagnostics.push({id:rid,stage:'AUDIT_WRITE',error:'AUDIT_WRITE_FAILED',detail:String(auditError?.message||auditError).slice(0,220)});
              }

              result.deleted.push(rid);
              continue;
            }catch(mediaError){
              const detail=String(mediaError?.message||mediaError).replace(/\s+/g,' ').slice(0,220);
              console.error('ADMIN_MEDIA_DELETE_DIAGNOSTIC',rid,stage,detail);
              result.failed.push({id:rid,error:'MEDIA_DELETE_FAILED',stage,detail});
              result.diagnostics.push({id:rid,stage,error:'MEDIA_DELETE_FAILED',detail});
              continue;
            }
          }

          if(kind==='content'){
            const row=await env.DB.prepare('SELECT * FROM content WHERE id=? LIMIT 1').bind(rid).first();
            if(!row){result.failed.push({id:rid,error:'CONTENT_NOT_FOUND'});continue}
            const revisions=Number((await env.DB.prepare('SELECT COUNT(*) n FROM content_revisions WHERE content_id=?').bind(rid).first())?.n||0);
            if(revisions){result.blocked.push({id:rid,error:'CONTENT_HAS_REVISIONS',revisions});continue}
            await env.DB.prepare('DELETE FROM content WHERE id=?').bind(rid).run();
            await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'ADMIN_DELETE_CONTENT',entityType:'content',entityId:rid});
            result.deleted.push(rid);
            continue;
          }
          throw http(400,'INVALID_CLEANUP_KIND');
        }catch(e){
          if(e?.status)throw e;
          const detail=String(e?.message||e).replace(/\s+/g,' ').slice(0,220);
          console.error('ADMIN_CLEANUP_ITEM_ERROR',kind,rid,detail);
          result.failed.push({id:rid,error:'DELETE_FAILED',stage:'OUTER_CLEANUP',detail});
          result.diagnostics.push({id:rid,stage:'OUTER_CLEANUP',error:'DELETE_FAILED',detail});
        }
      }
      return json({ok:true,...result},200,headers);
    }

    async function createMediaLink(request, env, auth, headers) {
      const b=await readJson(request); let parsed; try { parsed=new URL(b.url); } catch { throw http(400,'INVALID_URL'); }
      if(parsed.protocol!=='https:') throw http(400,'HTTPS_REQUIRED');
      const id=crypto.randomUUID(),now=new Date().toISOString(),type=['image','video','document'].includes(b.mediaType)?b.mediaType:'document',externalSha=await sha256(parsed.href);
      try{
        await env.DB.prepare(`INSERT INTO media(id,storage_key,original_name,media_type,mime_type,byte_size,sha256,width,height,duration_ms,alt_text,title,metadata_json,status,created_by,created_at,updated_at)
          VALUES(?,?,?,?,?,0,?,NULL,NULL,NULL,?,?,?,'pending',?,?,?)`).bind(id,parsed.href,clean(b.originalName||parsed.pathname.split('/').pop()||'harici-dosya',255),type,clean(b.mimeType||'application/octet-stream',120),externalSha,clean(b.altText||'',500),clean(b.title||'',200),JSON.stringify({external:true,source:'external-link'}),auth.user.id,now,now).run();
      }catch(e){
        console.error('CREATE_MEDIA_LINK_DB_ERROR',String(e?.message||e));
        throw http(500,'MEDIA_LINK_DB_WRITE_FAILED');
      }
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_MEDIA_LINK',entityType:'media',entityId:id,after:{url:parsed.href}});
      return json({ok:true,id},201,headers);
    }

    async function createRevision(request, env, auth, headers) {
      const b=await readJson(request), id=crypto.randomUUID(), now=new Date().toISOString();
      const last=await env.DB.prepare('SELECT COALESCE(MAX(revision_number),0) n FROM content_revisions WHERE content_id=?').bind(b.contentId).first();
      const n=Number(last?.n||0)+1;
      await env.DB.prepare(`INSERT INTO content_revisions(id,content_id,revision_number,payload_json,change_summary,validation_status,validation_json,created_by,created_at,approval_status)
        VALUES(?,?,?,?,?,'pending','{}',?,?,'draft')`).bind(id,b.contentId,n,JSON.stringify(b.payload||{}),clean(b.summary||'',500),auth.user.id,now).run();
      await audit(env,{actorUserId:auth.user.id,actorSessionId:auth.session.id,action:'CREATE_REVISION',entityType:'content_revision',entityId:id,after:{contentId:b.contentId,revision:n}});
      return json({ok:true,id,revision:n},201,headers);
    }

    async function summaryRoute(env, headers) {
      const names=['users','inquiries','media','content','releases']; const data={};
      for(const name of names) data[name]=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM ${name}`).first())?.n||0);
      return json({ok:true,data},200,headers);
    }

    async function audit(env, e) {
      await env.DB.prepare(`INSERT INTO audit_log(occurred_at,actor_user_id,actor_session_id,action,entity_type,entity_id,request_id,ip_hash,before_json,after_json,metadata_json)
        VALUES(?,?,?,?,?,?,?,?,?,?,?)`).bind(new Date().toISOString(),e.actorUserId||null,e.actorSessionId||null,e.action,e.entityType,e.entityId||null,crypto.randomUUID(),null,e.before?JSON.stringify(e.before):null,e.after?JSON.stringify(e.after):null,'{}').run();
    }

    async function requireCsrf(request, auth, env) {
      const token=request.headers.get('X-CSRF-Token')||'';
      if (!token) throw http(403,'CSRF_REQUIRED');
      const got=await sha256(token+(env.SESSION_PEPPER||''));
      if(!timingSafe(got,auth.csrfHash)) throw http(403,'CSRF_INVALID');
    }
    function enforceAccess(request, env) {
      if (env.REQUIRE_CF_ACCESS === 'true' && !request.headers.get('Cf-Access-Authenticated-User-Email')) throw http(403,'CLOUDFLARE_ACCESS_REQUIRED');
    }
    function enforceOrigin(request){
      const fetchSite=(request.headers.get('Sec-Fetch-Site')||'').toLowerCase();
      if(fetchSite==='cross-site') throw http(403,'ORIGIN_DENIED');
      if(fetchSite==='same-origin'||fetchSite==='same-site'||fetchSite==='none') return;
      const origin=request.headers.get('Origin');
      if(!origin) return;
      let originHost='';
      try{originHost=new URL(origin).host.toLowerCase()}catch{throw http(403,'ORIGIN_DENIED')}
      const requestHost=(request.headers.get('Host')||new URL(request.url).host).toLowerCase();
      const forwardedHost=(request.headers.get('X-Forwarded-Host')||'').split(',')[0].trim().toLowerCase();
      if(originHost!==requestHost&&originHost!==forwardedHost) throw http(403,'ORIGIN_DENIED');
    }
    async function readJson(request){ if(!String(request.headers.get('content-type')||'').includes('application/json')) throw http(415,'JSON_REQUIRED'); const t=await request.text(); if(t.length>65536) throw http(413,'PAYLOAD_TOO_LARGE'); try{return JSON.parse(t)}catch{throw http(400,'INVALID_JSON')} }
    function clean(v,n){return String(v||'').trim().slice(0,n)}
    function validateEmail(v){if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v||'')))throw http(400,'INVALID_EMAIL')}
    function validatePassword(v){if(String(v||'').length<14||!/[A-Z]/.test(v)||!/[a-z]/.test(v)||!/[0-9]/.test(v)||!/[^A-Za-z0-9]/.test(v))throw http(400,'WEAK_PASSWORD')}
    function randomToken(n){const a=new Uint8Array(n);crypto.getRandomValues(a);return b64(a)}
    function b64(a){return btoa(String.fromCharCode(...a)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
    async function sha256(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',enc.encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('')}
    async function hashPassword(password){const salt=randomToken(16),iterations=PASSWORD_ITERATIONS,key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']);const bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations},key,256);return `pbkdf2_sha256$${iterations}$${salt}$${b64(new Uint8Array(bits))}`}
    async function verifyPassword(password,stored){try{const[,it,salt,want]=stored.split('$'),key=await crypto.subtle.importKey('raw',enc.encode(password),'PBKDF2',false,['deriveBits']),bits=await crypto.subtle.deriveBits({name:'PBKDF2',hash:'SHA-256',salt:enc.encode(salt),iterations:Number(it)},key,256);return timingSafe(b64(new Uint8Array(bits)),want)}catch{return false}}
    function timingSafe(a,b){a=String(a);b=String(b);if(a.length!==b.length)return false;let x=0;for(let i=0;i<a.length;i++)x|=a.charCodeAt(i)^b.charCodeAt(i);return x===0}
    function cookie(s,n){const m=s.match(new RegExp('(?:^|;\\s*)'+n+'=([^;]+)'));return m?m[1]:''}
    function isFutureSqlite(v){if(!v)return false;const normalized=/T/.test(v)?v:String(v).replace(' ','T')+'Z';const t=Date.parse(normalized);return Number.isFinite(t)&&t>Date.now()}
    function publicUser(u){return{id:u.id,email:u.email,displayName:u.display_name,role:u.role}}
    function redact(resource,rows){return rows.map(r=>{const x={...r};delete x.password_hash;delete x.token_hash;delete x.csrf_secret_hash;if(resource==='inquiries'){if(x.email)x.email=x.email.replace(/(^.).*(@.*$)/,'$1***$2');if(x.phone)x.phone='***'+String(x.phone).slice(-4);delete x.request_ip_hash}return x})}
    function http(status,message){return Object.assign(new Error(message),{status})}
    function securityHeaders(){return new Headers({'Content-Security-Policy':"default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src 'self' data: https:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",'Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Permissions-Policy':'camera=(), microphone=(), geolocation=()','Cache-Control':'no-store'})}
    function json(v,status,h){const x=new Headers(h);x.set('Content-Type','application/json; charset=utf-8');return new Response(JSON.stringify(v),{status,headers:x})}
    function html(v,status,h){const x=new Headers(h);x.set('Content-Type','text/html; charset=utf-8');return new Response(v,{status,headers:x})}
    function redirect(p,h){const x=new Headers(h);x.set('Location',p);return new Response(null,{status:302,headers:x})}

    function shell(title,body){body=String(body).replace(/>DELETED</g,'>GÖRÜLDÜ – SİLİNDİ<').replace(/Durum:<\/b> DELETED/g,'Durum:</b> GÖRÜLDÜ – SİLİNDİ').replace('<div class="tablewrap"><table><thead><tr><th>Tarih</th><th>Talep No</th>','<div class="tablewrap photoTable"><table><thead><tr><th>Tarih</th><th>Talep No</th>');return `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title><style>${css()}.photoTable{overflow-x:auto}.photoTable table{width:100%;min-width:920px;table-layout:auto}.photoTable th,.photoTable td{white-space:nowrap;word-break:normal}.photoTable th:nth-child(1),.photoTable td:nth-child(1){min-width:185px}.photoTable th:nth-child(2),.photoTable td:nth-child(2){min-width:185px}.photoTable th:nth-child(3),.photoTable td:nth-child(3){min-width:135px}.photoTable th:nth-child(5),.photoTable td:nth-child(5){min-width:125px}.photoTable th:nth-child(6),.photoTable td:nth-child(6){min-width:155px}.photoTable td:last-child a{display:inline-flex;align-items:center;justify-content:center;min-width:52px;min-height:40px}</style><body><main>${body}</main></body></html>`}
    function setupPage(){return shell('İlk Kurulum',`<section class="card"><h1>Okyanus EDT</h1><h2>Güvenli ilk yönetici kurulumu</h2><form method="post" action="/setup"><input name="bootstrapToken" type="password" required placeholder="Tek kullanımlık kurulum anahtarı"><input name="displayName" required placeholder="Ad soyad"><input name="email" type="email" required placeholder="E-posta"><input name="password" type="password" required minlength="14" placeholder="En az 14 karakter güçlü şifre"><button type="submit">Yönetici hesabını oluştur</button></form></section>`)}
    function loginPage(){return shell('Yönetici Girişi',`<section class="card"><h1>Okyanus EDT</h1><h2>Yönetici Paneli</h2><form method="post" action="/login"><input name="email" type="email" required autocomplete="username" placeholder="E-posta"><input name="password" type="password" required autocomplete="current-password" placeholder="Şifre"><button type="submit">Güvenli giriş</button></form></section>`)}
    async function dashboard(user,env,url){
      const view=String(url.searchParams.get('view')||'summary');
      const box=String(url.searchParams.get('box')||'inbox');
      const selectedId=String(url.searchParams.get('id')||'');
      const role=user.user.role;
      const canWrite=['owner','admin','editor'].includes(role);
      const nav=`<nav class="sideNav"><a href="/?view=summary">⌂ Genel Bakış</a><a href="/commerce">🛒 Ticaret Yönetimi</a><a href="/?view=photo-messages">▣ Fotoğraflı Talepler</a><a href="/?view=messages&box=inbox">✉ Mesaj Merkezi</a><a href="/?view=studio">🎬 İçerik Stüdyosu</a><a href="/?view=media">▣ Medya</a><a href="/?view=content">▤ İçerik</a><a href="/?view=content_revisions">↻ Revizyonlar</a><a href="/?view=releases">✓ Yayınlar</a><a href="/?view=users">♙ Kullanıcılar</a><a href="/?view=module-flags">◉ Satış Modu & Modül Kontrolü</a><a href="/cesni">♨ ÇEŞNİ Yönetimi</a><a href="/account/password">⚿ Parola</a><a href="/print" target="_blank">▧ Rapor</a><a href="https://www.okyonusedt.com/" rel="noopener">🏠 Ana Siteye Geç</a><button id="logout" class="danger" type="button">Çıkış</button></nav>`;
      let title='Genel Bakış',help='Sistemin güncel durumunu izleyin.',body='';
      try{
        if(view==='summary'){
          const counts={}; for(const t of ['users','inquiries','media','content','releases']) counts[t]=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM ${t}`).first())?.n||0);
          const unread=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first())?.n||0);
          body=`<div class="stats">${[['users','Kullanıcı'],['inquiries','Mesaj'],['media','Medya'],['content','İçerik'],['releases','Yayın']].map(([k,l])=>`<article><b>${counts[k]}</b><span>${l}</span></article>`).join('')}</div><section class="guide"><h3>Hızlı kullanım</h3><p>Okunmamış mesaj: <b>${unread}</b>. Sol menüdeki her bölüm sunucu tarafında bağımsız açılır.</p></section>`;
        } else if(view==='photo-messages'){
          title='Fotoğraflı Talepler';help='Alış listesi fotoğraflarını güvenli biçimde teslim alın; tam aktarım sonrası geçici kopya otomatik silinir.';
          if(selectedId){const p=await env.DB.prepare('SELECT * FROM photo_inquiries WHERE id=? LIMIT 1').bind(selectedId).first();if(!p)throw new Error('PHOTO_NOT_FOUND');const tel=String(p.phone||'').replace(/[^0-9+]/g,''),wa=String(p.phone||'').replace(/\D/g,'').replace(/^0/,'90');body=`<section class="guide"><h3>${escapeHtml(p.request_no)}</h3><p><b>İşletme:</b> ${escapeHtml(p.business_name)}<br><b>Yetkili:</b> ${escapeHtml(p.contact_name)}<br><b>Telefon:</b> ${escapeHtml(p.phone)}<br><b>Durum:</b> ${escapeHtml(p.status)}<br><b>Oluşturma:</b> ${escapeHtml(p.created_at)}</p><div class="actions"><a class="button" href="tel:${escapeHtml(tel)}">Ara</a><a class="button" target="_blank" rel="noopener" href="https://wa.me/${escapeHtml(wa)}">WhatsApp</a>${canWrite&&!p.deleted_at&&!['DELETE_PENDING','DELETED'].includes(p.status)?'<button id="photoDownload" type="button">Fotoğrafı İndir ve Sistemden Sil</button>':''}</div><p><small>Silme yalnız dosyanın tamamı tarayıcıya ulaştıktan ve boyut/checksum doğrulandıktan sonra başlar. Bilgisayara indirilen kopyanın korunması işletme politikanıza tabidir.</small></p></section>`}
          else{const rows=(await env.DB.prepare(`SELECT id,request_no,business_name,contact_name,phone,status,created_at FROM photo_inquiries ORDER BY rowid DESC LIMIT 100`).all()).results||[];body=rows.length?`<div class="tablewrap"><table><thead><tr><th>Tarih</th><th>Talep No</th><th>İşletme</th><th>Yetkili</th><th>Telefon</th><th>Durum</th><th></th></tr></thead><tbody>${rows.map(p=>`<tr><td>${escapeHtml(p.created_at)}</td><td>${escapeHtml(p.request_no)}</td><td>${escapeHtml(p.business_name)}</td><td>${escapeHtml(p.contact_name)}</td><td>${escapeHtml(p.phone)}</td><td>${escapeHtml(p.status)}</td><td><a href="/?view=photo-messages&id=${encodeURIComponent(p.id)}">Aç</a></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Henüz fotoğraflı talep bulunmuyor.</div>'}
        } else if(view==='messages'){
          title='Mesaj Merkezi'; help='Gelen, giden ve arşiv müşteri yazışmalarını yönetin.';
          let rows=[];
          if(box==='sent') rows=(await env.DB.prepare(`SELECT r.*,i.name customer_name,i.email customer_email FROM inquiry_replies r LEFT JOIN inquiries i ON i.id=r.inquiry_id WHERE r.status='sent' ORDER BY r.rowid DESC LIMIT 100`).all()).results||[];
          else if(box==='archive') rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE status='archived' ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          else rows=(await env.DB.prepare(`SELECT * FROM inquiries WHERE COALESCE(status,'new')<>'archived' ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          const unread=Number((await env.DB.prepare(`SELECT COUNT(*) n FROM inquiries WHERE COALESCE(status,'new')='new'`).first())?.n||0);
          body=`<div class="msgTabs"><a href="/?view=messages&box=inbox">📥 Gelen ${unread?`<b>(${unread})</b>`:''}</a><a href="/?view=messages&box=sent">📤 Giden</a><a href="/?view=messages&box=archive">🗂 Arşiv</a></div>`;
          if(selectedId){
            const i=await env.DB.prepare('SELECT * FROM inquiries WHERE id=? LIMIT 1').bind(selectedId).first();
            if(i){const replies=(await env.DB.prepare('SELECT * FROM inquiry_replies WHERE inquiry_id=? ORDER BY rowid ASC').bind(selectedId).all()).results||[];
              body+=`<section class="guide"><h3>${escapeHtml(i.subject||'Mesaj')}</h3><p><b>${escapeHtml(i.name||'')}</b> · ${escapeHtml(i.email||'')} · ${escapeHtml(i.phone||'')}</p><p style="white-space:pre-wrap">${escapeHtml(i.message||'')}</p><h4>Konuşma geçmişi</h4>${replies.length?replies.map(r=>`<p><b>${escapeHtml(r.status)}</b> · ${escapeHtml(r.created_at)}<br>${escapeHtml(r.body)}</p>`).join(''):'<p>Henüz yanıt yok.</p>'}${canWrite?`<form id="replyForm" class="editor"><input name="subject" value="${escapeHtml('Okyanus EDT · '+(i.subject||'Mesajınız'))}"><textarea name="body" required placeholder="Yanıtınızı yazın"></textarea><div class="actions"><button type="button" id="draftBtn">Taslak Kaydet</button><button type="submit">Yanıtla ve Gönder</button><button type="button" id="archiveBtn">Arşivle</button></div></form>`:''}</section>`;
            }
          }
          if(!selectedId){const canDeleteMessages=['owner','admin'].includes(role)&&box!=='sent';body+=rows.length?`${canDeleteMessages?`<div class="actions"><label><input id="selectAllMessages" type="checkbox"> Tümünü Seç</label><button id="deleteSelectedMessages" class="danger" type="button">Seçilen Mesajları Sil</button></div>`:''}<div class="tablewrap"><table><thead><tr>${canDeleteMessages?'<th>Seç</th>':''}<th>Tarih</th><th>Ad</th><th>E-posta</th><th>Konu</th><th>Durum</th><th></th></tr></thead><tbody>${rows.map(r=>{const mid=r.inquiry_id||r.id;return `<tr>${canDeleteMessages?`<td><input class="messageSelect" type="checkbox" value="${escapeHtml(mid)}"></td>`:''}<td>${escapeHtml(r.created_at)}</td><td>${escapeHtml(r.name||r.customer_name||'')}</td><td>${escapeHtml(r.email||r.recipient||r.customer_email||'')}</td><td>${escapeHtml(r.subject||'')}</td><td>${escapeHtml(r.status||'')}</td><td>${mid?`<a href="/?view=messages&box=${encodeURIComponent(box)}&id=${encodeURIComponent(mid)}">Aç</a>`:''}</td></tr>`}).join('')}</tbody></table></div>`:'<div class="empty">Bu kutuda henüz kayıt bulunmuyor.</div>';}
        } else if(view==='studio'){
          title='İçerik Stüdyosu · Profesyonel Reji';help='Mevcut yönetim mimarisi korunarak çoklu sahne, otomatik/manuel reji, canlı önizleme ve Okyanus Vitrini yayını.';
          const projects=(await env.DB.prepare(`SELECT * FROM studio_projects ORDER BY updated_at DESC LIMIT 50`).all()).results||[];
          body=`<section class="studioGrid"><div class="editor"><h3>Yeni çalışma</h3><form id="studioForm"><input name="title" required maxlength="180" placeholder="Çalışma başlığı"><div class="grid"><select name="platform"><option value="web">Web</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="linkedin">LinkedIn</option></select><select name="aspectRatio"><option>16:9</option><option>1:1</option><option>9:16</option><option>4:5</option></select></div><select name="rejiMode"><option value="automatic">Otomatik Reji</option><option value="manual">Manuel Timeline</option></select><div class="grid"><input name="logoUrl" type="url" placeholder="Logo HTTPS bağlantısı"><input name="musicUrl" type="url" placeholder="Müzik HTTPS bağlantısı"></div><input name="voiceUrl" type="url" placeholder="Seslendirme HTTPS bağlantısı"><div class="studioToolbar"><b>Sahneler</b><button type="button" id="addScene">+ Sahne Ekle</button></div><div id="sceneList"></div><button>🎬 Taslak Oluştur</button></form></div><div class="studioPreview"><h3>Canlı Önizleme</h3><div id="studioStage" class="studioStage"><div id="stageMedia"></div><div class="stageCopy"><b>Okyanus EDT</b><span>İçeriğinizi soldan oluşturun.</span></div></div><div id="studioTimeline" class="studioTimeline"></div><p class="muted">Medya dosyasının kendisi D1 içine gömülmez. Proje, reji ve HTTPS medya referansları saklanır.</p></div></section>`;
          if(projects.length)body+=`<h3 style="margin-top:24px">Projeler</h3><div class="tablewrap"><table><thead><tr><th>Başlık</th><th>Durum</th><th>Platform</th><th>Güncelleme</th><th>İşlem</th></tr></thead><tbody>${projects.map(p=>`<tr><td>${escapeHtml(p.title)}</td><td>${escapeHtml(p.status)}</td><td>${escapeHtml(p.platform)}</td><td>${escapeHtml(p.updated_at)}</td><td><button class="studioRemix" data-id="${escapeHtml(p.id)}">Başka Montaj Yap</button><button class="studioPublish" data-id="${escapeHtml(p.id)}">Okyanus Vitrinine Gönder</button></td></tr>`).join('')}</tbody></table></div>`;
          else body+='<div class="empty">Henüz Stüdyo projesi yok.</div>';
        } else {
          const cfg={media:['Medya Bağlantıları','HTTPS medya kayıtlarını yönetin.'],content:['İçerikler','Yönetilebilir içerikleri görüntüleyin.'],content_revisions:['Revizyonlar','İçerik revizyonlarını yönetin.'],releases:['Yayınlar','Yayın paketlerini görüntüleyin.'],users:['Kullanıcılar','Yetkili kullanıcıları görüntüleyin.']};
          if(!cfg[view]) throw new Error('UNKNOWN_VIEW'); title=cfg[view][0];help=cfg[view][1];
          const rows=(await env.DB.prepare(view==='media'?`SELECT * FROM media WHERE COALESCE(json_extract(metadata_json,'$.adminDeleted'),0)<>1 ORDER BY rowid DESC LIMIT 100`:`SELECT * FROM ${view} ORDER BY rowid DESC LIMIT 100`).all()).results||[];
          if(view==='media'&&canWrite) body+=`<form id="mediaUploadForm" class="editor"><h3>Bilgisayardan görsel yükle</h3><div class="grid"><input id="mediaUploadFile" name="file" type="file" accept="image/jpeg,image/png,image/webp" required><input id="mediaUploadResult" readonly placeholder="Yükleme sonrası HTTPS adresi burada oluşur"></div><button>📷 Görseli Yükle</button><p class="muted">JPEG, PNG veya WebP · en fazla 8 MB · dosya MEDYA_MAĞAZASI (MEDIA_STORE uyumluluk adı) içinde saklanır.</p></form><form id="mediaForm" class="editor"><h3>Harici medya bağlantısı</h3><div class="grid"><input name="title" required placeholder="Başlık"><select name="mediaType"><option value="image">Görsel</option><option value="video">Video</option><option value="document">Belge</option></select><input name="url" type="url" required placeholder="https://..."><input name="altText" placeholder="Açıklama"></div><button>Bağlantıyı ekle</button></form>`;
          if(view==='content_revisions'&&canWrite) body+=`<form id="revisionForm" class="editor"><h3>Yeni revizyon taslağı</h3><div class="grid"><input name="contentId" required placeholder="İçerik ID"><input name="summary" required placeholder="Değişiklik özeti"></div><textarea name="payload" placeholder="JSON">{}</textarea><button>Taslak oluştur</button></form>`;
          if(rows.length){const hidden=new Set(['password_hash','token_hash','csrf_secret_hash','request_ip_hash']);const cols=Object.keys(rows[0]).filter(k=>!hidden.has(k)).slice(0,7),cleanupKind=(view==='media'||view==='content')?view:'',canCleanup=['owner','admin'].includes(role)&&!!cleanupKind;if(canCleanup)body+=`<div class="actions"><label><input id="selectAllCleanup" type="checkbox"> Tümünü Seç</label><button id="deleteSelectedCleanup" class="danger" data-kind="${cleanupKind}" type="button">Seçilenleri Sil</button><small class="muted">Yayında veya projede kullanılan kayıtlar korunur.</small></div>`;body+=`<div class="tablewrap"><table><thead><tr>${canCleanup?'<th>Seç</th>':''}${cols.map(c=>`<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${canCleanup?`<td><input class="cleanupSelect" type="checkbox" value="${escapeHtml(r.id)}"></td>`:''}${cols.map(c=>`<td>${escapeHtml(r[c]??'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`}else body+='<div class="empty">Henüz kayıt bulunmuyor.</div>';
        }
      }catch(e){console.error('DASHBOARD_VIEW_ERROR',view,e);body=`<div class="error">Bu bölüm yüklenemedi: ${escapeHtml(e.message||'DB_ERROR')}</div>`;}
      const safePhotoId=JSON.stringify(encodeURIComponent(selectedId));
      const actionScript=`${clientHelpers()}
      const post=async(url,data)=>{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf()},body:JSON.stringify(data)});const j=await r.json();if(!r.ok)throw Error(j.message||j.error||'İşlem başarısız');return j};
      const sam=document.querySelector('#selectAllMessages');if(sam)sam.onchange=()=>document.querySelectorAll('.messageSelect').forEach(x=>x.checked=sam.checked);
      const dsm=document.querySelector('#deleteSelectedMessages');if(dsm)dsm.onclick=async()=>{const ids=[...document.querySelectorAll('.messageSelect:checked')].map(x=>x.value);if(!ids.length)return alert('Silmek için en az bir mesaj seçin.');if(!confirm(ids.length+' mesaj kalıcı olarak silinsin mi?'))return;try{const j=await post('/api/admin-cleanup',{kind:'messages',ids});alert('Silinen: '+j.deleted.length+(j.failed.length?' · Hata: '+j.failed.length:''));location.reload()}catch(e){alert('Hata: '+e.message)}};
      const sac=document.querySelector('#selectAllCleanup');if(sac)sac.onchange=()=>document.querySelectorAll('.cleanupSelect').forEach(x=>x.checked=sac.checked);
      const dsc=document.querySelector('#deleteSelectedCleanup');if(dsc)dsc.onclick=async()=>{const ids=[...document.querySelectorAll('.cleanupSelect:checked')].map(x=>x.value),kind=dsc.dataset.kind;if(!ids.length)return alert('Silmek için en az bir kayıt seçin.');if(!confirm(ids.length+' kayıt kontrollü olarak silinsin mi?'))return;try{const j=await post('/api/admin-cleanup',{kind,ids});let m='Silinen: '+j.deleted.length;if(j.blocked.length)m+=' · Kullanımda olduğu için korunan: '+j.blocked.length;if(j.failed.length){const f=j.failed[0]||{};m+=' · Hata: '+j.failed.length+' · Aşama: '+(f.stage||'BILINMIYOR')+' · Neden: '+(f.detail||f.error||'DELETE_FAILED')}if(j.diagnostics&&j.diagnostics.length&&!j.failed.length)m+=' · Tanı: '+j.diagnostics.map(x=>(x.stage||'')+': '+(x.detail||x.error||'')).join(' | ');alert(m);if(!j.failed.length)location.reload()}catch(e){alert('Hata: '+e.message)}};
      const rf=document.querySelector('#replyForm');if(rf){rf.onsubmit=async e=>{e.preventDefault();try{const b=Object.fromEntries(new FormData(rf));b.mode='send';const j=await post('/api/messages/${encodeURIComponent(selectedId)}/reply',b);alert(j.message||'✓ İleti başarıyla gönderildi.');location='/?view=messages&box=sent'}catch(e){alert('Hata: '+e.message)}};document.querySelector('#draftBtn').onclick=async()=>{try{const b=Object.fromEntries(new FormData(rf));b.mode='draft';const j=await post('/api/messages/${encodeURIComponent(selectedId)}/reply',b);alert(j.message||'Taslak kaydedildi.');location.reload()}catch(e){alert('Hata: '+e.message)}};document.querySelector('#archiveBtn').onclick=async()=>{try{await post('/api/messages/${encodeURIComponent(selectedId)}/status',{status:'archived'});location='/?view=messages&box=archive'}catch(e){alert('Hata: '+e.message)}}}
      const muf=document.querySelector('#mediaUploadForm');if(muf)muf.onsubmit=async e=>{e.preventDefault();try{const f=document.querySelector('#mediaUploadFile').files[0];if(!f)throw Error('Görsel seçin');if(f.size>8*1024*1024)throw Error('Görsel en fazla 8 MB olabilir');const fd=new FormData();fd.append('file',f);const r=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrf()},body:fd});const j=await r.json();if(!r.ok)throw Error(j.message||j.error||'Yükleme başarısız');document.querySelector('#mediaUploadResult').value=j.url;alert('✓ Görsel yüklendi. HTTPS adresi hazır.')}catch(e){alert('Hata: '+e.message)}};const mf=document.querySelector('#mediaForm');if(mf)mf.onsubmit=async e=>{e.preventDefault();try{await post('/api/media',Object.fromEntries(new FormData(mf)));location.reload()}catch(e){alert('Hata: '+e.message)}};
      const vf=document.querySelector('#revisionForm');if(vf)vf.onsubmit=async e=>{e.preventDefault();try{const b=Object.fromEntries(new FormData(vf));b.payload=JSON.parse(b.payload||'{}');await post('/api/content_revisions',b);location.reload()}catch(e){alert('Hata: '+e.message)}};
      const pd=document.querySelector('#photoDownload');if(pd)pd.onclick=async()=>{if(!confirm('Fotoğraf tam indirildikten sonra sistemdeki geçici kopya silinecek. Devam edilsin mi?'))return;pd.disabled=true;const photoId=${safePhotoId};try{const start=await post('/api/photo-messages/'+photoId+'/view-start',{}),token=start.transferToken;const q=await fetch('/api/photo-messages/'+photoId+'/file?token='+encodeURIComponent(token),{cache:'no-store'});if(!q.ok){let x={};try{x=await q.json()}catch{}throw Error(x.error||'Fotoğraf alınamadı')}const blob=await q.blob(),bytes=await blob.arrayBuffer(),digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join(''),a=document.createElement('a'),u=URL.createObjectURL(new Blob([bytes],{type:blob.type||'application/octet-stream'}));a.href=u;a.download=photoId+'-alis-listesi';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),30000);let done=await post('/api/photo-messages/'+photoId+'/ack-delete',{transferToken:token,sha256:digest,byteCount:bytes.byteLength});if(done.status==='DELETE_PENDING'){await new Promise(r=>setTimeout(r,1200));done=await post('/api/photo-messages/'+photoId+'/ack-delete',{transferToken:token,sha256:digest,byteCount:bytes.byteLength})}alert(done.status==='DELETED'?'Fotoğraf indirildi ve sistemdeki geçici kopya silindi.':'Fotoğraf indirildi; silme doğrulaması devam ediyor.');location.reload()}catch(e){alert('Hata: '+e.message);pd.disabled=false}};
      const sf=document.querySelector('#studioForm');if(sf){const stage=document.querySelector('#studioStage'),stageMedia=document.querySelector('#stageMedia'),timeline=document.querySelector('#studioTimeline'),sceneList=document.querySelector('#sceneList');let scenes=[];
      const sceneCard=(x,i)=>'<div class="sceneCard" data-i="'+i+'"><div class="sceneHead"><b>Sahne '+(i+1)+'</b><span><button type="button" class="sceneUp">↑</button><button type="button" class="sceneDown">↓</button><button type="button" class="sceneDelete danger">Sil</button></span></div><div class="grid"><select class="sType"><option value="image" '+(x.type==='image'?'selected':'')+'>Görsel</option><option value="video" '+(x.type==='video'?'selected':'')+'>Video</option><option value="text" '+(x.type==='text'?'selected':'')+'>Metin</option></select><input class="sDuration" type="number" min="1" max="30" value="'+escClient(x.duration||5)+'" placeholder="Süre"></div><div class="grid"><input class="sUrl" type="url" value="'+escClient(x.url||'')+'" placeholder="HTTPS görsel/video bağlantısı"><label class="button sceneUploadLabel">📷 Görsel Seç<input class="sFile" type="file" accept="image/jpeg,image/png,image/webp" hidden></label></div><small class="uploadState muted"></small><input class="sHeadline" maxlength="180" value="'+escClient(x.headline||'')+'" placeholder="Başlık"><textarea class="sText" maxlength="600" placeholder="Metin">'+escClient(x.text||'')+'</textarea><div class="grid"><input class="sCta" maxlength="80" value="'+escClient(x.cta||'')+'" placeholder="CTA"><select class="sTransition"><option value="fade">Fade</option><option value="slide">Slide</option><option value="zoom">Zoom</option><option value="cut">Cut</option></select></div></div>';
      const sync=()=>{[...sceneList.querySelectorAll('.sceneCard')].forEach((c,i)=>{const x=scenes[i];x.type=c.querySelector('.sType').value;x.duration=Number(c.querySelector('.sDuration').value||5);x.url=c.querySelector('.sUrl').value;x.headline=c.querySelector('.sHeadline').value;x.text=c.querySelector('.sText').value;x.cta=c.querySelector('.sCta').value;x.transition=c.querySelector('.sTransition').value})};
      const render=()=>{sceneList.innerHTML=scenes.map(sceneCard).join('');sceneList.querySelectorAll('.sceneCard').forEach((c,i)=>{c.querySelector('.sTransition').value=scenes[i].transition||'fade';c.oninput=preview;const fi=c.querySelector('.sFile'),us=c.querySelector('.uploadState');if(fi)fi.onchange=async()=>{const f=fi.files&&fi.files[0];if(!f)return;if(f.size>8*1024*1024){alert('Görsel en fazla 8 MB olabilir.');fi.value='';return}try{us.textContent='Yükleniyor...';const fd=new FormData();fd.append('file',f);const rr=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrf()},body:fd});const jj=await rr.json();if(!rr.ok)throw Error(jj.message||jj.error||'Yükleme başarısız');c.querySelector('.sUrl').value=jj.url;scenes[i].url=jj.url;scenes[i].type='image';c.querySelector('.sType').value='image';us.textContent='✓ Görsel yüklendi';preview()}catch(e){us.textContent='';alert('Görsel yükleme hatası: '+e.message)}};c.querySelector('.sceneDelete').onclick=()=>{sync();scenes.splice(i,1);if(!scenes.length)scenes.push({type:'image',duration:5,transition:'fade'});render();preview()};c.querySelector('.sceneUp').onclick=()=>{sync();if(i>0)[scenes[i-1],scenes[i]]=[scenes[i],scenes[i-1]];render();preview()};c.querySelector('.sceneDown').onclick=()=>{sync();if(i<scenes.length-1)[scenes[i+1],scenes[i]]=[scenes[i],scenes[i+1]];render();preview()}});preview()};
      function preview(){sync();const b=Object.fromEntries(new FormData(sf)),x=scenes[0]||{};stage.style.aspectRatio=(b.aspectRatio||'16:9').replace(':','/');stage.querySelector('.stageCopy b').textContent=x.headline||b.title||'Okyanus EDT';stage.querySelector('.stageCopy span').textContent=x.text||x.cta||'Canlı önizleme';stageMedia.innerHTML='';if(x.url){if(x.type==='video')stageMedia.innerHTML='<video muted playsinline controls src="'+escClient(x.url)+'"></video>';else if(x.type==='image')stageMedia.innerHTML='<img alt="" src="'+escClient(x.url)+'">'}timeline.innerHTML=scenes.map((z,i)=>'<span title="'+escClient(z.transition||'fade')+'">'+(i+1)+' · '+escClient(z.duration||5)+'sn</span>').join('')}
      document.querySelector('#addScene').onclick=()=>{sync();if(scenes.length>=30)return alert('En fazla 30 sahne kullanılabilir.');scenes.push({type:'image',duration:5,transition:'fade'});render()};sf.onsubmit=async e=>{e.preventDefault();try{sync();const b=Object.fromEntries(new FormData(sf));b.scenes=scenes;await post('/api/studio',b);location.reload()}catch(e){alert('Hata: '+e.message)}};scenes=[{type:'image',duration:5,transition:'fade'}];render()}
      document.querySelectorAll('.studioRemix').forEach(b=>b.onclick=async()=>{try{await post('/api/studio/'+encodeURIComponent(b.dataset.id)+'/remix',{});alert('Yeni otomatik montaj üretildi.');location.reload()}catch(e){alert('Hata: '+e.message)}});
      document.querySelectorAll('.studioPublish').forEach(b=>b.onclick=async()=>{if(!confirm('Bu çalışma ana sayfadaki Okyanus Vitrinine gönderilsin mi?'))return;try{await post('/api/studio/'+encodeURIComponent(b.dataset.id)+'/publish',{});alert('✓ Okyanus Vitrinine yayınlandı.');location.reload()}catch(e){alert('Hata: '+e.message)}});
      function escClient(v){return String(v||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
      document.querySelector('#logout').onclick=async()=>{try{const r=await fetch('/logout',{method:'POST',headers:{'X-CSRF-Token':csrf()}});if(r.ok)location='/login'}catch(e){location='/login'}};`;
      return shell('Yönetici Paneli',`<button id="menuToggle" class="menuToggle" type="button">☰ Yönetim</button><div id="menuShade" class="menuShade"></div><aside id="sideMenu" class="sideMenu"><div class="sideBrand"><h2>Okyanus EDT</h2><small>Yönetici Merkezi</small></div><div class="sideUser">${escapeHtml(user.user.display_name)}<small>${escapeHtml(role)}</small></div>${nav}</aside><div class="adminContent"><header><div><h1>Okyanus EDT Yönetici</h1><small>Güvenli içerik ve iletişim merkezi</small></div><span class="user">${escapeHtml(user.user.display_name)} · ${escapeHtml(role)}</span></header><section class="panel"><div class="panelhead"><div><h2>${escapeHtml(title)}</h2><p>${escapeHtml(help)}</p></div><a class="button" href="${escapeHtml(url.pathname+url.search)}">Yenile</a></div>${body}<div id="notice"></div></section><script>${actionScript}</script></div>`);
    }

    async function cesniAdminPage(user, env){
      const one = async (sql) => Number((await env.DB.prepare(sql).first())?.n || 0);

      const items = await one(`SELECT COUNT(*) AS n FROM cesni_items`);
      const sources = await one(`SELECT COUNT(*) AS n FROM cesni_sources`);
      const claims = await one(`SELECT COUNT(*) AS n FROM cesni_claims`);
      const aromas = await one(`SELECT COUNT(*) AS n FROM cesni_aroma_profiles`);
      const blocking = await one(`SELECT COUNT(*) AS n FROM cesni_validation_queue WHERE severity='blocking' AND status='open'`);
      const approvals = await one(`SELECT COUNT(*) AS n FROM cesni_approvals WHERE decision='approved'`);

      const rows = (await env.DB.prepare(`
        SELECT
          i.id,
          i.name_tr,
          i.name_original,
          i.item_type,
          i.status,
          a.aroma_summary,
          a.intensity,
          (
            SELECT COUNT(*)
            FROM cesni_claims c
            WHERE c.item_id=i.id
          ) AS claim_count,
          (
            SELECT COUNT(*)
            FROM cesni_validation_queue v
            WHERE v.entity_type='item'
              AND v.entity_id=i.id
              AND v.severity='blocking'
              AND v.status='open'
          ) AS blocking_count
        FROM cesni_items i
        LEFT JOIN cesni_aroma_profiles a ON a.item_id=i.id
        ORDER BY i.id
        LIMIT 106
      `).all()).results || [];

      const qaState = blocking > 0 ? 'BEKLEMEDE' : 'QA PASS';
      const publishState = blocking > 0 ? 'KAPALI' : 'KONTROLE HAZIR';

      const tableRows = rows.map(r => `<tr>
        <td>${escapeHtml(r.id)}</td>
        <td>${escapeHtml(r.name_tr)}</td>
        <td>${escapeHtml(r.name_original || '—')}</td>
        <td>${escapeHtml(r.aroma_summary || '—')}</td>
        <td>${escapeHtml(r.intensity ?? '—')}</td>
        <td>${escapeHtml(r.claim_count)}</td>
        <td>${escapeHtml(r.blocking_count)}</td>
        <td>${escapeHtml(r.status)}</td>
      </tr>`).join('');

      return shell('ÇEŞNİ Yönetim Merkezi',`
      <header>
        <div>
          <h1>ÇEŞNİ Yönetim Merkezi</h1>
          <small>Okyanus EDT · gerçek D1 veri, QA ve yayın merkezi</small>
        </div>
        <span class="user">${escapeHtml(user.user.display_name)} · ${escapeHtml(user.user.role)}</span>
      </header>

      <nav>
        <a href="/">← Yönetici Ana Sayfa</a>
        <a href="/cesni">↻ D1 Verilerini Yenile</a>
        <a href="https://okyanus-edt-v2.hasan-kaya474.workers.dev/cesni" target="_blank" rel="noopener noreferrer">Ziyaretçi ÇEŞNİ Önizleme ↗</a>
      </nav>

      <section class="panel">
        <div class="panelhead">
          <div>
            <h2>ÇEŞNİ Kontrol Merkezi</h2>
            <p>RAW → PARSED → NORMALIZED → CROSS CHECK → QA PASS → APPROVED → PUBLISHED</p>
          </div>
        </div>

        <div class="stats">
          <article><b>${items}</b><span>D1 ürün kaydı</span></article>
          <article><b>${aromas}</b><span>Aroma profili</span></article>
          <article><b>${claims}</b><span>Kaynak claim</span></article>
          <article><b>${blocking}</b><span>Açık blocking QA</span></article>
          <article><b>${sources}</b><span>Kaynak</span></article>
        </div>

        <div class="grid">
          <section class="guide">
            <h3>1 · Veri & Kaynak</h3>
            <p><b>${items}</b> ürün · <b>${aromas}</b> aroma · <b>${claims}</b> claim · <b>${sources}</b> kaynak.</p>
            <p>Bu değerler artık sabit HTML değil, doğrudan Yönetici D1 veritabanından okunuyor.</p>
          </section>

          <section class="guide">
            <h3>2 · QA & Güvenlik</h3>
            <p>Açık blocking kontrol: <b>${blocking}</b></p>
            <p>QA durumu: <b>${qaState}</b></p>
          </section>

          <section class="guide">
            <h3>3 · Onay</h3>
            <p>Onay kayıtları: <b>${approvals}</b></p>
            <p>${blocking > 0 ? 'Blocking kayıtlar çözülmeden APPROVED aşamasına geçilmeyecek.' : 'Blocking kontrol kalmadı; onay aşaması ayrıca yetkili kararı gerektirir.'}</p>
          </section>

          <section class="guide">
            <h3>4 · Yayın</h3>
            <p>Yayın kapısı: <b>${publishState}</b></p>
            <p>Ziyaretçi ÇEŞNİ sistemi bu değişiklikle otomatik değiştirilmez. Mevcut canlı ziyaretçi yapısı korunur.</p>
          </section>
        </div>

        <section class="guide">
          <h3>D1 Ürünları · SP-001 → SP-106</h3>
          <p>Kimlik, aroma, claim ve açık blocking kontrolü birlikte gösterilir.</p>
          <div class="tablewrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Türkçe ad</th>
                  <th>Orijinal ad</th>
                  <th>Aroma</th>
                  <th>Güç</th>
                  <th>Claim</th>
                  <th>Blocking</th>
                  <th>Durum</th>
                </tr>
              </thead>
              <tbody>${tableRows || '<tr><td colspan="8">D1 üzerinde ÇEŞNİ kaydı bulunamadı.</td></tr>'}</tbody>
            </table>
          </div>
        </section>

        <section class="guide">
          <h3>Bağlantı durumu</h3>
          <p><b>Yönetici D1 bağlantısı aktif.</b> Bu sayfadaki sayaçlar ve ürün listesi gerçek D1 sorgularından üretilir. QA ve yayın kapıları kontrollü olarak kilitli kalır.</p>
        </section>
      </section>`);
    }

    function passwordPage(){return shell('Parola Değiştir',`<section class="card"><h1>Parola Değiştir</h1><p>En az 14 karakter; büyük/küçük harf, rakam ve özel karakter kullanın.</p><form id="pw"><input name="currentPassword" type="password" required autocomplete="current-password" placeholder="Mevcut parola"><input name="newPassword" type="password" required minlength="14" autocomplete="new-password" placeholder="Yeni güçlü parola"><button>Parolayı güncelle</button><a href="/">Panele dön</a></form><pre id="msg"></pre></section><script>${clientHelpers()}document.querySelector('#pw').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),r=await fetch('/account/password',{method:'POST',headers:{'Content-Type':'application/json','X-CSRF-Token':csrf()},body:JSON.stringify(Object.fromEntries(f))}),j=await r.json();document.querySelector('#msg').textContent=j.ok?'Parola başarıyla değiştirildi.':('Hata: '+j.error);if(j.ok)e.target.reset()}</script>`)}
    function clientHelpers(){return `function csrf(){return decodeURIComponent((document.cookie.match(/(?:^|;\\s*)__Host-oky_csrf=([^;]+)/)||[])[1]||'')}`}
    function printPage(){return shell('Okyanus EDT Rapor',`<section class="report"><h1>Okyanus EDT Yönetici Raporu</h1><p>Tarih: <span id="d"></span></p><pre id="out">Yükleniyor…</pre><button onclick="print()">PDF indir / Yazdır</button></section><script>document.getElementById('d').textContent=new Date().toLocaleString('tr-TR');fetch('/api/summary').then(r=>r.json()).then(j=>document.getElementById('out').textContent=JSON.stringify(j.data,null,2))</script>`)}
    function escapeHtml(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
    function css(){return `.sideMenu{position:fixed;left:0;top:0;bottom:0;width:245px;background:#061a33;padding:24px 16px;z-index:50;overflow:auto;border-right:1px solid #173b61}.sideBrand{padding:4px 10px 18px;border-bottom:1px solid #173b61}.sideBrand h2{color:#fff;margin:0 0 4px}.sideUser{margin:16px 5px;padding:12px;background:#102d50;border-radius:12px;font-weight:bold}.sideUser small{display:block;margin-top:4px}.sideNav{display:block;margin:0}.sideNav button,.sideNav a{display:block;width:100%;text-align:left;margin:5px 0;background:#0b3158}.sideNav .danger{background:#842a39;margin-top:18px}.adminContent{margin-left:245px}.menuToggle{display:none;position:fixed;left:12px;top:12px;z-index:70;box-shadow:0 6px 20px #0005}.menuShade{display:none}*{box-sizing:border-box}body{margin:0;font:15px Arial;background:#071b35;color:#eaf4ff}main{max-width:1280px;margin:auto;padding:28px}.card,.panel,.report{margin:4vh auto;background:#fff;color:#10233e;padding:28px;border-radius:20px;box-shadow:0 20px 60px #0005}.card,.report{max-width:760px}h1{color:#1684d6;margin-bottom:5px}h2,h3{margin:0 0 10px}small{color:#9db7d2}.user{background:#102d50;padding:10px 14px;border-radius:999px}input,select,textarea,button,a{font:inherit}input,select,textarea{display:block;width:100%;padding:12px;margin:8px 0;border:1px solid #bdd0e5;border-radius:10px;background:#fff}textarea{min-height:100px;resize:vertical}button,a{display:inline-block;padding:11px 14px;margin:5px;border:0;border-radius:9px;background:#0b65b1;color:#fff;text-decoration:none;cursor:pointer}.danger{background:#9d2635}header,.panelhead{display:flex;justify-content:space-between;align-items:center}nav{margin:20px 0;display:flex;flex-wrap:wrap}.panel{max-width:none}.panelhead{border-bottom:1px solid #dbe7f2;margin-bottom:18px;padding-bottom:12px}.panelhead p{margin:4px 0;color:#62748a}.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.stats article{padding:20px;border:1px solid #dceaf6;border-radius:14px;background:#f3f8fd}.stats b{font-size:30px;color:#0b65b1;display:block}.stats span{color:#52677e}.guide,.editor,.empty{padding:20px;margin-top:18px;background:#f3f8fd;border-radius:14px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.tablewrap{overflow:auto;border:1px solid #dbe7f2;border-radius:12px}table{width:100%;border-collapse:collapse;min-width:760px}th,td{text-align:left;padding:12px;border-bottom:1px solid #e5edf5;vertical-align:top}th{background:#edf5fc;color:#23435f;position:sticky;top:0}td{max-width:300px;overflow-wrap:anywhere}.loading,.error{padding:24px;border-radius:12px;background:#f3f8fd}.error{color:#a0182a}#notice{font-weight:bold;color:#087a4b;margin-top:10px}pre{white-space:pre-wrap;overflow:auto;background:#eff6fc;color:#10233e;padding:16px;border-radius:12px}@media(max-width:800px){main{padding:14px}header,.panelhead{display:block}.user{display:inline-block;margin-top:12px}nav button,nav a{flex:1 1 44%;text-align:center}.stats{grid-template-columns:1fr 1fr}.grid{grid-template-columns:1fr}.panel{padding:18px}}@media(max-width:800px){.adminContent{margin-left:0;padding-top:54px}.menuToggle{display:block}.sideMenu{width:min(82vw,300px);transform:translateX(-105%);transition:transform .22s ease;box-shadow:14px 0 40px #0008}.sideMenu.open{transform:translateX(0)}.menuShade{position:fixed;inset:0;background:#0008;z-index:40}.menuShade.open{display:block}.sideNav button,.sideNav a{min-height:46px;padding:13px 14px}}.studioGrid{display:grid;grid-template-columns:1fr 1.25fr;gap:18px}.studioPreview{padding:20px;border:1px solid #dceaf6;border-radius:14px;background:#f3f8fd}.studioStage{aspect-ratio:16/9;border-radius:16px;background:#061831;color:#fff;position:relative;overflow:hidden;display:flex;align-items:flex-end}.studioStage #stageMedia{position:absolute;inset:0}.studioStage img,.studioStage video{width:100%;height:100%;object-fit:cover}.stageCopy{position:relative;z-index:2;width:100%;padding:28px;background:linear-gradient(transparent,#061831dd);display:flex;flex-direction:column}.studioStage b{font-size:28px}.studioStage span{margin-top:8px}.studioToolbar,.sceneHead{display:flex;justify-content:space-between;align-items:center}.sceneCard{padding:14px;margin:10px 0;border:1px solid #d6e4f1;border-radius:12px;background:#fff}.sceneHead button{padding:7px 9px}.studioTimeline{display:flex;gap:7px;flex-wrap:wrap;margin-top:12px}.studioTimeline span{background:#0b3158;color:#fff;padding:7px 9px;border-radius:8px;font-size:12px}.muted{color:#62748a;font-size:13px}@media(max-width:800px){.studioGrid{grid-template-columns:1fr}}@media print{body{background:#fff;color:#000}button,nav,header{display:none}.report{box-shadow:none;margin:0;max-width:none}}`}