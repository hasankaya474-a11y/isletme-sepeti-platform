from pathlib import Path
import sys

def apply(source):
 old=" const popup=document.getElementById('campaignPopup'),close=document.getElementById('campaignClose');"
 start=source.index(old);end=source.index('\n})();`}',start)
 source=source[:start]+''' const popup=document.getElementById('campaignPopup'),close=document.getElementById('campaignClose'),openCampaign=document.getElementById('campaignOpen');
 if(close&&popup)close.onclick=()=>popup.close();
 if(popup){
  popup.addEventListener('click',e=>{if(e.target===popup)popup.close()});
  const available=popup.dataset.enabled==='true'&&location.pathname==='/';
  if(openCampaign){openCampaign.hidden=!available;openCampaign.onclick=()=>{if(!available||popup.open)return;if(typeof popup.showModal==='function')popup.showModal();else popup.setAttribute('open','')}}
 }
'''+source[end:]
 old='<dialog id="campaignPopup" class="campaignDialog"'
 assert source.count(old)==1
 source=source.replace(old,'<button type="button" class="campaignAccess" id="campaignOpen" hidden style="position:static;margin:8px 12px;padding:8px 12px;border:1px solid #c7dce9;border-radius:8px;background:#fff;color:#07345e;cursor:pointer">Kampanyayı Gör</button>'+old,1)
 old='${campaign.image?`<img src="${esc(campaign.image)}"'
 assert source.count(old)==1
 source=source.replace(old,'${campaign.image?`<img loading="lazy" decoding="async" src="${esc(campaign.image)}"',1)
 return source

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
