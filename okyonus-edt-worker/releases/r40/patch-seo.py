from pathlib import Path
import sys

def apply(s):
    a=s.index('function seoRouteLabel(path)');b=s.index('\nfunction esc(v)',a)
    s=s[:a]+'''function seoRouteLabel(path){return SEO_200_ROUTE_DATA[path]?.label||String(path||"").replace(/^\\//,"").split("-").map(x=>x==="edt"?"EDT":x.charAt(0).toLocaleUpperCase("tr-TR")+x.slice(1)).join(" ")}
    function seoModulesHtml(items){
     const groups=["HORECA & İşletme","Ürün & Kategori","İstanbul & Tedarik","EDT Rehberi"];
     // The reviewed route registry is authoritative: every known link appears once.
     const a=SEO_ROUTES.map((path,i)=>({path,label:seoRouteLabel(path),group_name:groups[Math.floor(i/50)]}));
     return '<section class="section seoGuide seoCompact" aria-label="EDT tedarik rehberi"><div class="sectionhead"><div><h2>EDT Tedarik Rehberi</h2><p>İşletmeniz için ürün ve tedarik rehberlerini inceleyin.</p></div></div><div class="seoModules">'+groups.map((group,i)=>'<details class="seoModule"><summary>'+esc(group)+' <span>50 bağlantı</span></summary><nav aria-label="'+esc(group)+'">'+a.slice(i*50,(i+1)*50).map(x=>'<a href="'+esc(x.path)+'">'+esc(x.label)+'</a>').join('')+'</nav></details>').join('')+'</div></section>'
    }
    ''' +s[b:]
    # Image-only hero retains an accessible primary heading for readers and crawlers.
    s=s.replace("const body='<main class=\"wrap\"><div class=\"commerceLayout\">'", "const body='<main class=\"wrap\"><h1 style=\"position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0\">Okyanus EDT — HORECA Gıda Tedariki</h1><div class=\"commerceLayout\">'", 1)
    # Server-rendered links stay intact even when API SEO records are incomplete.
    begin=s.index("if(Array.isArray(j.seo)&&j.seo.length){const se=")
    end=s.index("}).catch(()=>{const box=document.getElementById('commerce-products')",begin)
    s=s[:begin]+s[end:]
    old='if (commerceResponse) return commerceResponse;'
    new='''if (commerceResponse) {
                if((commerceResponse.headers.get("content-type")||"").includes("text/html")){
                  let content=await commerceResponse.text();
                  const canonical="https://www.okyonusedt.com"+path;
                  const privatePage=/^\\/(?:uye|sepet|hesabim|yonetici|admin)(?:\\/|$)/.test(path);
                  const escapeHead=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
                  const title=(content.match(/<title>([^<]*)<\\/title>/i)||[])[1]||"Okyanus EDT";
                  const description=(content.match(/<meta name="description" content="([^"]*)"/i)||[])[1]||"Okyanus EDT profesyonel ürün kataloğu ve teklif hizmeti.";
                  const metadata='<link rel="canonical" href="'+escapeHead(canonical)+'"><meta name="robots" content="'+(privatePage?'noindex,nofollow':'index,follow,max-image-preview:large')+'"><meta property="og:type" content="website"><meta property="og:locale" content="tr_TR"><meta property="og:site_name" content="Okyanus EDT"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+description+'"><meta property="og:url" content="'+escapeHead(canonical)+'">';
                  content=content.replace('</head>',metadata+(path==='/'?'<script type="application/ld+json">'+JSON.stringify({"@context":"https://schema.org","@type":"WebSite","name":"Okyanus EDT","url":"https://www.okyonusedt.com/","inLanguage":"tr-TR"})+'</script>':'')+'</head>');
                  const headers=new Headers(commerceResponse.headers);headers.delete('content-length');if(privatePage)headers.set('x-robots-tag','noindex, nofollow');
                  return new Response(content,{status:commerceResponse.status,headers});
                }
                return commerceResponse;
              }'''
    assert s.count(old)==1
    s=s.replace(old,new)
    return s

if __name__ == "__main__":
    p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name("deniz.mjs")
    p.write_text(apply(p.read_text()))
