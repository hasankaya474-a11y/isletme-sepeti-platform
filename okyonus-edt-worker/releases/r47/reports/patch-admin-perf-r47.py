from pathlib import Path
import sys

def apply(source):
    anchor=' if(resource==="legacy-catalog-sync"||resource==="catalogue-hydrate"){' 
    block=''' if(resource==='catalogue-status'){
  if(request.method!=='GET')return j({ok:false,error:'METHOD_NOT_ALLOWED'},405,headers);
  const seeds=typeof ADMIN_CATALOGUE_SEED!=='undefined'&&Array.isArray(ADMIN_CATALOGUE_SEED)?ADMIN_CATALOGUE_SEED:[];
  const rows=(await env.DB.prepare('SELECT id,source_product_id FROM b2b_products_v1').all()).results||[],ids=new Set(rows.flatMap(row=>[String(row.id||''),String(row.source_product_id||'')]).filter(Boolean));
  const required=[...new Set(seeds.map(row=>String(row.id||'')).filter(Boolean))],missing=required.filter(id=>!ids.has(id)&&!ids.has('catalog-'+id));
  return j({ok:true,complete:required.length>0&&missing.length===0,required:required.length,missing:missing.length},200,headers);
 }
'''
    assert source.count(anchor)==1;source=source.replace(anchor,block+anchor)
    old="let catalogueReady=false,productRows=[]"
    new="let catalogueReady=false,catalogueForceSync=false,productRows=[]"
    assert source.count(old)==1;source=source.replace(old,new)
    old="async function runLegacyCatalogSync(){catalogueReady=false;await load();await summary()}"
    new="async function runLegacyCatalogSync(){catalogueReady=false;catalogueForceSync=true;await load();await summary()}"
    assert source.count(old)==1;source=source.replace(old,new)
    anchor=" if((current==='products'||current==='bulk')&&!catalogueReady){content.textContent="
    prep=" if((current==='products'||current==='bulk')&&!catalogueReady&&!catalogueForceSync){const status=await api('catalogue-status');if(status.complete===true)catalogueReady=true}\n"
    assert source.count(anchor)==1;source=source.replace(anchor,prep+anchor)
    old="catalogueReady=true;await summary();}"
    new="catalogueReady=true;catalogueForceSync=false;summary().catch(()=>{});}"
    assert source.count(old)==1;source=source.replace(old,new)
    # Brand suggestions must not postpone attaching the save handler or drawing the table.
    old="try{const bj=await(productBrandPromise||(productBrandPromise=api('brands').catch(error=>{productBrandPromise=null;throw error}))),dl=document.getElementById('brandIds');if(dl&&Array.isArray(bj.data))dl.innerHTML=bj.data.filter(x=>Number(x.active)!==0).map(x=>'<option value=\"'+esc(x.id)+'\">'+esc(x.name)+'</option>').join('')}catch(_){}"
    new="(productBrandPromise||(productBrandPromise=api('brands').catch(error=>{productBrandPromise=null;throw error}))).then(bj=>{const dl=document.getElementById('brandIds');if(document.getElementById('pf')===f&&dl&&Array.isArray(bj.data))dl.innerHTML=bj.data.filter(x=>Number(x.active)!==0).map(x=>'<option value=\"'+esc(x.id)+'\">'+esc(x.name)+'</option>').join('')}).catch(()=>{});"
    assert source.count(old)==1;source=source.replace(old,new)
    return source

if __name__=='__main__':
    path=Path(sys.argv[1]);path.write_text(apply(path.read_text()))
