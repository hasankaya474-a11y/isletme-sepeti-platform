const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const worker=fs.readFileSync(process.argv[2]||'/tmp/r47-catalog.mjs','utf8');const region=worker.slice(worker.indexOf('function commerceCatalogPage()'),worker.indexOf('function commerceCartPage()'));const literal=region.match(/const script=("(?:[^"\\]|\\.)*");/)[1];const script=JSON.parse(literal);
async function scenario(search=''){
 const products=Array.from({length:1347},(_,i)=>({id:'ID-'+i,source_product_id:'SRC-'+i,name:'Ürün '+i,category:i%2?'Yağlar':'Soslar',brand:i%3?'Marka':'Nadir',package_text:'Koli',price:100+i,image:'https://example.invalid/'+i+'.jpg',unit:'Kg',min_order_qty:1,qty_step:1}));
 const storage=new Map(),listeners={},timers=new Map();let timerID=0,button,events=0;
 const cq={value:''},cc={value:'',innerHTML:''},catalogGrid={innerHTML:'',writes:0,appends:0,after(b){button=b},insertAdjacentHTML(where,html){assert.equal(where,'beforeend');this.innerHTML+=html;this.appends++}},catalogCount={textContent:''},catalogTools={};
 const context={cq,cc,catalogGrid,catalogCount,catalogTools,location:{search},window:{okyStorefrontRead:()=>Promise.resolve({catalogAuthoritative:true,products})},fetch:()=>{throw Error('Unexpected legacy fetch')},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},document:{createElement:()=>({}),dispatchEvent:()=>events++,addEventListener:(n,f)=>{listeners[n]=f}},Event:class{constructor(type){this.type=type}},URLSearchParams,Intl,Date,console,setTimeout:(fn,ms)=>{timers.set(++timerID,{fn,ms});return timerID},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(script,context);
 await new Promise(r=>setImmediate(r));
 const count=()=>[...catalogGrid.innerHTML.matchAll(/<article class="product">/g)].length;
 assert.equal(count(),48);assert.equal(catalogCount.textContent,'1347 ürün');assert.equal(button.hidden,false);assert.match(catalogGrid.innerHTML,/<img loading="lazy" decoding="async" draggable="false"/);assert.match(catalogGrid.innerHTML,/href="\/urun\/ID-0"/);
 const firstHTML=catalogGrid.innerHTML;button.onclick();assert.equal(count(),96);assert.equal(catalogGrid.appends,1);assert.ok(catalogGrid.innerHTML.startsWith(firstHTML));
 cq.value='Ürün 1346';cq.oninput();cq.value='Ürün 1333';cq.oninput();assert.equal([...timers.values()].filter(x=>x.ms===120).length,1);assert.equal(count(),96);
 for(const [id,t] of [...timers]){if(t.ms===120){timers.delete(id);t.fn()}}
 assert.equal(count(),1);assert.match(catalogGrid.innerHTML,/data-add="SRC-1333"/);assert.equal(button.hidden,true);
 cq.value='';cq.oninput();cc.value='yaglar';cc.onchange();assert.equal([...timers.values()].filter(x=>x.ms===120).length,0);assert.equal(catalogCount.textContent,'673 ürün');assert.equal(count(),48);
 button.onclick();assert.equal(count(),96);
 cc.value='';cc.onchange();assert.equal(count(),48);assert.equal(catalogCount.textContent,'1347 ürün');
 while(!button.hidden)button.onclick();assert.equal(count(),1347);const ids=[...catalogGrid.innerHTML.matchAll(/data-add="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,1347);assert.equal(ids[1346],'SRC-1346');
 const input={value:3,min:1,step:1},card={querySelector:()=>input},target={dataset:{add:'SRC-1346',name:'Ürün 1346',unit:'Kg'},textContent:'Sepete Ekle',closest:()=>card,matches:s=>s==='[data-add]'};listeners.click({target});const cart=JSON.parse(storage.get('oky-commerce-cart-v2'));assert.equal(cart.length,1);assert.equal(cart[0].id,'SRC-1346');assert.equal(cart[0].price,1446);assert.equal(cart[0].qty,3);assert.equal(cart[0].image,'https://example.invalid/1346.jpg');
 cq.value='NONEXISTENT';cq.oninput();for(const [id,t]of[...timers])if(t.ms===120){timers.delete(id);t.fn()}assert.equal(count(),0);assert.match(catalogGrid.innerHTML,/Ürün bulunamadı/);assert.equal(button.hidden,true);
 cq.value='Ürün 1346';cq.oninput();catalogTools.onsubmit({preventDefault(){}});assert.equal([...timers.values()].filter(x=>x.ms===120).length,0);assert.equal(count(),1);
 console.log('PASS 1347 products:48→96→all; full-data filtering/reset; debounce; zero loss; correct cart product; native link/image attrs; empty result');
}
scenario().catch(e=>{console.error(e);process.exitCode=1});
