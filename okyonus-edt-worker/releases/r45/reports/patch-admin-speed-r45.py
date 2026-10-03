from pathlib import Path
import sys

ROW_QUERY="""SELECT p.*,(SELECT price FROM b2b_prices_v1 pr WHERE pr.product_id=p.id AND pr.active=1 AND (pr.valid_from IS NULL OR pr.valid_from<=datetime('now')) AND (pr.valid_until IS NULL OR pr.valid_until>datetime('now')) ORDER BY pr.valid_from DESC LIMIT 1) current_price,m.brand_id,m.description,m.seo_title,m.seo_description,m.sort_order,m.featured,pc.sku,pc.barcode,pc.subcategory,pc.origin,pc.storage_conditions,pc.cold_chain,pc.min_order_qty,pc.qty_step,pc.list_price,pc.sale_price,pc.new_until,pc.best_seller,(SELECT name FROM oky_brands_v1 b WHERE b.id=m.brand_id LIMIT 1) brand_name FROM b2b_products_v1 p LEFT JOIN oky_product_meta_v1 m ON m.product_id=p.id LEFT JOIN oky_product_commerce_v1 pc ON pc.product_id=p.id WHERE p.id=?"""
HELPER="\nasync function okyR45AdminProduct(env,id){const row=await env.DB.prepare("+repr(ROW_QUERY)+").bind(id).first();if(row)row.image_url=row.image_url||null;return row}\n"

def apply(source):
    # Return the authoritative saved row, including nullable fields, avoiding a full catalogue refresh.
    old='return j({ok:true,id:rid},201,headers);'
    assert source.count(old)==1
    source=source.replace(old,'return j({ok:true,id:rid,data:await okyR45AdminProduct(env,rid)},201,headers);')
    start=source.index(' if(resource==="products"){');end=source.index(' const table=tables[resource]',start)
    block=source[start:end];old='return j({ok:true,id},200,headers);';assert block.count(old)==1
    block=block.replace(old,'return j({ok:true,id,data:await okyR45AdminProduct(env,id)},200,headers);')
    block=block.replace('  if(request.method==="GET"){const rows=', '  if(request.method==="GET"&&id){const row=await okyR45AdminProduct(env,id);return j(row?{ok:true,data:row}:{ok:false,error:"PRODUCT_NOT_FOUND"},row?200:404,headers)}\n  if(request.method==="GET"){const rows=',1)
    source=source[:start]+block+source[end:]
    old="f.onsubmit=async e=>{e.preventDefault();if(f.dataset.saving==='1')return;"
    new="f.onsubmit=async e=>{e.preventDefault();rememberProductView();if(f.dataset.saving==='1')return;"
    assert source.count(old)==1;source=source.replace(old,new)
    # Cache brands once per page; reconnect only if retrieval failed.
    anchor="async function bindProductForm(id=''){"
    helpers="""let productBrandPromise=null,productListView={term:'',category:'',page:1};
function rememberProductView(){const search=document.getElementById('productSearch'),category=document.getElementById('productCategory');if(search&&category)productListView={term:search.value,category:category.value,page:productPage}}
async function showCachedProductList(){const rows=productRows;content.innerHTML=productUI(rows);productPage=productListView.page;const search=document.getElementById('productSearch'),category=document.getElementById('productCategory');search.value=productListView.term;category.value=productListView.category;await bindProductForm();renderProductTable();for(const id of ['productSearch','productCategory'])document.getElementById(id).oninput=()=>{productPage=1;renderProductTable()}}
"""
    assert source.count(anchor)==1;source=source.replace(anchor,helpers+anchor)
    old="try{const bj=await api('brands'),dl=document.getElementById('brandIds');"
    new="try{const bj=await(productBrandPromise||(productBrandPromise=api('brands').catch(error=>{productBrandPromise=null;throw error}))),dl=document.getElementById('brandIds');"
    assert source.count(old)==1;source=source.replace(old,new)
    source=source.replace("cancel.onclick=()=>load();","cancel.onclick=()=>showCachedProductList();",1)
    old="await api('products'+(id?'/'+encodeURIComponent(id):''),{method:'POST',body:JSON.stringify(b)});saved=true;await load();"
    new="const result=await api('products'+(id?'/'+encodeURIComponent(id):''),{method:'POST',body:JSON.stringify(b)});saved=true;if(result.data&&result.data.id){const index=productRows.findIndex(row=>String(row.id)===String(result.data.id));if(index>=0)productRows[index]=result.data;else productRows.push(result.data);await showCachedProductList()}else await load();"
    assert source.count(old)==1;source=source.replace(old,new)
    old="try{await summary()}catch(_){} }catch(error)"
    new="if(!id)summary().catch(()=>{}); }catch(error)"
    assert source.count(old)==1;source=source.replace(old,new)
    old="async function editProduct(id){const x=productRows.find"
    new="async function editProduct(id){rememberProductView();const x=productRows.find"
    assert source.count(old)==1;source=source.replace(old,new)
    # Edit back button uses cached list, like cancel; no catalogue request.
    old=r'onclick="load()">\u2190 \u00dcr\u00fcn listesine d\u00f6n'
    new=r'onclick="showCachedProductList()">\u2190 \u00dcr\u00fcn listesine d\u00f6n'
    start=source.index('async function editProduct(id)');end=source.index('async function disableProduct(id)',start)
    block=source[start:end];assert block.count(old)==1
    source=source[:start]+block.replace(old,new)+source[end:]
    # One bounded upload operation, including the explicitly unconfigured-storage fallback.
    old="const optimized=await optimizeUploadImage(file,form?.id==='pf'?1600:2400),fd=new FormData();"
    new="const uploadController=new AbortController(),uploadTimer=setTimeout(()=>uploadController.abort(),60000);try{const optimized=await optimizeUploadImage(file,form?.id==='pf'?1600:2400),fd=new FormData();"
    assert source.count(old)==1;source=source.replace(old,new)
    old="body:fd,credentials:'same-origin'};"
    new="body:fd,credentials:'same-origin',signal:uploadController.signal};"
    assert source.count(old)==1;source=source.replace(old,new)
    old="input.value=j.url;input.dispatchEvent(new Event('input',{bubbles:true}));"
    new="let imageUrl;try{imageUrl=new URL(String(j.url),location.origin);if(imageUrl.protocol!=='https:'||imageUrl.username||imageUrl.password||/[\\\\\\u0000-\\u0020]/.test(String(j.url)))throw Error('INVALID_UPLOAD_URL')}catch{throw Error('INVALID_UPLOAD_URL')}input.value=imageUrl.href;input.dispatchEvent(new Event('input',{bubbles:true}));}catch(error){if(uploadController.signal.aborted)throw Error('IMAGE_UPLOAD_TIMEOUT');throw error}finally{clearTimeout(uploadTimer)}"
    assert source.count(old)==1;source=source.replace(old,new)
    return source+HELPER

if __name__=='__main__':
    path=Path(sys.argv[1]);path.write_text(apply(path.read_text()))
