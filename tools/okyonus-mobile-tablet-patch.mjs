import fs from 'node:fs';

const file='okyonus-edt-worker/src/deniz-worker.js';
let s=fs.readFileSync(file,'utf8');

function functionRange(source,name){
  const start=source.indexOf('function '+name+'(');
  if(start<0) throw new Error(name+'_FUNCTION_NOT_FOUND');
  const brace=source.indexOf('{',start);
  let depth=0,quote='',escape=false,templateDepth=0;
  for(let i=brace;i<source.length;i++){
    const c=source[i],n=source[i+1];
    if(quote){
      if(escape){escape=false;continue}
      if(c==='\\\\'){escape=true;continue}
      if(quote==='\`'&&c==='

function need(ok,label){if(!ok)throw new Error('PATCH_TARGET_NOT_FOUND: '+label)}

if(!home.includes('@media(max-width:980px)')){
  const i=home.indexOf('@media(max-width:860px)');
  need(i>=0,'homepage mobile breakpoint');
  const tablet='@media(max-width:980px){.shell{grid-template-columns:210px minmax(0,1fr)}.side{padding-left:8px;padding-right:8px}.products{grid-template-columns:repeat(2,minmax(0,1fr))}}';
  home=home.slice(0,i)+tablet+home.slice(i);
}

if(!home.includes('safe-area-inset-top')){
  const from='.top{height:auto;min-height:66px;flex-wrap:wrap;padding:10px 12px}';
  need(home.includes(from),'mobile safe area');
  home=home.replace(from,'.top{height:auto;min-height:66px;flex-wrap:wrap;padding:max(10px,env(safe-area-inset-top)) 12px 10px}');
}

if(!home.includes('min-height:52px;touch-action:manipulation')){
  const marker='.mobileBar a,.mobileBar button{';
  const i=home.indexOf(marker),e=home.indexOf('}',i);
  need(i>=0&&e>i,'mobile touch targets');
  const block=home.slice(i,e+1);
  home=home.slice(0,i)+block.slice(0,-1)+';min-height:52px;touch-action:manipulation}'+home.slice(e+1);
}

if(!home.includes('.topActions button{display:none}')){
  const marker='@media(max-width:480px){';
  const i=home.indexOf(marker);
  need(i>=0,'phone breakpoint');
  const extra='.topActions button{display:none}.heroButtons a{flex:1 1 100%;text-align:center}';
  home=home.slice(0,i+marker.length)+extra+home.slice(i+marker.length);
}

if(!home.includes('.categoryStrip{')){
  const marker='.section{margin-top:12px';
  const i=home.indexOf(marker);
  need(i>=0,'section css');
  const css='.categoryStrip{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:2px 0 10px;margin:2px 0 0;scroll-snap-type:x proximity}.categoryStrip a{flex:0 0 auto;scroll-snap-align:start;min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #d6e5ed;border-radius:999px;background:#fff;color:#1a506d;text-decoration:none;font-size:12px;font-weight:850;white-space:nowrap}.categoryStrip a:first-child{background:#e9f7fb;color:#087fc1;border-color:#bfe4ef}';
  home=home.slice(0,i)+css+home.slice(i);
}

if(!home.includes('aria-label=\\"Ürün kategorileri\\"')){
  const quick=home.indexOf('<section class=\\"quick\\">');
  const marker='</section><section class=\\"section\\">';
  const i=home.indexOf(marker,quick);
  need(quick>=0&&i>=0,'quick section end');
  const categories='<nav class=\\"categoryStrip\\" aria-label=\\"Ürün kategorileri\\"><a href=\\"/urunler\\">Tüm Ürünler</a><a href=\\"/urunler?category=deniz-urunleri\\">Deniz Ürünleri</a><a href=\\"/urunler?category=donuk\\">Donuk</a><a href=\\"/urunler?category=et\\">Et</a><a href=\\"/urunler?category=tavuk\\">Tavuk</a><a href=\\"/urunler?category=sut\\">Süt & Şarküteri</a><a href=\\"/urunler?category=yag\\">Yağlar</a><a href=\\"/urunler?category=bakliyat\\">Bakliyat</a><a href=\\"/urunler?category=baharat\\">Baharat</a><a href=\\"/urunler?category=sos\\">Sos & Konserve</a><a href=\\"/urunler?category=ithal\\">İthal</a></nav>';
  home=home.slice(0,i+10)+categories+home.slice(i+10);
}

if(!home.includes('Gizlilik</a> · <a href=\\"/yardim\\">Yardım</a>')){
  const from='Gizlilik</a></footer>';
  need(home.includes(from),'footer help');
  home=home.replace(from,'Gizlilik</a> · <a href=\\"/yardim\\">Yardım</a></footer>');
}

s=s.slice(0,homeStart)+home+s.slice(homeEnd);

const dmStart=s.indexOf('function digitalMenuStudioV2');
need(dmStart>=0,'digital menu studio');
const bad='@media(max-width:860px){.dm2-mobile-tabs{display:none!important}';
const badStart=s.indexOf(bad,dmStart);
if(badStart>=0){
  const lineEnd=s.indexOf('\n',badStart);
  need(lineEnd>badStart,'digital menu override line');
  const fixed='@media(max-width:860px){.dm2-mobile-tabs{display:grid!important}.dm2-workspace{display:block!important}.dm2-workspace .dm2-editor{display:grid!important}.dm2-workspace .dm2-stage,.dm2-workspace .dm2-result{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-editor{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-stage,.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-result{display:block!important}.dm2-stage{margin-top:8px}.dm2-result{margin-top:12px}}';
  s=s.slice(0,badStart)+fixed+s.slice(lineEnd);
}
need(!s.includes('@media(max-width:860px){.dm2-mobile-tabs{display:none!important}'),'digital menu mobile tabs still hidden');

fs.writeFileSync(file,s);
console.log('patched',file,s.length);
&&n==='{'){templateDepth++;i++;continue}
      if(quote==='\`'&&c==='}'&&templateDepth>0){templateDepth--;continue}
      if(c===quote&&templateDepth===0)quote='';
      continue;
    }
    if(c==="'"||c==='"'||c==='\`'){quote=c;continue}
    if(c==='/'&&n==='/'){const e=source.indexOf('\n',i);if(e<0)return [start,source.length];i=e;continue}
    if(c==='/'&&n==='*'){const e=source.indexOf('*/',i+2);if(e<0)throw new Error('UNTERMINATED_COMMENT');i=e+1;continue}
    if(c==='{')depth++;
    if(c==='}'){depth--;if(depth===0)return [start,i+1]}
  }
  throw new Error(name+'_FUNCTION_UNTERMINATED');
}
const [homeStart,homeEnd]=functionRange(s,'okySalesFirstHomeV1');
let home=s.slice(homeStart,homeEnd);

