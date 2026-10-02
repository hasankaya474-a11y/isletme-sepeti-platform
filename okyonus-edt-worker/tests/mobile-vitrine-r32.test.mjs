import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../src/deniz-worker.js',import.meta.url),'utf8');
const cats=['deniz-urunleri','donuk-urunler','et-sarkuteri','sut-sarkuteri','yaglar','soslar','kuru-gida','baharat'];
function homepage(){
 const start=source.indexOf('function css(){'),end=source.indexOf('\nfunction ',start+20);
 const h=source.indexOf('function home(opening={})'),he=source.indexOf('\nfunction ',h+20);
 const c={CATEGORY_VISUALS:Object.fromEntries(cats.map(x=>[x,'/img/'+x])),HERO_VISUALS:['/hero1','/hero2','/hero3'],esc:x=>String(x??''),sideNav:()=>'',seoModulesHtml:()=>'',weeklyNewsletterTeaser:()=>'<section class="homeNewsletter"></section>',contactStrip:()=>'',header:()=>'',footer:()=>'',mobile:()=>'',cartRuntimeScript:()=>'',favoriteRuntimeScript:()=>'',runtimeSettingsScript:()=>''};
 vm.createContext(c);vm.runInContext(source.slice(start,end)+source.slice(h,he)+';this.html=home()',c);return c.html;
}
test('homepage DOM places one eight-category grid immediately after primary vitrine',()=>{
 const html=homepage(),start=html.indexOf('<div class="commerceMain">'),end=html.indexOf('<section class="section homePromo">',start),lead=html.slice(start,end);
 assert.match(lead,/<section class="hero"/);assert.match(lead,/<\/section><section class="section homeCategories">/);
 assert.equal((lead.match(/class="cat"/g)||[]).length,8);
 const links=[...lead.matchAll(/href="\/urunler\?category=([^"]+)"/g)].map(x=>x[1]);assert.deepEqual(links,cats);assert.equal(new Set(links).size,8);
});
test('actual category client rendering retains canonical eight across missing, partial, duplicate and extra API categories',async()=>{
 const html=homepage(),scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]),script=scripts.find(x=>x.includes('commerce-categories'));
 for(const categories of [[],cats.slice(0,3).map(slug=>({slug,name:'Saved '+slug,image_url:'/saved/'+slug})),[...cats.map(slug=>({slug,name:slug})),{slug:cats[0],name:'Duplicate'},{slug:'extra',name:'Extra'}]]){
 const nodes=new Map(),node=id=>{if(!nodes.has(id))nodes.set(id,{innerHTML:'',textContent:'',querySelector:()=>null,querySelectorAll:()=>[],addEventListener:()=>{}});return nodes.get(id)};
 node('commerce-categories').innerHTML=html.match(/id="commerce-categories" class="cats">([\s\S]*?)<\/div>/)[1];
 const c={Event:class{},document:{getElementById:node,querySelector:()=>null,querySelectorAll:()=>[],dispatchEvent:()=>{},addEventListener:()=>{}},fetch:async()=>({ok:true,json:async()=>({homepageAuthoritative:true,products:[],categories})}),matchMedia:()=>({matches:true}),setTimeout:()=>{},setInterval:()=>0,clearInterval:()=>{},console};vm.createContext(c);vm.runInContext(script.replace("}).catch(()=>{const box=", "}).catch((error)=>{console.log(error);const box="),c);await new Promise(r=>setImmediate(r));
 const rendered=node('commerce-categories').innerHTML,links=[...rendered.matchAll(/category=([^"\s]+)/g)].map(x=>x[1]);assert.deepEqual(links,cats);assert.equal((rendered.match(/class="cat"/g)||[]).length,8);
 if(categories.length===3)assert.match(rendered,/\/saved\/deniz-urunleri/);
 }
});

test('served final CSS bounds mobile hero artwork and locks categories before products',()=>{
 const html=homepage(),css=html.match(/<style>([\s\S]*?)<\/style>/)[1];
 assert.match(css,/\.commerceMain>\.hero\{order:0\}/);
 assert.match(css,/\.homeCategories\{[^}]*order:1/);
 assert.match(css,/\.hero \.heroVisualSlide \.heroMedia img\{[^}]*object-fit:contain!important[^}]*animation:none!important[^}]*transform:none!important/);
 assert.match(css,/\.hero\{[^}]*max-width:100%[^}]*overflow:hidden/);
 assert.match(css,/\.homeCategories \.cats\{[^}]*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});
