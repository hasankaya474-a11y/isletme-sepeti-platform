from pathlib import Path
import sys
HELPERS=r'''
// R45 bound multipart uploads even when Content-Length is absent or incorrect.
async function okyR45BoundedFormData(request,max=9*1024*1024){
 const length=Number(request.headers.get('content-length')||0);
 if(length>max)throw Object.assign(new Error('IMAGE_TOO_LARGE'),{status:413});
 let size=0;const chunks=[],reader=request.body?.getReader();
 if(reader){try{while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>max){await reader.cancel().catch(()=>{});throw Object.assign(new Error('IMAGE_TOO_LARGE'),{status:413})}chunks.push(value)}}finally{reader.releaseLock()}}
 const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength}
 try{return await new Response(bytes,{headers:{'content-type':request.headers.get('content-type')||''}}).formData()}catch{throw Object.assign(new Error('INVALID_UPLOAD_FORM'),{status:400})}
}
async function okyR45GithubMediaFetch(url,options){
 const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
 try{return await fetch(url,{...options,signal:controller.signal})}catch(error){
  throw Object.assign(new Error(controller.signal.aborted?'GITHUB_MEDIA_TIMEOUT':'GITHUB_MEDIA_UNAVAILABLE'),{status:controller.signal.aborted?504:502});
 }finally{clearTimeout(timer)}
}
'''
def apply(source):
 if '// R45 bound multipart uploads' in source:return source
 old="const fd=await request.formData(),file=fd.get('file');"
 assert source.count(old)==2,source.count(old)
 source=source.replace(old,"const fd=await okyR45BoundedFormData(request),file=fd.get('file');")
 old="const bytes=new Uint8Array(await file.arrayBuffer());let ext='';"
 assert source.count(old)==1
 source=source.replace(old,"const bytes=new Uint8Array(await file.arrayBuffer());if(!bytes.byteLength||bytes.byteLength>8*1024*1024)return j({ok:false,error:'IMAGE_TOO_LARGE'},413,headers);let ext='';")
 start=source.index(" if(resource==='image-upload'){");end=source.index(' if(resource==="product-featured"',start)
 block=source[start:end].replace('await fetch(api','await okyR45GithubMediaFetch(api')
 source=source[:start]+block+source[end:]
 return source+HELPERS
if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
