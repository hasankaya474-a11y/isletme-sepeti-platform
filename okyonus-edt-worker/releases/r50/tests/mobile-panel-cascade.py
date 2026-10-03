from pathlib import Path
import re
s=(Path(__file__).parents[1]/'deniz.mjs').read_text()
start=s.index(' /* R50: anchor open panels')
assert '.mobileTop details{position:static}' in s[start:]
assert '.mobileDrawer,.mobileSearchPanel{position:absolute;left:4px;right:4px;top:100%;' in s[start:]
assert not re.search(r'\.mobileDrawer,\.mobileSearchPanel\{[^}]*position:fixed',s[start:])
assert '.head{position:sticky;top:0;z-index:150' in s
assert 'class="mobileSearchPanel" action="/urunler" method="get"' in s
for url in ['/markalar','/urunler?filter=discount','/urunler?filter=new','/icerik-studyo','/dijital-menu']:
 assert url in s[s.index('<div class="mobileDrawer">'):s.index('</div></details>',s.index('<div class="mobileDrawer">'))]
print('PASS CSS cascade: panels absolute relative to sticky header, search GET q, active module links')
