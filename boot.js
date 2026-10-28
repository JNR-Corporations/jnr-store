// Online checks bypass HTTP caches; release-specific module URLs avoid stale module graphs.
let current;let refreshing=false;let deferred=false;
function refresh(){if(refreshing)return;if(document.querySelector('#dialog[open]')){deferred=true;return;}refreshing=true;location.reload();}
async function release(){const response=await fetch(new URL('release.json',import.meta.url),{cache:'no-store'});if(!response.ok)throw Error('Release unavailable');return response.json();}
try{current=await release();await import(new URL(current.entry,import.meta.url));}catch(error){console.error(error);const main=document.querySelector('#main');main.textContent='Could not open the store. Reconnect and reload.';}
async function check(){if(document.visibilityState!=='visible'||!navigator.onLine)return;try{const next=await release();if(current&&next.version!==current.version)refresh();}catch{}}
window.addEventListener('online',check);document.addEventListener('visibilitychange',check);setInterval(check,60000);
document.querySelector('#dialog')?.addEventListener('close',()=>{if(deferred)refresh();});
if('serviceWorker'in navigator){
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(navigator.serviceWorker.controller)check();});
 try{const reg=await navigator.serviceWorker.register(new URL('sw.js',import.meta.url),{updateViaCache:'none'});if(reg.waiting)reg.waiting.postMessage('SKIP_WAITING');reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'&&navigator.serviceWorker.controller)worker.postMessage('SKIP_WAITING');});});await reg.update();document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')reg.update().catch(()=>{});});}catch{}
}
