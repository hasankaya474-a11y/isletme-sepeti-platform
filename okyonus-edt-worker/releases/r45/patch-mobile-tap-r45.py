"""Direct touch hits to the native product anchor; keep normal link long-press."""
import re
from pathlib import Path
import sys

CSS='''
/* R45 product image taps target the native detail link, not its image node. */
.product a.img{touch-action:manipulation;cursor:pointer}
.product a.img img,.product a.img .visualFallback,.product a.img .visualFallback *{pointer-events:none!important;-webkit-user-drag:none;user-select:none;-webkit-user-select:none}
.product a.img:focus-visible{outline:2px solid #0879bb;outline-offset:2px}
'''

def apply(source):
    if 'R45 product image taps target' in source:
        raise ValueError('R45 tap patch already present')
    pattern=r'(<style id="oky-r43-final-mobile">.*?)(</style>)'
    if len(re.findall(pattern,source,re.S))!=3:
        raise ValueError('Expected three final public styles')
    source=re.sub(pattern,lambda m:m.group(1)+CSS.replace('\n',' ')+m.group(2),source,flags=re.S)
    old=r'''img=p.image?'<img loading=\"lazy\" src=\"'+esc(p.image)'''
    new=r'''img=p.image?'<img draggable=\"false\" loading=\"lazy\" src=\"'+esc(p.image)'''
    if source.count(old)!=1:
        raise ValueError('Expected one home product image renderer')
    return source.replace(old,new,1)

if __name__=='__main__':
    p=Path(sys.argv[1]);p.write_text(apply(p.read_text()))
