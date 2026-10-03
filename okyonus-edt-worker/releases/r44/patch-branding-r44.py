"""Optional visual polish; no product geometry or business logic changes."""
from pathlib import Path
import sys
CSS='''
/* R44 branding: readable status on mobile; preserve card sizing and grid. */
.product{border-color:#c7dce9;box-shadow:0 2px 8px #07345e0a}
.product:focus-within{border-color:#0879bb;box-shadow:0 0 0 2px #0879bb22}
.product button:focus-visible,.mobileTopIcon:focus-visible,.float a:focus-visible{outline:2px solid #0879bb;outline-offset:2px}
@media(max-width:1024px){
 .ann#siteAnnouncement{display:block;padding:4px 10px;background:#eaf6fd;color:#07345e;border-bottom:1px solid #c7e5f5;font-size:11px;line-height:1.4}
 #siteAnnouncementText{display:none}
 #okyServiceStatus{margin-left:0!important;font-size:11px!important}
}
'''
def apply(source):
 marker='function mobile(opening={openingCampaignEnabled:"false"}){const campaign=openingCampaignSettings(opening);return `<style>'
 assert source.count(marker)==1
 assert '/* R44 branding:' not in source
 return source.replace(marker,marker+CSS,1)
if __name__=='__main__':
 p=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name('deniz.mjs')
 p.write_text(apply(p.read_text()))