function need(ok,label){if(!ok)throw new Error('PATCH_TARGET_NOT_FOUND: '+label)}

if(!home.includes('@media(max-width:980px)')){
  const i=home.indexOf('@media(max-width:860px)');
  need(i>=0,'homepage mobile breakpoint');
  const tablet='@media(max-width:980px){.shell{grid-template-columns:210px minmax(0,1fr)}.side{padding-left:8px;padding-right:8px}.products{grid-template-columns:repeat(2,minmax(0,1fr))}}';
  home=home.slice(0,i)+tablet+home.slice(i);
}

if(!home.includes('safe-area-inset-top')){
  const from='.top{height:auto;min-height:66px;flex-wrap:wrap;padding:10px 12px}';
  need(home.includes(from),'mobile safe area');
  home=home.replace(from,'.top{height:auto;min-height:66px;flex-wrap:wrap;padding:max(10px,env(safe-area-inset-top)) 12px 10px}');
}

if(!home.includes('min-height:52px;touch-action:manipulation')){
  const marker='.mobileBar a,.mobileBar button{';
  const i=home.indexOf(marker),e=home.indexOf('}',i);
  need(i>=0&&e>i,'mobile touch targets');
  const block=home.slice(i,e+1);
  home=home.slice(0,i)+block.slice(0,-1)+';min-height:52px;touch-action:manipulation}'+home.slice(e+1);
}

