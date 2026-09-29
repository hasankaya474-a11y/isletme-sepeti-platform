import fs from 'node:fs';

const file='okyonus-edt-worker/src/deniz-worker.js';
let s=fs.readFileSync(file,'utf8');

function replaceOnce(from,to,label){
  const i=s.indexOf(from);
  if(i<0) throw new Error('PATCH_TARGET_NOT_FOUND: '+label);
  if(s.indexOf(from,i+1)>=0) throw new Error('PATCH_TARGET_NOT_UNIQUE: '+label);
  s=s.slice(0,i)+to+s.slice(i+from.length);
}

replaceOnce(
  '@media(max-width:860px){.top{',
  '@media(max-width:980px){.shell{grid-template-columns:210px minmax(0,1fr)}.side{padding-left:8px;padding-right:8px}.products{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:860px){.top{',
  'tablet breakpoint'
);

replaceOnce(
  '.top{height:auto;min-height:66px;flex-wrap:wrap;padding:10px 12px}',
  '.top{height:auto;min-height:66px;flex-wrap:wrap;padding:max(10px,env(safe-area-inset-top)) 12px 10px}',
  'mobile safe area'
);

replaceOnce(
  '.mobileBar a,.mobileBar button{border:0;background:#fff;color:#34586f;text-decoration:none;text-align:center;font-size:10px;font-weight:850;padding:6px 2px}',
  '.mobileBar a,.mobileBar button{border:0;background:#fff;color:#34586f;text-decoration:none;text-align:center;font-size:10px;font-weight:850;padding:6px 2px;min-height:52px;touch-action:manipulation}',
  'mobile touch targets'
);

replaceOnce(
  '@media(max-width:480px){.products{grid-template-columns:1fr 1fr;gap:8px}',
  '@media(max-width:480px){.topActions button{display:none}.heroButtons a{flex:1 1 100%;text-align:center}.products{grid-template-columns:1fr 1fr;gap:8px}',
  'phone header and CTA'
);

replaceOnce(
  '.quick span{font-size:12px;color:#6d8594}.section{',
  '.quick span{font-size:12px;color:#6d8594}.categoryStrip{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:2px 0 10px;margin:2px 0 0;scroll-snap-type:x proximity}.categoryStrip a{flex:0 0 auto;scroll-snap-align:start;min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #d6e5ed;border-radius:999px;background:#fff;color:#1a506d;text-decoration:none;font-size:12px;font-weight:850;white-space:nowrap}.categoryStrip a:first-child{background:#e9f7fb;color:#087fc1;border-color:#bfe4ef}.section{',
  'category strip css'
);

const quickEnd='<a href=\\"https://wa.me/905358813264?text=Merhaba%20Okyanus%20EDT%2C%20%C3%BCr%C3%BCn%20ve%20teklif%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.\\" target=\\"_blank\\" rel=\\"noopener\\"><b>WhatsApp Satış</b><span>Satış ekibine ürün veya teklif bağlamında ulaşın.</span></a></section>';
const categories='<nav class=\\"categoryStrip\\" aria-label=\\"Ürün kategorileri\\"><a href=\\"/urunler\\">Tüm Ürünler</a><a href=\\"/urunler?category=deniz-urunleri\\">Deniz Ürünleri</a><a href=\\"/urunler?category=donuk\\">Donuk</a><a href=\\"/urunler?category=et\\">Et</a><a href=\\"/urunler?category=tavuk\\">Tavuk</a><a href=\\"/urunler?category=sut\\">Süt & Şarküteri</a><a href=\\"/urunler?category=yag\\">Yağlar</a><a href=\\"/urunler?category=bakliyat\\">Bakliyat</a><a href=\\"/urunler?category=baharat\\">Baharat</a><a href=\\"/urunler?category=sos\\">Sos & Konserve</a><a href=\\"/urunler?category=ithal\\">İthal</a></nav>';
replaceOnce(quickEnd,quickEnd+categories,'mobile/tablet category vitrine');

replaceOnce(
  '· <a href=\\"/gizlilik\\">Gizlilik</a></footer>',
  '· <a href=\\"/gizlilik\\">Gizlilik</a> · <a href=\\"/yardim\\">Yardım</a></footer>',
  'mobile help access'
);

replaceOnce(
  '@media(max-width:860px){.dm2-mobile-tabs{display:none!important}.dm2-workspace{display:flex!important;flex-direction:column}.dm2-workspace .dm2-editor{display:grid!important;order:1}.dm2-workspace .dm2-stage{display:block!important;order:2;margin-top:14px}.dm2-workspace .dm2-result{display:grid!important;order:3;margin-top:12px}}',
  '@media(max-width:860px){.dm2-mobile-tabs{display:grid!important}.dm2-workspace{display:block!important}.dm2-workspace .dm2-editor{display:grid!important}.dm2-workspace .dm2-stage,.dm2-workspace .dm2-result{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-editor{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-stage,.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-result{display:block!important}.dm2-stage{margin-top:8px}.dm2-result{margin-top:12px}}',
  'digital menu mobile tabs'
);

fs.writeFileSync(file,s);
console.log('patched',file,s.length);
