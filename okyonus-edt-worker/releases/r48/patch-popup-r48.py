from pathlib import Path
import sys

def apply(source):
 a=source.index(" const popup=document.getElementById('campaignPopup')");b=source.index('\n})();`}',a)
 source=source[:a]+''' const popup=document.getElementById('campaignPopup'),close=document.getElementById('campaignClose'),openCampaign=document.getElementById('campaignOpen');
 if(popup){
  const available=popup.dataset.enabled==='true'&&location.pathname==='/',key='oky-campaign-seen:r48:'+popup.dataset.campaignKey;
  const memory=window.__okyCampaignSeen||(window.__okyCampaignSeen=Object.create(null));
  const seen=()=>{if(memory[key])return true;try{return sessionStorage.getItem(key)==='1'}catch{return false}};
  const remember=()=>{memory[key]=true;try{sessionStorage.setItem(key,'1')}catch{}};
  const open=()=>{if(!available||popup.open)return;try{if(typeof popup.showModal==='function')popup.showModal();else popup.setAttribute('open','');remember()}catch{}};
  const dismiss=()=>{remember();if(popup.open)popup.close();else popup.removeAttribute('open')};
  if(close)close.onclick=dismiss;
  popup.addEventListener('click',e=>{if(e.target===popup)dismiss()});
  popup.addEventListener('cancel',e=>{e.preventDefault();dismiss()});
  popup.addEventListener('close',remember);
  if(openCampaign){openCampaign.hidden=!available;openCampaign.onclick=open}
  const initial=()=>{if(available&&!seen())open()};
  const schedule=()=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(initial);else setTimeout(initial,0)};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 }
'''+source[b:]
 return source

if __name__=='__main__':
 p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
