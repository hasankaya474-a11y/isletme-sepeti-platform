from pathlib import Path
import sys

HELPER=r'''
// R44 public studio media reader: fixed asset IDs only; KV and R2 supported.
async function okyR44ReadStudioAsset(request,env,headers=new Headers()){
 const path=new URL(request.url).pathname,id=path.slice('/studio-media/'.length);
 const reply=(status,error)=>new Response(JSON.stringify({ok:false,error}),{status,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(!['GET','HEAD'].includes(request.method))return reply(405,'METHOD_NOT_ALLOWED');
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:png|jpg|webp)$/i.test(id))return reply(404,'MEDIA_NOT_FOUND');
 const store=env&&env.MEDIA_STORE;if(!store)return reply(503,'MEDIA_STORE_NOT_BOUND');
 try{
  let body,meta={};
  if(typeof store.getWithMetadata==='function'){const got=await store.getWithMetadata('studio/'+id,{type:'arrayBuffer'});body=got?.value;meta=got?.metadata||{}}
  else {const got=await store.get('studio/'+id);body=got?.body;meta={...(got?.customMetadata||{}),mime:got?.httpMetadata?.contentType||got?.customMetadata?.mime,size:got?.size}}
  if(!body)return reply(404,'MEDIA_NOT_FOUND');
  const mime=String(meta.mime||'');if(!['image/png','image/jpeg','image/webp'].includes(mime))return reply(415,'IMAGE_TYPE_NOT_ALLOWED');
  const h=new Headers(headers);h.set('content-type',mime);h.set('cache-control','public, max-age=3600');h.set('x-content-type-options','nosniff');if(meta.size)h.set('content-length',String(meta.size));
  return new Response(request.method==='HEAD'?null:body,{status:200,headers:h});
 }catch{return reply(503,'MEDIA_READ_FAILED')}
}
'''

def apply_deniz(source):
 anchor="  if(new URL(request.url).pathname==='/api/health'){"
 assert source.count(anchor)==1
 source=source.replace(anchor,"  if(new URL(request.url).pathname.startsWith('/studio-media/'))return okyR40SecureResponse(request,await okyR44ReadStudioAsset(request,env));\n"+anchor)
 return source+HELPER

def apply_zaman(source):
 start=source.index('    async function publicStudioMedia(request,env,headers,url){')
 end=source.index('\n    async function studioMediaRoute(',start)
 source=source[:start]+"    async function publicStudioMedia(request,env,headers,url){return okyR44ReadStudioAsset(request,env,headers)}\n"+source[end:]
 old="await env.MEDIA_STORE.put(key,bytes,{metadata:{mime,size:bytes.byteLength,name:originalName,uploadedBy:auth.user.id,uploadedAt:now}});"
 new="const metadata={mime,size:bytes.byteLength,name:originalName,uploadedBy:auth.user.id,uploadedAt:now};await env.MEDIA_STORE.put(key,bytes,typeof env.MEDIA_STORE.getWithMetadata==='function'?{metadata}:{httpMetadata:{contentType:mime},customMetadata:Object.fromEntries(Object.entries(metadata).map(([k,v])=>[k,String(v)]))});"
 assert source.count(old)==1
 return source.replace(old,new)+HELPER

if __name__=='__main__':
 path=Path(sys.argv[2]);path.write_text((apply_deniz if sys.argv[1]=='deniz' else apply_zaman)(path.read_text()))
