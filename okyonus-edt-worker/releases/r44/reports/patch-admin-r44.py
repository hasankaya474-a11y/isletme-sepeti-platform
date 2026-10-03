from pathlib import Path
import sys

def apply(source):
    old="result.match=body.build==='commerce-v2-2026-10-02-admin-sync-r36-resource-fix'&&rows.length===published.length&&mismatched.length===0;"
    new="result.match=rows.length===published.length&&mismatched.length===0;"
    assert source.count(old)==1,'Publication match anchor not unique'
    source=source.replace(old,new)
    old="if(!result.match)result.error=body.build!=='commerce-v2-2026-10-02-admin-sync-r36-resource-fix'?'PUBLIC_STOREFRONT_VERSION_MISMATCH':'PUBLIC_STOREFRONT_VALUES_DIFFER';"
    new="if(!result.match)result.error='PUBLIC_STOREFRONT_VALUES_DIFFER';"
    assert source.count(old)==1,'Publication error anchor not unique'
    source=source.replace(old,new)
    old="pr.active=1 AND (pr.valid_from IS NULL OR pr.valid_from<=datetime('now')) ORDER BY pr.valid_from DESC LIMIT 1) AS basePrice"
    new="pr.active=1 AND (pr.valid_from IS NULL OR pr.valid_from<=datetime('now')) AND (pr.valid_until IS NULL OR pr.valid_until>datetime('now')) ORDER BY pr.valid_from DESC LIMIT 1) AS basePrice"
    assert source.count(old)==1,'Publication expiry anchor not unique'
    source=source.replace(old,new)
    # Panel prices must obey the same schedule as public storefront prices.
    source=source.replace("pr.product_id=p.id AND pr.active=1 ORDER BY valid_from DESC LIMIT 1", "pr.product_id=p.id AND pr.active=1 AND (pr.valid_from IS NULL OR pr.valid_from<=datetime('now')) AND (pr.valid_until IS NULL OR pr.valid_until>datetime('now')) ORDER BY valid_from DESC LIMIT 1")
    source=source.replace("SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 ORDER BY valid_from DESC LIMIT 1", "SELECT price FROM b2b_prices_v1 WHERE product_id=? AND active=1 AND (valid_from IS NULL OR valid_from<=datetime('now')) AND (valid_until IS NULL OR valid_until>datetime('now')) ORDER BY valid_from DESC LIMIT 1")
    old="text(product.image??product.image_url)!==text(row.image_url)"
    new="text(product.image??product.image_url)!==publicationImage(row)"
    assert source.count(old)==1,'Publication image anchor not unique'
    source=source.replace(old,new)
    old="const text=v=>String(v??''),number=v=>v==null||v===''?null:Number(v);"
    new="const text=v=>String(v??''),number=v=>v==null||v===''?null:Number(v),publicationImage=row=>{const image=text(row.image_url).trim(),sourceId=text(row.source_product_id||row.sku||row.id).replace(/^catalog-/,'');return sourceId==='EDT-0127'&&image==='https://static.wixstatic.com/media/73bc28_8fe872225e3748e9840daeb5e2a8fb5e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg'?'https://www.toccosauce.com/wp-content/uploads/2024/03/SRIRACHA-tocco-packaging-900x900.png':image};"
    assert source.count(old)==1,'Publication helper anchor not unique'
    source=source.replace(old,new)
    source=source.replace("SELECT p.id,p.source_product_id,p.name,p.image_url,m.description,(SELECT price", "SELECT p.id,p.source_product_id,pc.sku,p.name,p.image_url,m.description,(SELECT price",1)
    return source

if __name__=='__main__':
    path=Path(sys.argv[1]);path.write_text(apply(path.read_text()))
