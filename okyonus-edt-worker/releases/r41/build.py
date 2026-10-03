"""Rebuild full independent R41 Workers from preserved, Unicode-safe R39."""
from pathlib import Path
import importlib.util
import hashlib
import json
import sys
sys.dont_write_bytecode = True

root = Path(__file__).resolve().parent

def module(name, path):
    spec = importlib.util.spec_from_file_location(name, path)
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

def ascii_js(source):
    def escape(c):
        n = ord(c)
        if n < 128:
            return c
        if n <= 65535:
            return f"\\u{n:04x}"
        n -= 65536
        return f"\\u{0xd800+(n>>10):04x}\\u{0xdc00+(n&1023):04x}"
    return ''.join(escape(c) for c in source)

deniz = (root.parent / 'r39/deniz.mjs').read_text()
zaman = (root.parent / 'r39/zaman.mjs').read_text()
for name in ['seo', 'mobile', 'flows', 'branding']:
    deniz = module(name, root / f'patch-{name}.py').apply(deniz)
deniz = module('admin', root / 'reports/patch-admin.py').apply(deniz)
security = module('security', root / 'patch-security.py')
deniz = security.apply(deniz)
zaman = security.apply(zaman, admin=True)
deniz = deniz.replace('commerce-v2-2026-10-02-admin-sync-r36-resource-fix', 'commerce-v2-2026-10-03-r41-live-audit-fix')
checksums = {'base_commit': 'b6905b3a98121bcc267e28dbcce6eacc48b3a954', 'files': {}}
for name, source in [('deniz', deniz), ('zaman', zaman)]:
    source = ascii_js(source)
    filenames = [f'{name}.mjs', f'{name.upper()}_R41_TAM_KOD.txt']
    if name == 'deniz':
        filenames.append('DENIZ_R41_CANLI_KONTROL_TAM_KOD.txt')
    for filename in filenames:
        (root / filename).write_text(source, encoding='ascii')
        checksums['files'][filename] = {'bytes': len(source), 'sha256': hashlib.sha256(source.encode()).hexdigest()}
    base = root.parent / f'r39/{name}.mjs'
    checksums['files'][f'../r39/{name}.mjs'] = {'bytes': base.stat().st_size, 'sha256': hashlib.sha256(base.read_bytes()).hexdigest()}
(root / 'checksums.json').write_text(json.dumps(checksums, indent=2)+'\n')
print('Built independent ASCII-safe DENIZ/ZAMAN R41 Workers and identical TXT exports.')
