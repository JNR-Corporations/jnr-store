"""Run before deployment: python3 tools/release.py. No packages needed."""
from pathlib import Path
import hashlib,re,json
root=Path(__file__).resolve().parent.parent
sources={}
for f in sorted((root/'js').rglob('*.js')):
 text=re.sub(r"(from\s+['\"]\.[^'\"?]+)\?v=[^'\"]+",r'\1',f.read_text());sources[f]=text
fingerprint=hashlib.sha256()
for f,text in sources.items():fingerprint.update(str(f.relative_to(root)).encode()+text.encode())
for folder in ['css','assets']:
 for f in sorted((root/folder).rglob('*')):
  if f.is_file():fingerprint.update(f.read_bytes())
fingerprint.update((root/'boot.js').read_bytes())
fingerprint.update((root/'tools/sw-template.txt').read_bytes())
for name in ['manifest.webmanifest','offline.html','404.html']:
 fingerprint.update((root/name).read_bytes())
fingerprint.update(re.sub(r'\?v=[^\"\s]+','',(root/'index.html').read_text()).encode())
version=fingerprint.hexdigest()[:16]
for f,text in sources.items():f.write_text(re.sub(r"(from\s+['\"])(\.[^'\"]+)(['\"])",lambda m:m[1]+m[2]+'?v='+version+m[3],text))
f=root/'index.html';text=re.sub(r'((?:css/[^"?]+|boot.js))\?v=[^"\s]+',lambda m:m[1]+'?v='+version,f.read_text());f.write_text(text)
(root/'release.json').write_text(json.dumps({'version':version,'entry':'js/app.js?v='+version},indent=2)+'\n')
shell=['./']+[str(f.relative_to(root))for f in sorted(root.rglob('*'))if f.is_file()and f.suffix in ['.js','.css','.svg','.png','.html','.webmanifest']and not any(s in f.relative_to(root).parts for s in ['tests','tools'])and not f.name.startswith('qa-')and f.name!='sw.js']+['release.json']
template=(root/'tools/sw-template.txt').read_text().replace('__VERSION__',version).replace('__SHELL__',json.dumps(shell));(root/'sw.js').write_text(template)
print('Release:',version)
