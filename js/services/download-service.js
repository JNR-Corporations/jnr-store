import {getApp} from './app-service.js';
import {safeURL} from '../utils/validation.js';
import {remember} from '../utils/storage.js';
import {el,link,toast} from '../utils/dom.js';
import {showDialog} from '../components/dialog.js';
export function download(id){const a=getApp(id);if(!a)return toast('App not found.');const url=safeURL(a.downloadUrl);if(!url){showDialog('Download unavailable',el('div',{},el('p',{},a.sample?'This is a sample app. No real download is provided.':'The publisher has not provided a valid HTTPS download link.'),el('p',{},'You can save this app to your library and check back later.')));return;}
 const action=link('Continue to download ↗',url,'button');action.target='_blank';action.rel='noopener noreferrer';action.addEventListener('click',()=>{remember('downloads',id);document.querySelector('#dialog').close();toast('Download link opened. Completion is not tracked.');});const body=el('div',{},el('p',{},`You are leaving the store for ${new URL(url).hostname}.`),el('p',{class:'muted'},'A link click does not confirm a completed download or installation. Review the publisher and permissions before installing.'),action);
 for(const alt of a.alternateDownloads||[]){const href=safeURL(alt.url);if(href){const l=link(alt.label||'Alternate download',href,'alternate');l.target='_blank';l.rel='noopener noreferrer';l.onclick=()=>remember('downloads',id);body.append(l);}}
 showDialog(`Get ${a.name}`,body);
}