if(!home.includes('.topActions button{display:none}')){
  const marker='@media(max-width:480px){';
  const i=home.indexOf(marker);
  need(i>=0,'phone breakpoint');
  const extra='.topActions button{display:none}.heroButtons a{flex:1 1 100%;text-align:center}';
  home=home.slice(0,i+marker.length)+extra+home.slice(i+marker.length);
}

if(!home.includes('.categoryStrip{')){
  const marker='.section{margin-top:12px';
  const i=home.indexOf(marker);
  need(i>=0,'section css');
  const css='.categoryStrip{display:flex;gap:8px;overflow-x:auto;overscroll-behavior-inline:contain;scrollbar-width:thin;padding:2px 0 10px;margin:2px 0 0;scroll-snap-type:x proximity}.categoryStrip a{flex:0 0 auto;scroll-snap-align:start;min-height:40px;display:inline-flex;align-items:center;padding:8px 12px;border:1px solid #d6e5ed;border-radius:999px;background:#fff;color:#1a506d;text-decoration:none;font-size:12px;font-weight:850;white-space:nowrap}.categoryStrip a:first-child{background:#e9f7fb;color:#087fc1;border-color:#bfe4ef}';
  home=home.slice(0,i)+css+home.slice(i);
}

if(!home.includes('aria-label=\\"Ürün kategorileri\\"')){
  const quick=home.indexOf('<section class=\\"quick\\">');
  const marker='</section><section class=\\"section\\">';
  const i=home.indexOf(marker,quick);
  need(quick>=0&&i>=0,'quick section end');
  const categories='<nav class=\\"categoryStrip\\" aria-label=\\"Ürün kategorileri\\"><a href=\\"/urunler\\">Tüm Ürünler</a><a href=\\"/urunler?category=deniz-urunleri\\">Deniz Ürünleri</a><a href=\\"/urunler?category=donuk\\">Donuk</a><a href=\\"/urunler?category=et\\">Et</a><a href=\\"/urunler?category=tavuk\\">Tavuk</a><a href=\\"/urunler?category=sut\\">Süt & Şarküteri</a><a href=\\"/urunler?category=yag\\">Yağlar</a><a href=\\"/urunler?category=bakliyat\\">Bakliyat</a><a href=\\"/urunler?category=baharat\\">Baharat</a><a href=\\"/urunler?category=sos\\">Sos & Konserve</a><a href=\\"/urunler?category=ithal\\">İthal</a></nav>';
  home=home.slice(0,i+10)+categories+home.slice(i+10);
}

if(!home.includes('Gizlilik</a> · <a href=\\"/yardim\\">Yardım</a>')){
  const from='Gizlilik</a></footer>';
  need(home.includes(from),'footer help');
  home=home.replace(from,'Gizlilik</a> · <a href=\\"/yardim\\">Yardım</a></footer>');
}

s=s.slice(0,homeStart)+home+s.slice(helpStart);

const dmStart=s.indexOf('function digitalMenuStudioV2');
need(dmStart>=0,'digital menu studio');
const bad='@media(max-width:860px){.dm2-mobile-tabs{display:none!important}';
const badStart=s.indexOf(bad,dmStart);
if(badStart>=0){
  const lineEnd=s.indexOf('\n',badStart);
  need(lineEnd>badStart,'digital menu override line');
  const fixed='@media(max-width:860px){.dm2-mobile-tabs{display:grid!important}.dm2-workspace{display:block!important}.dm2-workspace .dm2-editor{display:grid!important}.dm2-workspace .dm2-stage,.dm2-workspace .dm2-result{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-editor{display:none!important}.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-stage,.dm2-workspace[data-mobile-view=\\"preview\\"] .dm2-result{display:block!important}.dm2-stage{margin-top:8px}.dm2-result{margin-top:12px}}';
  s=s.slice(0,badStart)+fixed+s.slice(lineEnd);
}
need(!s.includes('@media(max-width:860px){.dm2-mobile-tabs{display:none!important}'),'digital menu mobile tabs still hidden');

fs.writeFileSync(file,s);
console.log('patched',file,s.length);
