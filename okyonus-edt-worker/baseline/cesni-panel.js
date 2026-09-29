const PANEL_VERSION = "0.1.2";

const COOKIE_NAME = "cesni_panel_session";

const SESSION_SECONDS = 8 \* 60 \* 60;

const MODULES = Object.freeze([

&#x20; ["dashboard", "Ana Kontrol", "/api/status"],

&#x20; ["projects", "Projeler", "/api/projects"],

&#x20; ["ingredients", "Hammaddeler", "/api/ingredients"],

&#x20; ["formulas", "Formüller", "/api/formulas"],

&#x20; ["formula-versions", "Versiyonlar", "/api/formula-versions"],

&#x20; ["processes", "Proses", "/api/processes"],

&#x20; ["tests", "Testler", "/api/tests"],

&#x20; ["measurements", "Ölçümler", "/api/measurements"],

&#x20; ["sensory", "Duyusal", "/api/sensory"],

&#x20; ["costs", "COST", "/api/costs"],

&#x20; ["sources", "Kaynaklar", "/api/sources"],

&#x20; ["claims", "İddialar", "/api/claims"],

&#x20; ["evidence", "Kanıtlar", "/api/evidence"],

&#x20; ["decisions", "Kararlar", "/api/decisions"],

&#x20; ["master-memory", "Master Hafıza", "/api/master-memory"]

]);



function response(body, status = 200, headers = {}) {

&#x20; return new Response(body, {

&#x20;   status,

&#x20;   headers: {

&#x20;     "Content-Type": "text/html; charset=UTF-8",

&#x20;     "Cache-Control": "no-store",

&#x20;     "X-Content-Type-Options": "nosniff",

&#x20;     "Referrer-Policy": "no-referrer",

&#x20;     "X-Frame-Options": "DENY",

&#x20;     "Permissions-Policy": "camera=(), microphone=(), geolocation=()",

&#x20;     "Content-Security-Policy": "default-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",

&#x20;     ...headers

&#x20;   }

&#x20; });

}



function json(data, status = 200, headers = {}) {

&#x20; return new Response(JSON.stringify(data, null, 2), {

&#x20;   status,

&#x20;   headers: {

&#x20;     "Content-Type": "application/json; charset=UTF-8",

&#x20;     "Cache-Control": "no-store",

&#x20;     "X-Content-Type-Options": "nosniff",

&#x20;     ...headers

&#x20;   }

&#x20; });

}



function configured(env) {

&#x20; return Boolean(

&#x20;   env &&

&#x20;   env.CESNI_ENGINE &&

&#x20;   typeof env.CESNI_ENGINE.fetch === "function" &&

&#x20;   typeof env.CESNI_PANEL_TOKEN === "string" && env.CESNI_PANEL_TOKEN.length >= 32 &&

&#x20;   typeof env.CESNI_SESSION_SECRET === "string" && env.CESNI_SESSION_SECRET.length >= 32

&#x20; );

}



function base64url(bytes) {

&#x20; let binary = "";

&#x20; for (const byte of bytes) binary += String.fromCharCode(byte);

&#x20; return btoa(binary).replace(/\\+/g, "-").replace(/\\//g, "\_").replace(/=+$/g, "");

}



function base64urlText(value) {

&#x20; return base64url(new TextEncoder().encode(value));

}



function decodeBase64url(value) {

&#x20; const base64 = value.replace(/-/g, "+").replace(/\_/g, "/") + "===".slice((value.length + 3) % 4);

&#x20; const binary = atob(base64);

&#x20; return new TextDecoder().decode(Uint8Array.from(binary, (char) => char.charCodeAt(0)));

}



async function hmac(value, secret) {

&#x20; const key = await crypto.subtle.importKey(

&#x20;   "raw",

&#x20;   new TextEncoder().encode(secret),

&#x20;   { name: "HMAC", hash: "SHA-256" },

&#x20;   false,

&#x20;   ["sign"]

&#x20; );

&#x20; return base64url(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value))));

}



async function secureEquals(left, right) {

&#x20; const encoder = new TextEncoder();

&#x20; const [a, b] = await Promise.all([

&#x20;   crypto.subtle.digest("SHA-256", encoder.encode(left)),

&#x20;   crypto.subtle.digest("SHA-256", encoder.encode(right))

&#x20; ]);

&#x20; const x = new Uint8Array(a);

&#x20; const y = new Uint8Array(b);

&#x20; let difference = 0;

&#x20; for (let index = 0; index < x.length; index += 1) difference |= x[index] ^ y[index];

&#x20; return difference === 0;

}



