import fs from 'node:fs';

const file = 'okyonus-edt-worker/src/deniz-worker.js';
let s = fs.readFileSync(file, 'utf8');

function need(ok, label) {
  if (!ok) throw new Error('PATCH_TARGET_NOT_FOUND: ' + label);
}
function replaceOnce(from, to, label) {
  const i = s.indexOf(from);
  need(i >= 0, label);
  s = s.slice(0, i) + to + s.slice(i + from.length);
}

const home = s.indexOf('function okySalesFirstHomeV1');
need(home >= 0, 'sales homepage');

if (!s.includes('@media(max-width:980px){.shell{grid-template-columns:210px')) {
  const mobileTop = s.indexOf('.top{height:auto;min-height:66px;flex-wrap:wrap;padding:10px 12px}', home);
  need(mobileTop >= 0, 'mobile top css');
  const media = s.lastIndexOf('@media(', mobileTop);
  need(media >= home, 'mobile media start');
  const tablet = '@media(max-width:980px){.shell{grid-template-columns:210px minmax(0,1fr)}.side{padding-left:8px;padding-right:8px}.products{grid-template-columns:repeat(2,minmax(0,1fr))}}';
  s = s.slice(0, media) + tablet + s.slice(media);
}

if (!s.includes('safe-area-inset-top')) {
  replaceOnce(
    '.top{height:auto;min-height:66px;flex-wrap:wrap;padding:10px 12px}',
    '.top{height:auto;min-height:66px;flex-wrap:wrap;padding:max(10px,env(safe-area-inset-top)) 12px 10px}',
    'mobile safe area'
  );
}

if (!s.includes('min-height:52px;touch-action:manipulation')) {
  const marker = '.mobileBar a,.mobileBar button{';
  const i = s.indexOf(marker, home);
  const e = s.indexOf('}', i);
  need(i >= 0 && e > i, 'mobile bar css');
  s = s.slice(0, e) + ';min-height:52px;touch-action:manipulation' + s.slice(e);
}

if (!s.includes('.topActions button{display:none}.heroButtons a{flex:1 1 100%;text-align:center}')) {
  const phone = s.indexOf('@media(max-width:480px){', home);
  need(phone >= 0, 'phone breakpoint');
  const insert = phone + '@media(max-width:480px){'.length;
  s = s.slice(0, insert) + '.topActions button{display:none}.heroButtons a{flex:1 1 100%;text-align:center}' + s.slice(insert);
}

if (!s.includes('.categoryStrip{display:flex')) {
  const marker = '.section{margin-top:12px';
  const i = s.indexOf(marker, home);
  need(i >= 0, 'section css');
  const css = '.categoryStrip{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:2px 0 10px;margin:2px 0 0;scroll-snap-type:x proximity}.categoryStrip a{flex:0 0 auto;scroll-snap-align:start;min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #d6e5ed;border-radius:999px;background:#fff;color:#1a506d;text-decoration:none;font-size:12px;font-weight:850;white-space:nowrap}.categoryStrip a:first-child{background:#e9f7fb;color:#087fc1;border-color:#bfe4ef}';
  s = s.slice(0, i) + css + s.slice(i);
}

if (!s.includes('aria-label=\\\"Ürün kategorileri\\\"')) {
  const quick = s.indexOf('<section class=\\\"quick\\\">', home);
  need(quick >= 0, 'quick section');
  const marker = '</section><section class=\\\"section\\\">';
  const i = s.indexOf(marker, quick);
  need(i >= 0, 'quick section end');
  const categories = '<nav class=\\\"categoryStrip\\\" aria-label=\\\"Ürün kategorileri\\\"><a href=\\\"/urunler\\\">Tüm Ürünler</a><a href=\\\"/urunler?category=deniz-urunleri\\\">Deniz Ürünleri</a><a href=\\\"/urunler?category=donuk\\\">Donuk</a><a href=\\\"/urunler?category=et\\\">Et</a><a href=\\\"/urunler?category=tavuk\\\">Tavuk</a><a href=\\\"/urunler?category=sut\\\">Süt & Şarküteri</a><a href=\\\"/urunler?category=yag\\\">Yağlar</a><a href=\\\"/urunler?category=bakliyat\\\">Bakliyat</a><a href=\\\"/urunler?category=baharat\\\">Baharat</a><a href=\\\"/urunler?category=sos\\\">Sos & Konserve</a><a href=\\\"/urunler?category=ithal\\\">İthal</a></nav>';
  s = s.slice(0, i + '</section>'.length) + categories + s.slice(i + '</section>'.length);
}

if (!s.includes('Gizlilik</a> · <a href=\\\"/yardim\\\">Yardım</a>')) {
  replaceOnce(
    'Gizlilik</a></footer>',
    'Gizlilik</a> · <a href=\\\"/yardim\\\">Yardım</a></footer>',
    'footer help'
  );
}

const dm = s.indexOf('function digitalMenuStudioV2');
need(dm >= 0, 'digital menu studio');
const bad = '@media(max-width:860px){.dm2-mobile-tabs{display:none!important}';
const badStart = s.indexOf(bad, dm);
if (badStart >= 0) {
  const lineEnd = s.indexOf('\n', badStart);
  need(lineEnd > badStart, 'digital menu bad media line');
  const fixed = '@media(max-width:860px){.dm2-mobile-tabs{display:grid!important}.dm2-workspace{display:block!important}.dm2-workspace .dm2-editor{display:grid!important}.dm2-workspace .dm2-stage,.dm2-workspace .dm2-result{display:none!important}.dm2-workspace[data-mobile-view=\\\"preview\\\"] .dm2-editor{display:none!important}.dm2-workspace[data-mobile-view=\\\"preview\\\"] .dm2-stage,.dm2-workspace[data-mobile-view=\\\"preview\\\"] .dm2-result{display:block!important}.dm2-stage{margin-top:8px}.dm2-result{margin-top:12px}}';
  s = s.slice(0, badStart) + fixed + s.slice(lineEnd);
}
need(!s.includes(bad), 'digital menu mobile tabs');

fs.writeFileSync(file, s);
console.log('PATCH_OK', s.length);
