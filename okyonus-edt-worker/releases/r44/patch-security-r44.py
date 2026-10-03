from pathlib import Path
import sys

def apply(source, admin=False):
 old=""" headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('permissions-policy','camera=(self), microphone=(), geolocation=()');
 // Enforce narrow structural rules; script restrictions are observation-only pending nonce migration.
 headers.set('content-security-policy',\"base-uri 'self'; object-src 'none'; frame-ancestors 'none'\");"""
 new=""" // R44 preserve route policies rather than replacing stricter administrator restrictions.
 if(!headers.has('referrer-policy'))headers.set('referrer-policy','strict-origin-when-cross-origin');
 if(!headers.has('permissions-policy'))headers.set('permissions-policy','camera=(self), microphone=(), geolocation=()');
 const existingCsp=headers.get('content-security-policy')||'';
 const requiredCsp=[[\"base-uri\",\"'self'\"],[\"object-src\",\"'none'\"],[\"frame-ancestors\",\"'none'\"]];
 const additions=requiredCsp.filter(([name])=>!new RegExp('(?:^|;)\\\\s*'+name+'(?:\\\\s|$)','i').test(existingCsp)).map(([name,value])=>name+' '+value);
 headers.set('content-security-policy',[existingCsp,...additions].filter(Boolean).join('; '));"""
 if '// R44 preserve route policies' not in source:
  assert source.count(old)==1,'security wrapper anchor'
  source=source.replace(old,new)
 if admin and '// R44 verify uploaded bytes' not in source:
  old="const bytes=await file.arrayBuffer();if(bytes.byteLength>max)throw http(413,'IMAGE_MAX_8_MB');"
  new="""const bytes=await file.arrayBuffer();if(bytes.byteLength<1||bytes.byteLength>max)throw http(413,'IMAGE_MAX_8_MB');
        // R44 verify uploaded bytes before storage, never trust multipart MIME alone.
        if(okyR44ImageMime(bytes)!==mime)throw http(415,'IMAGE_SIGNATURE_MISMATCH');"""
  assert source.count(old)==1,'studio upload anchor';source=source.replace(old,new)
  source+='''\nfunction okyR44ImageMime(buffer){
 const b=new Uint8Array(buffer);
 if(b.length>=3&&b[0]===255&&b[1]===216&&b[2]===255)return 'image/jpeg';
 if(b.length>=8&&[137,80,78,71,13,10,26,10].every((v,i)=>b[i]===v))return 'image/png';
 if(b.length>=12&&String.fromCharCode(...b.slice(0,4))==='RIFF'&&String.fromCharCode(...b.slice(8,12))==='WEBP')return 'image/webp';
 return '';
}\n'''
 if not admin and 'function okyR44ProductUnavailable' not in source:
  old=r"if(/stok yok|t\u00fckendi|pasif|inactive|out of stock/i.test(String(canonical.stock_status||'')))"
  assert source.count(old)==1,'quote stock anchor'
  source=source.replace(old,"if(okyR44ProductUnavailable(canonical))")
  source+=r"""
function okyR44ProductUnavailable(product){
 if(!product)return true;
 if(product.active===false||product.active===0||product.active==='0')return true;
 const stock=String(product.stock_status||product.stockStatus||'').trim();
 return /^(?:OUT|INACTIVE|DISABLED|UNAVAILABLE|SOLD_OUT|OUT_OF_STOCK)$/i.test(stock)||/stok yok|t\u00fckendi|pasif|inactive|out of stock/i.test(stock);
}
"""
 return source

if __name__=='__main__':
 root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent
 for filename,admin in [('deniz.mjs',False),('zaman.mjs',True)]:
  p=root/filename;p.write_text(apply(p.read_text(),admin))