function cookieMap(request) {

&#x20; const result = {};

&#x20; for (const part of (request.headers.get("cookie") || "").split(";")) {

&#x20;   const position = part.indexOf("=");

&#x20;   if (position > 0) result[part.slice(0, position).trim()] = part.slice(position + 1).trim();

&#x20; }

&#x20; return result;

}



async function createSession(env) {

&#x20; const payload = base64urlText(JSON.stringify({ role: "HASAN_KAYA", exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));

&#x20; return \`${payload}.${await hmac(payload, env.CESNI_SESSION_SECRET)}\`;

}



async function validSession(request, env) {

&#x20; if (!configured(env)) return false;

&#x20; const token = cookieMap(request)[COOKIE_NAME];

&#x20; if (!token) return false;

&#x20; const [payload, signature, extra] = token.split(".");

&#x20; if (!payload || !signature || extra) return false;

&#x20; if (!(await secureEquals(signature, await hmac(payload, env.CESNI_SESSION_SECRET)))) return false;

&#x20; try {

&#x20;   const data = JSON.parse(decodeBase64url(payload));

&#x20;   return data.role === "HASAN_KAYA" && Number(data.exp) > Math.floor(Date.now() / 1000);

&#x20; } catch {

&#x20;   return false;

&#x20; }

}



function sameOrigin(request) {

&#x20; const fetchSite = (request.headers.get("sec-fetch-site") || "").toLowerCase();

&#x20; if (fetchSite === "cross-site") return false;

&#x20; if (fetchSite === "same-origin") return true;

&#x20; try {

&#x20;   const requestUrl = new URL(request.url);

&#x20;   const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || requestUrl.host;

&#x20;   const candidates = [request.headers.get("origin"), request.headers.get("referer")].filter(Boolean);

&#x20;   return candidates.some((value) => {

&#x20;     const candidate = new URL(value);

&#x20;     return candidate.protocol === "https:" && (candidate.host === host || candidate.origin === requestUrl.origin);

&#x20;   });

&#x20; } catch {

&#x20;   return false;

&#x20; }

}



function loginPage(message = "") {

&#x20; return \`\<!doctype html>\<html lang="tr">\<head>\<meta charset="utf-8">\<meta name="viewport" content="width=device-width,initial-scale=1">\<title>ÇEŞNİ Panel Girişi\</title>\<style>

&#x20; \*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#eef7fc;color:#07345e;min-height:100vh;display:grid;place-items:center}.box{width:min(430px,92vw);background:#fff;border:1px solid #cfe1ee;border-radius:22px;padding:30px;box-shadow:0 18px 50px #07345e18}.brand{font-size:30px;font-weight:800;margin-bottom:6px}.sub{color:#5d7890;margin-bottom:24px}.error{background:#fff1f1;color:#a51616;padding:12px;border-radius:10px;margin-bottom:14px}label{display:block;font-weight:700;margin-bottom:8px}input{width:100%;padding:14px;border:1px solid #aac6da;border-radius:12px;font-size:16px}button{width:100%;margin-top:16px;padding:14px;border:0;border-radius:12px;background:#0768b2;color:#fff;font-weight:800;font-size:16px;cursor:pointer}.note{font-size:12px;color:#71879a;margin-top:18px}\</style>\</head>\<body>\<form class="box" method="post" action="/login">\<div class="brand">ÇEŞNİ\</div>\<div class="sub">Bağımsız AR-GE Yönetim Paneli\</div>${message ? \`\<div class="error">${message}\</div>\` : ""}\<label for="token">Yönetici anahtarı\</label>\<input id="token" name="token" type="password" autocomplete="current-password" required autofocus>\<button type="submit">Güvenli Giriş\</button>\<div class="note">Anahtar yalnız oturum açmak için kullanılır; tarayıcı koduna kaydedilmez.\</div>\</form>\</body>\</html>\`;

}



