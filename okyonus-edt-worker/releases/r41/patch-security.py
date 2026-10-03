from pathlib import Path
import sys
root=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).parent
helper=r'''
// R40 response hardening; report-only script policy preserves existing inline modules.
function okyR40SecureResponse(request,response,admin=false){
 if(response.status===101)return response;
 const headers=new Headers(response.headers),path=new URL(request.url).pathname;
 headers.set('strict-transport-security','max-age=31536000');
 headers.set('x-content-type-options','nosniff');
 headers.set('x-frame-options','DENY');
 headers.set('referrer-policy','strict-origin-when-cross-origin');
 headers.set('permissions-policy','camera=(self), microphone=(), geolocation=()');
 // Enforce narrow structural rules; script restrictions are observation-only pending nonce migration.
 headers.set('content-security-policy',"base-uri 'self'; object-src 'none'; frame-ancestors 'none'");
 headers.set('content-security-policy-report-only',"default-src 'self' https:; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data: blob:; connect-src 'self' https:; font-src 'self' https: data:; worker-src 'self' blob:");
 if(admin||request.headers.has('authorization')||request.headers.has('cookie')||headers.has('set-cookie')||/^\/(?:api\/(?:member|auth|admin)|uye|hesabim|yonetici)(?:\/|$)/.test(path)){
  headers.set('cache-control','private, no-store');
  headers.delete('expires');headers.delete('etag');
  const vary=headers.get('vary');if(vary!=='*')headers.set('vary',[vary,'Cookie','Authorization'].filter(Boolean).join(', '));
 }
 return new Response(request.method==='HEAD'?null:response.body,{status:response.status,statusText:response.statusText,headers});
}
'''
def apply(t, admin=False):
 if '// R40 response hardening;' in t:return t
 assert t.count('export default {')==1
 t=t.replace('export default {','const okyR40InnerWorker = {',1)
 # Remove historical implementation commentary, while keeping substantive policy text.
 import re
 t=re.sub(r'<[^>]+>Teknik uyum notu:.*?</[^>]+>', '',t,flags=re.S) if 'Teknik uyum notu:' in t else t
 endpoint='''
  if(new URL(request.url).pathname==='/api/health'){
   const allowed=request.method==='GET'||request.method==='HEAD';
   const response=new Response(allowed?JSON.stringify({ok:true,service:'okyanus-edt-web',checkedAt:new Date().toISOString(),scope:'web-worker'}):JSON.stringify({ok:false,error:'METHOD_NOT_ALLOWED'}),{status:allowed?200:405,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','allow':'GET, HEAD','x-robots-tag':'noindex'}});
   return okyR40SecureResponse(request,response);
  }
''' if not admin else ''
 wrapper='\nexport default {\n async fetch(request,env,ctx){'+endpoint+'\n  return okyR40SecureResponse(request,await okyR40InnerWorker.fetch(request,env,ctx),'+str(admin).lower()+');\n },\n'
 wrapper+=' scheduled(event,env,ctx){return okyR40InnerWorker.scheduled?.(event,env,ctx)}\n};\n'
 return t+helper+wrapper

if __name__ == '__main__':
 for filename,admin in [('deniz.mjs',False),('zaman.mjs',True)]:
  p=root/filename;p.write_text(apply(p.read_text(),admin))
