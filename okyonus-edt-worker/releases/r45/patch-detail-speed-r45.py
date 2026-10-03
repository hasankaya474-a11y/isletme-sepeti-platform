from pathlib import Path
import sys

def apply(s):
    assert s.count('async function storefront(env){')==1
    s=s.replace('async function storefront(env){','async function storefront(env,productTarget=""){',1)
    anchor="    const sql='SELECT '+"
    insert='''    let detailId="";
    if(productTarget){
     const detailSlug=v=>String(v||"").toLocaleLowerCase("tr-TR").normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
     const identifiers=(await DB.prepare('SELECT id,'+(pCols.has('source_product_id')?'source_product_id':'NULL AS source_product_id')+',name FROM b2b_products_v1'+(pCols.has('active')?' WHERE active=1':'')).all()).results||[];
     const match=identifiers.find(x=>String(x.id)===productTarget)||identifiers.find(x=>String(x.source_product_id)===productTarget)||identifiers.find(x=>detailSlug(x.name)===productTarget);
     detailId=match?String(match.id):"__not_found__";
    }
'''
    assert s.count(anchor)==1
    s=s.replace(anchor,insert+anchor,1)
    old="(pCols.has('active')?' WHERE p.active=1':'')+' ORDER BY '+order;"
    new="(pCols.has('active')?' WHERE p.active=1':' WHERE 1=1')+(productTarget?' AND (p.id=? OR p.category=(SELECT category FROM b2b_products_v1 WHERE id=?))':'')+' ORDER BY '+(productTarget?'CASE WHEN p.id=? THEN 0 ELSE 1 END,':'')+order+(productTarget?' LIMIT 6':'');"
    assert s.count(old)==1
    s=s.replace(old,new,1)
    old='const rows=(await DB.prepare(sql).all()).results||[];homepageAuthoritative='
    new='const statement=DB.prepare(sql);const rows=(await (productTarget?statement.bind(detailId,detailId,detailId):statement).all()).results||[];homepageAuthoritative='
    assert s.count(old)==1;s=s.replace(old,new,1)
    anchor=' return json({ok:true,build:BUILD,catalogAuthoritative'
    assert s.count(anchor)==1
    insert='''  if(productTarget){
   const detailSlug=v=>String(v||"").toLocaleLowerCase("tr-TR").normalize("NFKD").replace(/[\\u0300-\\u036f]/g,"").replace(/ı/g,"i").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
   const target=products.find(p=>String(p.id)===productTarget)||products.find(p=>String(p.source_product_id)===productTarget)||products.find(p=>detailSlug(p.name)===productTarget);
   products=target?[target,...products.filter(p=>p!==target&&p.category===target.category).slice(0,5)]:[];
   return json({ok:true,build:BUILD,catalogAuthoritative,homepageAuthoritative,catalogReadError,products:products.map(p=>({...p,image:commerceProductImage(p)})),settings:publicStorefrontSettings(settings),detailView:true});
  }
'''
    s=s.replace(anchor,insert+anchor,1)
    old='if(m==="GET"&&p==="/api/storefront-v2")return storefront(env);'
    new='if(m==="GET"&&p==="/api/storefront-v2")return storefront(env,String(u.searchParams.get("product")||"").slice(0,240));'
    assert old in s;s=s.replace(old,new,1)
    # Product detail and its settings share compact response; all other consumers unchanged.
    start=s.index('function header(){');end=s.index('function footer(){',start)
    segment=s[start:end]
    old="fetch('/api/storefront-v2',{headers:{accept:'application/json'},cache:'no-store'})"
    new="fetch('/api/storefront-v2'+(location.pathname.startsWith('/urun/')?'?product='+encodeURIComponent(decodeURIComponent(location.pathname.slice(6))):''),{headers:{accept:'application/json'},cache:'no-store'})"
    assert segment.count(old)==1
    s=s[:start]+segment.replace(old,new,1)+s[end:]
    return s

if __name__=='__main__':
    p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
