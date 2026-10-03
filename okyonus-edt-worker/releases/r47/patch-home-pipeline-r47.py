from pathlib import Path
import re,sys

def apply(s):
 def rep(a,b,count=1):
  nonlocal s
  n=s.count(a)
  if n!=count:raise ValueError(f'{n} expected {count}: {a[:100]}')
  s=s.replace(a,b)
 rep('async function storefront(env,productTarget=""){','async function storefront(env,productTarget="",homepageOnly=false){')
 rep(' const storefrontDB=commerceDatabase(env);',' const storefrontDB=commerceDatabase(env);\n let tableNames=new Set();')
 start=s.index('async function storefront(env,');end=s.index('function commerceCatalogPage(',start)
 part=s[start:end]
 part=part.replace('  if(DB){','  if(DB){\n   tableNames=new Set(((await DB.prepare("SELECT name FROM sqlite_master WHERE type=\'table\'").all()).results||[]).map(x=>x.name));',1)
 pattern=r'''await DB\.prepare\("SELECT name FROM sqlite_master WHERE type='table' AND name='([a-z0-9_]+)'"\)\.first\(\)'''
 part,n=re.subn(pattern,lambda m:'tableNames.has("'+m.group(1)+'")',part)
 assert n>=10,n
 old="+(productTarget?' AND (p.id=? OR p.category=(SELECT category FROM b2b_products_v1 WHERE id=?))':'')"
 assert part.count(old)==1
 part=part.replace(old,"+(homepageOnly?(hasMeta&&mCols.has('featured')?' AND COALESCE(m.featured,0)=1':' AND 1=0'):'')"+old)
 old="const pCols=await columns('b2b_products_v1'),mCols=hasMeta?await columns('oky_product_meta_v1'):new Set(),cCols=hasCommerce?await columns('oky_product_commerce_v1'):new Set();"
 new="const [pCols,mCols,cCols]=await Promise.all([columns('b2b_products_v1'),hasMeta?columns('oky_product_meta_v1'):new Set(),hasCommerce?columns('oky_product_commerce_v1'):new Set()]);"
 assert old in part;part=part.replace(old,new)
 old="const brandCols=hasBrands?await columns('oky_brands_v1'):new Set(),priceCols=hasPrices?await columns('b2b_prices_v1'):new Set();"
 new="const [brandCols,priceCols]=await Promise.all([hasBrands?columns('oky_brands_v1'):new Set(),hasPrices?columns('b2b_prices_v1'):new Set()]);"
 assert old in part;part=part.replace(old,new)
 # Independent public configuration reads do not depend on one another.
 config_start=part.index(' let banners=[]')
 config=part[config_start:]
 config=config.replace('  if(DB){','  if(DB){\n   const configurationReads=[];',1)
 pattern=r"if\(([^)]+)\)([a-zA-Z]+)=\(await (DB\.prepare\([^\n]+?\)\.all\(\))\)\.results\|\|\[\];"
 config,n=re.subn(pattern,lambda m:'if('+m.group(1)+')configurationReads.push('+m.group(3)+'.then(r=>{'+m.group(2)+'=r.results||[]}));',config)
 assert n==9,n
 old='if(hset){const sr=(await DB.prepare("SELECT key,value FROM oky_storefront_settings_v1").all()).results||[];settings=Object.fromEntries(sr.map(x=>[x.key,x.value]));}'
 new='if(hset)configurationReads.push(DB.prepare("SELECT key,value FROM oky_storefront_settings_v1").all().then(r=>{settings=Object.fromEntries((r.results||[]).map(x=>[x.key,x.value]))}));'
 assert old in config;config=config.replace(old,new)
 needle='  }\n }catch{}'
 assert needle in config;config=config.replace(needle,'   await Promise.allSettled(configurationReads);\n'+needle,1)
 part=part[:config_start]+config
 s=s[:start]+part+s[end:]
 rep('return storefront(env,String(u.searchParams.get("product")||"").slice(0,240));','return storefront(env,String(u.searchParams.get("product")||"").slice(0,240),u.searchParams.get("scope")==="home");')
 # Only header's default reader is scoped; cart/detail requests remain unchanged.
 start=s.index('function header(){return `');end=s.index('</script>',start)
 part=s[start:end];old="fetch('/api/storefront-v2'+(location.pathname.startsWith('/urun/')?'?product='+encodeURIComponent(decodeURIComponent(location.pathname.slice(6))):''),"
 assert part.count(old)==1
 part=part.replace(old,"fetch('/api/storefront-v2'+(location.pathname==='/'?'?scope=home':location.pathname.startsWith('/urun/')?'?product='+encodeURIComponent(decodeURIComponent(location.pathname.slice(6))):''),")
 s=s[:start]+part+s[end:]
 return s

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()));print('R47 home payload and schema read pipeline applied')
