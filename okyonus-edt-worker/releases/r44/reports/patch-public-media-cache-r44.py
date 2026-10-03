from pathlib import Path
import sys

def apply(source):
 if '// R44 cache only successfully served public raster UUID assets.' in source:return source
 old=" if(admin||request.headers.has('authorization')||request.headers.has('cookie')||headers.has('set-cookie')||/^\\/(?:api\\/(?:member|auth|admin)|uye|hesabim|yonetici)(?:\\/|$)/.test(path)){"
 new=r""" // R44 cache only successfully served public raster UUID assets.
 const publicRaster=request.method==='GET'||request.method==='HEAD';
 const publicMedia=publicRaster&&response.status===200&&!headers.has('set-cookie')&&/^\/studio-media\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(?:png|jpg|webp)$/i.test(path)&&/^image\/(?:png|jpeg|webp)(?:;|$)/i.test(headers.get('content-type')||'');
 if(publicMedia)headers.set('cache-control','public, max-age=3600');
 if(!publicMedia&&(admin||request.headers.has('authorization')||request.headers.has('cookie')||headers.has('set-cookie')||/^\/(?:api\/(?:member|auth|admin)|uye|hesabim|yonetici)(?:\/|$)/.test(path))){"""
 assert source.count(old)==1,'wrapper cache anchor';source=source.replace(old,new)
 return source
if __name__=='__main__':
 for arg in sys.argv[1:]:
  p=Path(arg);p.write_text(apply(p.read_text()))
