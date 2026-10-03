import importlib.util,math,re,subprocess,tempfile
from pathlib import Path
root=Path(__file__).parents[1]
spec=importlib.util.spec_from_file_location('quote_css',root/'patch-quote-price-css-r48.py');patch=importlib.util.module_from_spec(spec);spec.loader.exec_module(patch)
original=(root.parent/'r47/deniz.mjs').read_text();source=patch.apply(original)
assert source.replace(patch.CSS.replace('\n',' '),'')==original
assert source.count('R48 accessible quote-price target')==1
button=re.search(r'\.quotePriceButton\{([^}]*)\}',source).group(1)
for declaration in ['width:100%','max-width:100%','min-width:0','min-height:44px','height:auto','box-sizing:border-box','white-space:normal','overflow-wrap:anywhere','touch-action:manipulation']:
 assert declaration in button,declaration
assert '.product .price:has(.quotePriceButton){height:auto!important;min-height:50px!important}' in source
for viewport in [320,390,599,600,768,1024]:
 columns=3 if viewport<600 else 4;gap=5 if columns==3 else 8;wrap=44 if viewport>900 else 14 if viewport>620 else 10
 inner=(viewport-wrap-8-gap*(columns-1))/columns-20
 assert inner>=44
 lines=math.ceil(23*5/inner);required=max(44,lines*12*1.2+8)
 assert required<=50,(viewport,required)
 print('PASS',viewport,'px width budget',round(inner,1),'px and at least44px height')
with tempfile.TemporaryDirectory() as tmp:
 p=Path(tmp,'quote-price.mjs');p.write_text(source);subprocess.run(['node','--check',str(p)],check=True)
print('PASS CSS-only patch preserves all runtime and existing phone/tablet columns')
