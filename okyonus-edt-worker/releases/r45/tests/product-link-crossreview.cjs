const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const s=fs.readFileSync(process.argv[2],'utf8'),a=s.indexOf('function card(p){'),b=s.indexOf('\nfunction ',a);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ctx={commerceProductImage:p=>p.image||'',esc,productVisual:()=>'<span>Ürün</span>',money:()=>''};vm.createContext(ctx);vm.runInContext(s.slice(a,b),ctx);
for(const p of [{id:'new/variant 2',source_product_id:'old-source',name:'Name "<test>',image:'https://example.org/product.jpg'},{id:'legacy-patates',name:'Donuk Patates',image:''}]){
 const html=ctx.card(p),href='/urun/'+encodeURIComponent(p.id);assert(html.includes('<a class="img" href="'+href+'"'));assert(html.includes('<h3><a href="'+href+'"'));assert(!html.includes('href="https://'));assert(!html.includes('href="/urun/old-source"'));assert(!html.includes('Name "<test>'));
}
console.log('PASS server product image/title native internal href, canonical variant ID, missing image and escaped name');
