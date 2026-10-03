"""Bound catalogue DOM/image work while preserving all filtered products."""
def apply(s):
 start=s.index('function commerceCatalogPage()');end=s.index('function commerceProductPage',start)
 part=s[start:end]
 old="catalogGrid.innerHTML=list.map(card).join('')||"
 assert part.count(old)==1
 part=part.replace('let all=[];function visual','let all=[],shown=48,lastList=[],filterTimer;const more=document.createElement(\'button\');more.type=\'button\';more.className=\'btn\';more.textContent=\'Daha Fazla Ürün Göster\';more.hidden=true;catalogGrid.after(more);more.onclick=()=>{shown+=48;paint()};function visual',1)
 part=part.replace("function render(){const q=", "function paint(){catalogGrid.insertAdjacentHTML('beforeend',lastList.slice(Math.max(0,shown-48),shown).map(card).join(''));more.hidden=shown>=lastList.length;document.dispatchEvent(new Event('oky-products-rendered'))}function render(){shown=48;const q=",1)
 part=part.replace(old,"lastList=list;more.hidden=shown>=list.length;catalogGrid.innerHTML=list.slice(0,shown).map(card).join('')||",1)
 part=part.replace('catalogTools.onsubmit=e=>{e.preventDefault();render()}', 'catalogTools.onsubmit=e=>{e.preventDefault();clearTimeout(filterTimer);render()}',1)
 part=part.replace('cq.oninput=render;cc.onchange=render;',"cq.oninput=()=>{clearTimeout(filterTimer);filterTimer=setTimeout(render,120)};cc.onchange=()=>{clearTimeout(filterTimer);render()};",1)
 part=part.replace('<img src=', '<img loading=\\"lazy\\" decoding=\\"async\\" draggable=\\"false\\" src=')
 s=s[:start]+part+s[end:]
 return s
