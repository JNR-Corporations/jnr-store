import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {apps,searchApps,collectionApps,getApp} from '../js/services/app-service.js';
import {collections} from '../js/data/collections.js';
import {categories} from '../js/data/categories.js';
import {validateApps,safeURL} from '../js/utils/validation.js';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
globalThis.location={href:'https://store.test/sub/',origin:'https://store.test'};
assert.equal(apps.length,18);
assert.equal(new Set(apps.map(a=>a.id)).size,18);
assert.equal(searchApps({q:'pDf'})[0].id,'jnr-pdfs');
assert.equal(searchApps({q:'developer tools'}).length,2);
assert.equal(searchApps({q:'JNR Demo Studio'}).length,18);
assert.equal(searchApps({q:'leaf'}).length,3);
assert.equal(searchApps({q:'no-such-app-xyz'}).length,0);
assert.equal(searchApps({category:'Photography'}).length,2);
assert.equal(searchApps({type:'game'}).length,4);
assert.equal(searchApps({category:'Empty category'}).length,0);
assert.equal(getApp('missing'),undefined);
assert.equal(searchApps({sort:'updated'})[0].id,'jnr-pdfs');
assert.equal(searchApps({sort:'added'})[0].id,'jnr-pdfs');
assert.equal(searchApps({sort:'name'})[0].name,'Aura Walls');
assert.equal(collectionApps(collections.find(c=>c.id==='rated')).length,0);
assert.equal(collectionApps(collections.find(c=>c.id==='editors')).length,6);
assert.equal(collectionApps({appIds:['bloom-focus','missing','jnr-pdfs']})[1].id,'jnr-pdfs');
for(const c of categories)assert(searchApps({category:c.name}).every(a=>a.categories.includes(c.name)));
for(const url of ['javascript:alert(1)','data:text/plain,no','http://insecure.test/a','//insecure.test/a','not a url','relative.apk','']){
 // Protocol-relative HTTPS destinations are valid only as explicit HTTPS inputs.

 assert.equal(safeURL(url),null,url);
}
assert.equal(safeURL('https://publisher.test/a.apk'),'https://publisher.test/a.apk');
assert.equal(safeURL('assets/icons/logo.svg',true),'https://store.test/sub/assets/icons/logo.svg');
assert.equal(safeURL('http://external.test/a',true),null);
const basic={id:'minimal',name:'Minimal',category:'Utilities',type:'app'};
const warn=console.warn;console.warn=()=>{};
assert.equal(validateApps([basic,basic,{id:'bad'}]).length,1);
console.warn=warn;
assert.deepEqual(validateApps([basic])[0].screenshots,[]);
assert.equal(validateApps([{...basic,rating:99}])[0].rating,null);
for(const a of apps)for(const asset of [a.icon,...a.screenshots,a.banner?.image].filter(Boolean))assert(fs.existsSync(path.join(root,asset)),asset);
for(const file of fs.readdirSync(path.join(root,'js'),{recursive:true}).filter(f=>f.endsWith('.js'))){const full=path.join(root,'js',file);const source=fs.readFileSync(full,'utf8');for(const m of source.matchAll(/from\s+['"](\.[^'"]+)['"]/g))assert(fs.existsSync(path.resolve(path.dirname(full),m[1].split('?')[0])),m[1]);assert(!source.includes('innerHTML'),file);}
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');const shell=JSON.parse(sw.match(/const SHELL=(\[[\s\S]*?\]);/)[1]);for(const file of shell)assert(fs.existsSync(path.resolve(root,file)),file);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));for(const i of manifest.icons)assert(fs.existsSync(path.join(root,i.src)));
// Storage works both with persistent storage and blocked storage.
let store=new Map();globalThis.window={dispatchEvent(){}};globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
const saved=await import('../js/utils/storage.js?persistent');saved.toggleBookmark('jnr-pdfs');saved.remember('searches','PDF');saved.remember('searches','PDF');assert.equal(saved.read().searches.length,1);assert(saved.read().bookmarks.includes('jnr-pdfs'));
const loaded=await import('../js/utils/storage.js?reload');assert(loaded.read().bookmarks.includes('jnr-pdfs'));
globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};const blocked=await import('../js/utils/storage.js?blocked');blocked.toggleBookmark('minimal');assert(blocked.read().bookmarks.includes('minimal'));blocked.clearHistory();assert.equal(blocked.read().bookmarks.length,0);
console.log('PASS: catalog, search, sorting, categories, collections, validation, URL handling, assets, imports, SW allowlist, manifest, persistence and blocked-storage fallback.');
