import {nativeAvailable,nativeCommand,recordTransfer} from './install-state.js?v=7c0f1d9b2ad34129';
import {getApp} from './app-service.js?v=7c0f1d9b2ad34129';
import {resolveDownloadURL,downloadFilename,isHTML} from './download-url.js?v=7c0f1d9b2ad34129';
import {remember} from '../utils/storage.js?v=7c0f1d9b2ad34129';
import {el,image,link,toast} from '../utils/dom.js?v=7c0f1d9b2ad34129';
import {showDialog} from '../components/dialog.js?v=7c0f1d9b2ad34129';
import {icon} from '../components/icons.js?v=7c0f1d9b2ad34129';
const LIMIT=96*1024*1024; // Avoid buffering large APKs on memory-constrained Android devices.
function bytes(n){return n>1048576?(n/1048576).toFixed(1)+' MB':Math.round(n/1024)+' KB';}
export function download(id){
 const app=getApp(id);if(!app)return toast('App not found.');
 const url=resolveDownloadURL(app.downloadUrl);
 if(!url){showDialog('Download not available',el('div',{},el('p',{},app.sample?'This sample app has no real APK attached.':'The publisher has not configured a valid download link.'),el('p',{},'Save it to your library to find it again.')));return;}
 if(nativeAvailable()){showDialog('Download & install',el('div',{class:'native-install-sheet'},image(app.icon,app.name,'detail-icon'),el('h3',{},app.name),el('p',{},'Download this APK, then continue to Android’s installer. Android will ask for permission and final approval.'),el('button',{class:'button',onClick:()=>{nativeCommand('install',{...app,downloadUrl:url});document.querySelector('#dialog').close();location.hash='/downloads';}},'Continue with Android')));return;}
 const controller=new AbortController();let active=false;
 const status=el('p',{class:'download-status','aria-live':'polite'},'Ready when you are');
 const progress=el('progress',{class:'download-progress',max:'100',value:'0','aria-label':'File transfer progress'});
 const ring=el('div',{class:'download-orbit'},el('span',{class:'orbit-dot'}),image(app.icon,'','download-app-icon'),el('span',{class:'orbit-arrow'},icon('download')));
 const details=el('p',{class:'download-note'},'Direct files show actual transfer progress when the host permits it. External pages open at the original address.');
 const source=link('Open original source ↗',url,'button secondary');source.target='_blank';source.rel='noopener noreferrer';
 source.onclick=()=>{recordTransfer(id,{state:'source_opened'});remember('downloads',id);toast('Source link opened. Installation is not tracked.');};
 const begin=el('button',{class:'button download-start',type:'button'},icon('download'),'Start download');
 const cancel=el('button',{class:'text-button',type:'button',hidden:true,onClick:()=>controller.abort()},'Cancel transfer');
 const content=el('div',{class:'download-sheet'},ring,el('h3',{},app.name),el('span',{class:'source-host'},new URL(url).host),status,progress,details,el('div',{class:'download-buttons'},begin,source),cancel);
 const dialog=showDialog('Get the app',content);
 dialog.addEventListener('close',()=>controller.abort(),{once:true});
 function fallback(message,error=false){recordTransfer(id,{state:error?'failed':'action_required',message});status.textContent=message;ring.className='download-orbit '+(error?'failed':'source-ready');progress.hidden=true;begin.hidden=true;cancel.hidden=true;source.className='button';details.textContent='The store does not rewrite publisher URLs. If the source also says “not found”, its file path, release asset or sharing permissions must be fixed by the publisher.';}
 begin.onclick=async()=>{
  if(active)return;recordTransfer(id,{state:'connecting'});active=true;begin.disabled=true;cancel.hidden=false;ring.classList.add('transferring');status.textContent='Connecting to publisher…';progress.removeAttribute('value');
  let timeout=setTimeout(()=>controller.abort('timeout'),20000);
  try{
   const response=await fetch(url,{cache:'no-store',signal:controller.signal,credentials:new URL(url).origin===location.origin?'same-origin':'omit'});
   clearTimeout(timeout);
   if(!response.ok){fallback(response.status===404?'File not found (404). Check the configured file path.':`Publisher returned HTTP ${response.status}.`,true);response.body?.cancel();return;}
   if(isHTML(response)){response.body?.cancel();fallback('This link is a web page, not a direct app file. Open the source to continue.');return;}
   const total=Number(response.headers.get('content-length'))||0;
   if(total>LIMIT||!response.body){response.body?.cancel();fallback('Use the browser download manager for this file.');return;}
   const reader=response.body.getReader(),chunks=[];let loaded=0,lastReport=0;
   while(true){timeout=setTimeout(()=>controller.abort('timeout'),30000);const {done,value}=await reader.read();clearTimeout(timeout);if(done)break;loaded+=value.byteLength;if(loaded>LIMIT){await reader.cancel();fallback('Large file: continue with your browser download manager.');return;}chunks.push(value);if(performance.now()-lastReport>250){lastReport=performance.now();recordTransfer(id,{state:'downloading',progress:total?Math.min(100,loaded/total*100):-1});}if(total){progress.value=Math.min(100,loaded/total*100);status.textContent=`${bytes(loaded)} of ${bytes(total)} · ${Math.min(100,Math.round(loaded/total*100))}%`;}else status.textContent=`Receiving ${bytes(loaded)}…`;}
   const blob=new Blob(chunks,{type:response.headers.get('content-type')||'application/octet-stream'});const objectURL=URL.createObjectURL(blob);const save=link('Save file',objectURL);save.download=downloadFilename(app,url,response.headers.get('content-disposition')||'',response.headers.get('content-type')||'');document.body.append(save);save.click();save.remove();setTimeout(()=>URL.revokeObjectURL(objectURL),60000);
   recordTransfer(id,{state:'received',progress:100});remember('downloads',id);progress.value=100;ring.className='download-orbit ready';status.textContent='File received · Save request sent';details.textContent='Choose a location if your browser asks. Saving to disk and APK installation are managed by Android and cannot be verified here.';begin.hidden=true;cancel.hidden=true;
  }catch(error){if(controller.signal.aborted&&controller.signal.reason!=='timeout'){recordTransfer(id,{state:'cancelled'});status.textContent='Transfer cancelled';ring.className='download-orbit';progress.hidden=true;cancel.hidden=true;begin.hidden=true;}else fallback(controller.signal.reason==='timeout'?'The connection timed out. Try the original source.':'This host blocks in-app transfers or is unreachable. Use the original source.');}
  finally{clearTimeout(timeout);active=false;}
 };
 for(const alt of app.alternateDownloads||[]){const href=resolveDownloadURL(alt.url);if(href){const a=link(alt.label||'Alternate source',href,'alternate');a.target='_blank';a.rel='noopener noreferrer';a.onclick=()=>remember('downloads',id);content.append(a);}}
}