function panelPage() {

&#x20; const nav = MODULES.map(([key, label]) => \`\<button data-module="${key}">${label}\</button>\`).join("");

&#x20; const moduleMap = JSON.stringify(Object.fromEntries(MODULES.map(([key, , path]) => [key, path])));

&#x20; return \`\<!doctype html>\<html lang="tr">\<head>\<meta charset="utf-8">\<meta name="viewport" content="width=device-width,initial-scale=1">\<title>ÇEŞNİ Yönetim Paneli\</title>\<style>

&#x20; \*{box-sizing:border-box}body{margin:0;font-family:Arial,sans-serif;background:#f3f8fb;color:#082f55}header{height:72px;background:#fff;border-bottom:1px solid #d7e5ef;display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:3}.logo{font-size:27px;font-weight:900}.version{font-size:12px;color:#648097}.logout{border:0;background:#eaf3f9;color:#084678;border-radius:10px;padding:10px 14px;font-weight:700}.layout{display:grid;grid-template-columns:260px 1fr;min-height:calc(100vh - 72px)}aside{background:#083a66;padding:18px 12px}aside button{width:100%;display:block;text-align:left;border:0;background:transparent;color:#ddecf7;padding:12px 14px;border-radius:10px;font-weight:700;cursor:pointer;margin:2px 0}aside button:hover,aside button.active{background:#0c609d;color:#fff}main{padding:26px;min-width:0}.top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}h1{font-size:27px;margin:0}.badge{background:#def5e9;color:#087341;padding:8px 12px;border-radius:999px;font-size:12px;font-weight:800}.cards{display:grid;grid-template-columns:repeat(4,minmax(130px,1fr));gap:14px;margin-bottom:18px}.card{background:#fff;border:1px solid #d7e5ef;border-radius:16px;padding:18px}.card b{display:block;font-size:25px;margin-top:7px}.panel{background:#fff;border:1px solid #d7e5ef;border-radius:16px;overflow:hidden}.panel-head{display:flex;justify-content:space-between;align-items:center;padding:16px 18px;border-bottom:1px solid #e2edf4}.refresh{border:0;background:#0768b2;color:#fff;border-radius:9px;padding:9px 13px;font-weight:700;cursor:pointer}.table-wrap{overflow:auto;max-height:65vh}table{border-collapse:collapse;width:100%;font-size:13px}th,td{text-align:left;padding:11px 13px;border-bottom:1px solid #edf3f7;white-space:nowrap}th{background:#f7fafc;position:sticky;top:0}.empty,.loading,.error{padding:36px;text-align:center;color:#6b8295}.error{color:#a51616}@media(max-width:850px){.layout{grid-template-columns:1fr}aside{display:flex;overflow:auto;padding:8px}aside button{min-width:max-content}.cards{grid-template-columns:repeat(2,1fr)}main{padding:16px}}@media(max-width:480px){header{padding:0 14px}.cards{grid-template-columns:1fr 1fr}.version{display:none}}

&#x20; \</style>\</head>\<body>\<header>\<div>\<div class="logo">ÇEŞNİ\</div>\<div class="version">PANEL v${PANEL_VERSION} • ENGINE v2.2.0\</div>\</div>\<form method="post" action="/logout">\<button class="logout">Güvenli Çıkış\</button>\</form>\</header>\<div class="layout">\<aside>${nav}\</aside>\<main>\<div class="top">\<h1 id="title">Ana Kontrol\</h1>\<span class="badge">● GÜVENLİ OTURUM\</span>\</div>\<div class="cards">\<div class="card">Motor\<b id="engine">—\</b>\</div>\<div class="card">D1 Şema\<b id="schema">—\</b>\</div>\<div class="card">Kayıt\<b id="count">—\</b>\</div>\<div class="card">Mod\<b>SALT OKUMA\</b>\</div>\</div>\<section class="panel">\<div class="panel-head">\<strong id="section">Sistem Durumu\</strong>\<button class="refresh" id="refresh">Yenile\</button>\</div>\<div class="table-wrap" id="content">\<div class="loading">Veriler yükleniyor…\</div>\</div>\</section>\</main>\</div>\<script>

&#x20; const routes=${moduleMap};let current='dashboard';const buttons=[...document.querySelectorAll('[data-module]')];

&#x20; function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

&#x20; function table(rows){if(!rows.length)return '\<div class="empty">Henüz kayıt yok.\</div>';const keys=[...new Set(rows.flatMap(Object.keys))];return '\<table>\<thead>\<tr>'+keys.map(k=>'\<th>'+esc(k)+'\</th>').join('')+'\</tr>\</thead>\<tbody>'+rows.map(r=>'\<tr>'+keys.map(k=>'\<td>'+esc(typeof r[k]==='object'?JSON.stringify(r[k]):r[k])+'\</td>').join('')+'\</tr>').join('')+'\</tbody>\</table>'}

&#x20; async function load(){const box=document.querySelector('#content');box.innerHTML='\<div class="loading">Veriler yükleniyor…\</div>';try{const res=await fetch('/panel-api?path='+encodeURIComponent(routes[current]),{credentials:'same-origin'});if(res.status===401){location.href='/login';return}const data=await res.json();if(!res.ok)throw new Error(data.error||'İstek başarısız');const rows=Array.isArray(data.data)?data.data:[data];document.querySelector('#count').textContent=data.total??data.count??rows.length;document.querySelector('#engine').textContent=data.version||data.status||'ACTIVE';document.querySelector('#schema').textContent=data.persistenceDetail?data.persistenceDetail.foundTables+'/'+data.persistenceDetail.expectedTables:'14/14';box.innerHTML=table(rows)}catch(error){box.innerHTML='\<div class="error">'+esc(error.message)+'\</div>'}}

&#x20; buttons.forEach(button=>button.addEventListener('click',()=>{current=button.dataset.module;buttons.forEach(b=>b.classList.toggle('active',b===button));document.querySelector('#title').textContent=button.textContent;document.querySelector('#section').textContent=button.textContent+' Verileri';load()}));document.querySelector('#refresh').onclick=load;buttons[0].classList.add('active');load();

&#x20; \</script>\</body>\</html>\`;

}



