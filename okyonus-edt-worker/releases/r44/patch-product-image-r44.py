from pathlib import Path
import sys

def apply(s):
    old='return current==null?"":String(current).trim();'
    new='''const saved=current==null?"":String(current).trim();
 const sourceId=String(product.source_product_id||product.sku||product.id||"").replace(/^catalog-/,"");
 // Correct only the confirmed historical wrong picture for this exact 2200g SKU.
 // Saved blank values and later admin-selected images remain authoritative.
 if(sourceId==="EDT-0127"&&saved==="https://static.wixstatic.com/media/73bc28_8fe872225e3748e9840daeb5e2a8fb5e~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg")
  return "https://www.toccosauce.com/wp-content/uploads/2024/03/SRIRACHA-tocco-packaging-900x900.png";
 return saved;'''
    assert s.count(old)==1,s.count(old)
    return s.replace(old,new,1)

if __name__=='__main__':
    p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
