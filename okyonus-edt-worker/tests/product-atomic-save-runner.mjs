import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import {webcrypto} from 'node:crypto';
const s=fs.readFileSync(new URL('../src/zaman-admin-worker.js',import.meta.url),'utf8');
const core=s.slice(s.indexOf('function j('),s.indexOf('async function ensure(')).replace(/function adminProductImage[^\n]+\n/,'');
const api=s.slice(s.indexOf('async function commerceAdminApi('),s.indexOf('function commerceAdminPage('));
const ctx=vm.createContext({Headers,Response,Request,URL,crypto:webcrypto});vm.runInContext(core+'\nasync function ensure(){}\n'+api,ctx);
const old={id:'p1',name:'Test',category:'Donuk',unit:'Kg',active:1,image_url:'https://example.com/old.webp'};
function db(){const d={runs:[],batches:[],prepare(sql){return {sql,args:[],bind(...args){this.args=args;return this},async first(){if(sql.includes('SELECT * FROM b2b_products'))return old;if(sql.includes('SELECT id FROM b2b_products')&&!sql.includes('name=?'))return {id:'p1'};if(sql.includes('SELECT price'))return {price:10};return null},async run(){d.runs.push(this);return {success:true}},async all(){return {results:[]}}}},async batch(statements){d.batches.push(statements);if(d.fail)throw Error('injected batch failure');return statements.map(()=>({success:true}))}};return d}
async function call(body,path='products/p1',admin=db(),main=db()){const response=await ctx.commerceAdminApi(new Request('https://admin.test/api/commerce-admin/'+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}),{DB:main,ADMIN_DB:admin},{user:{role:'owner',id:'u1'}},{});return {response,admin,main}}
let r=await call({price:23,imageUrl:'https://example.com/new.webp',featured:true});assert.equal(r.response.status,200);assert.equal(r.admin.batches.length,1);assert.equal(r.admin.runs.length,0);assert.equal(r.main.batches.length,0);assert.equal(r.admin.batches[0].length,6);
r=await call({price:-1,featured:true});assert.equal(r.response.status,400);assert.equal(r.admin.batches.length,0);
r=await call({price:null});assert.equal(r.admin.batches[0].filter(x=>x.sql.startsWith('INSERT INTO b2b_prices')).length,0);assert.equal(r.admin.batches[0].filter(x=>x.sql.startsWith('UPDATE b2b_prices')).length,1);
r=await call({description:'changed'});assert.equal(r.admin.batches[0].filter(x=>x.sql.includes('b2b_prices')).length,0);
r=await call({name:'New',category:'Donuk',price:25},'products');assert.equal(r.response.status,201);assert.equal(r.admin.batches[0].length,5);
const broken=db();broken.fail=true;await assert.rejects(()=>call({price:22},'products/p1',broken),/injected/);assert.equal(broken.runs.length,0);
r=await call({featured:true},'product-featured/p1');assert.equal(r.admin.runs.length,1);assert(!r.admin.runs[0].sql.includes('description=excluded'));
console.log('PASS 7 scenarios: atomic update/create, ADMIN_DB isolation, negative rejection, base clear, omitted preservation, failure propagation, featured preservation');