async function engineGet(env, path) {

&#x20; const upstream = await env.CESNI_ENGINE.fetch(new Request(\`https\://cesni-engine.internal${path}\`, { method: "GET", headers: { Accept: "application/json" } }));

&#x20; return new Response(upstream.body, { status: upstream.status, headers: { "Content-Type": upstream.headers.get("content-type") || "application/json; charset=UTF-8", "Cache-Control": "no-store" } });

}



export default {

&#x20; async fetch(request, env) {

&#x20;   const url = new URL(request.url);

&#x20;   const method = request.method.toUpperCase();

&#x20;   if (url.pathname === "/health") return json({ ok: configured(env), panel: "CESNI_PANEL", version: PANEL_VERSION, engineBinding: Boolean(env && env.CESNI_ENGINE), securityConfigured: configured(env) }, configured(env) ? 200 : 503);

&#x20;   if (!configured(env)) return json({ ok: false, error: "PANEL_CONFIGURATION_INCOMPLETE", required: ["CESNI_ENGINE service binding", "CESNI_PANEL_TOKEN secret", "CESNI_SESSION_SECRET secret"] }, 503);

&#x20;   if (url.pathname === "/login" && method === "GET") return response(loginPage());

&#x20;   if (url.pathname === "/login" && method === "POST") {

&#x20;     if (!sameOrigin(request)) return json({ ok: false, error: "ORIGIN_FORBIDDEN" }, 403);

&#x20;     const form = await request.formData();

&#x20;     const token = String(form.get("token") || "");

&#x20;     if (!(await secureEquals(token, env.CESNI_PANEL_TOKEN))) return response(loginPage("Yönetici anahtarı geçersiz."), 401);

&#x20;     const session = await createSession(env);

&#x20;     return new Response(null, { status: 303, headers: { Location: "/", "Set-Cookie": \`${COOKIE_NAME}=${session}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}\`, "Cache-Control": "no-store" } });

&#x20;   }

&#x20;   const authenticated = await validSession(request, env);

&#x20;   if (!authenticated) {

&#x20;     if (url.pathname.startsWith("/panel-api")) return json({ ok: false, error: "AUTHENTICATION_REQUIRED" }, 401);

&#x20;     return new Response(null, { status: 303, headers: { Location: "/login", "Cache-Control": "no-store" } });

&#x20;   }

&#x20;   if (url.pathname === "/logout" && method === "POST") {

&#x20;     if (!sameOrigin(request)) return json({ ok: false, error: "ORIGIN_FORBIDDEN" }, 403);

&#x20;     return new Response(null, { status: 303, headers: { Location: "/login", "Set-Cookie": \`${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0\`, "Cache-Control": "no-store" } });

&#x20;   }

&#x20;   if (url.pathname === "/panel-api" && method === "GET") {

&#x20;     const path = url.searchParams.get("path") || "";

&#x20;     const allowed = new Set(MODULES.map(([, , itemPath]) => itemPath));

&#x20;     if (!allowed.has(path)) return json({ ok: false, error: "PANEL_PATH_NOT_ALLOWED" }, 400);

&#x20;     return engineGet(env, path);

&#x20;   }

&#x20;   if (url.pathname === "/" && method === "GET") return response(panelPage());

&#x20;   return json({ ok: false, error: "NOT_FOUND" }, 404);

&#x20; }

};