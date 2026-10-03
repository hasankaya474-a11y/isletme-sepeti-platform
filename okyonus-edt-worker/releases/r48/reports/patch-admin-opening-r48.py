from pathlib import Path
import sys

def apply(source):
    old="enabled=!['false','0'].includes(String(x.openingCampaignEnabled??'true'));"
    new="enabled=!['false','0','off'].includes(String(x.openingCampaignEnabled??'true').toLowerCase());"
    assert source.count(old)==1,'Opening UI boolean anchor not unique'
    return source.replace(old,new)

if __name__=='__main__':
    path=Path(sys.argv[1]);path.write_text(apply(path.read_text()))
