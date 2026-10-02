from pathlib import Path
import sys
p=Path(sys.argv[1]);s=p.read_text()
route=r'''
 if(resource==='image-upload'){
  if(request.method!=='POST')return j({ok:false,error:'METHOD_NOT_ALLOWED'},405,headers);
  if(!canWrite(auth))return j({ok:false,error:'FORBIDDEN'},403,headers);
  if(!env.GITHUB_MEDIA_TOKEN)return j({ok:false,error:'MEDIA_STORAGE_NOT_CONFIGURED'},503,headers);
  if(Number(request.headers.get('content-length')||0)>9*1024*1024)return j({ok:false,error:'IMAGE_TOO_LARGE'},413,headers);
  const fd=await request.formData(),file=fd.get('file');
  if(!file||typeof file.arrayBuffer!=='function'||file.size>8*1024*1024||!file.size)return j({ok:false,error:'INVALID_IMAGE'},400,headers);
  const bytes=new Uint8Array(await file.arrayBuffer());let ext='';
  if(bytes[0]===255&&bytes[1]===216&&bytes[2]===255)ext='jpg';
  else if([137,80,78,71,13,10,26,10].every((v,i)=>bytes[i]===v))ext='png';
  else if(new TextDecoder().decode(bytes.slice(0,4))==='RIFF'&&new TextDecoder().decode(bytes.slice(8,12))==='WEBP')ext='webp';
  if(!ext)return j({ok:false,error:'INVALID_IMAGE_TYPE'},400,headers);
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');
  const branch=String(env.GITHUB_MEDIA_BRANCH||'codex/okyanus-r38-20261002'),path='okyonus-edt-worker/media/uploads/'+hash+'.'+ext,api='https://api.github.com/repos/hasankaya474-a11y/isletme-sepeti-platform/contents/'+path;
  const gh={'Authorization':'Bearer '+env.GITHUB_MEDIA_TOKEN,'Accept':'application/vnd.github+json','User-Agent':'Okyanus-Media','X-GitHub-Api-Version':'2022-11-28'};
  const existing=await fetch(api+'?ref='+encodeURIComponent(branch),{headers:gh});
  if(existing.status!==200){
   if(existing.status!==404)return j({ok:false,error:'GITHUB_MEDIA_UNAVAILABLE'},502,headers);
   let binary='';for(let i=0;i<bytes.length;i+=8192)binary+=String.fromCharCode(...bytes.subarray(i,i+8192));
   const saved=await fetch(api,{method:'PUT',headers:{...gh,'Content-Type':'application/json'},body:JSON.stringify({message:'Upload Okyanus image '+hash.slice(0,12),content:btoa(binary),branch})});
   if(!saved.ok){const retry=await fetch(api+'?ref='+encodeURIComponent(branch),{headers:gh});if(!retry.ok)return j({ok:false,error:'GITHUB_MEDIA_SAVE_FAILED'},502,headers)}
  }
  const url='https://raw.githubusercontent.com/hasankaya474-a11y/isletme-sepeti-platform/'+encodeURIComponent(branch).replace(/%2F/g,'/')+'/'+path;
  return j({ok:true,url,storage:'github'},200,headers);
 }
'''
needle=' if(resource==="product-featured"&&id){'
assert s.count(needle)==1
s=s.replace(needle,route+needle)
old="  const r=await fetch('/api/studio-media',{method:'POST',headers:{'X-CSRF-Token':csrfToken()},body:fd,credentials:'same-origin'});\n  const raw=await r.text();let j={};try{j=raw?JSON.parse(raw):{}}catch{}"
new="  const uploadOptions={method:'POST',headers:{'X-CSRF-Token':csrfToken()},body:fd,credentials:'same-origin'};\n  let r=await fetch('/api/commerce-admin/image-upload',uploadOptions);\n  let raw=await r.text(),j={};try{j=raw?JSON.parse(raw):{}}catch{}\n  if(r.status===503&&j.error==='MEDIA_STORAGE_NOT_CONFIGURED'){r=await fetch('/api/studio-media',uploadOptions);raw=await r.text();try{j=raw?JSON.parse(raw):{}}catch{j={}}}"
assert old in s
p.write_text(s.replace(old,new,1).replace('if(!r.ok||!j.url)throw Error','if(!r.ok||j.ok===false||!j.url)throw Error',1))
