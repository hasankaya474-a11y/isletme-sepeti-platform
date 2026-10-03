const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const path=require('node:path');
(async()=>{
const worker=(await import(pathToFileURL(path.resolve(__dirname,'../deniz.mjs')))).default;
const browser=await chromium.launch({headless:true});
try{
for(const width of [320,390,430,768,1024]){
 const page=await browser.newPage({viewport:{width,height:844}});
 await page.route('**/*',async route=>{
 const url=new URL(route.request().url());
 if(url.hostname!=='oky.test')return route.abort();
 if(route.request().isNavigationRequest()){
 const res=await worker.fetch(new Request(url),{},{});return route.fulfill({status:res.status,body:await res.text(),headers:{'content-type':'text/html'}});
 }
 if(url.pathname.includes('account'))return route.fulfill({status:401,body:'{}'});
 return route.fulfill({contentType:'application/json',body:JSON.stringify({ok:true,products:[{id:'P',name:'Test Patates',category:'Donuk Ürünler',featured:1,active:1,price:10}],homepageAuthoritative:true,catalogAuthoritative:true,settings:{},categories:[]})});
 });
 await page.goto('https://oky.test/');
 await page.locator('#openingCampaignClose').click({timeout:1000}).catch(()=>{});
 await page.evaluate(()=>{document.querySelectorAll('[id*="opening"],[id*="Opening"]').forEach(x=>{if(getComputedStyle(x).position==='fixed')x.remove()})});
 for(const scrolled of [false,true]){
 if(scrolled)await page.evaluate(()=>scrollTo(0,500));
 for(const [details,panel] of [['.mobileMenu','.mobileDrawer'],['.mobileSearchMenu','.mobileSearchPanel']]){
 await page.locator(details+' summary').click();
 assert(await page.locator(details).evaluate(x=>x.open));
 const p=await page.locator(panel).boundingBox(),h=await page.locator('.head').boundingBox();
 assert(p.y>=h.y+h.height-1 && p.y<844,`${width}: panel is beneath header and inside viewport: ${JSON.stringify(p)}`);
 assert(p.x>=0&&p.x+p.width<=width,`${width}: horizontal bounds`);
 await page.locator(details+' summary').click();
 }
 }
 await page.locator('.mobileSearchMenu summary').click();
 await page.locator('.mobileSearchPanel input').fill('patates');
 await page.locator('.mobileSearchPanel button').click();
 await page.waitForURL('**/urunler?q=patates');
 assert(await page.locator('.product').count()>0,'Search results render');
 console.log('PASS',width,'menu/search visible before/after scroll, search GET and product results');
 await page.close();
}
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
