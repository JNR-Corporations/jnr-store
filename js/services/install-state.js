const KEY='jnr-transfers:v1';let jobs=[];
try{const v=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(v))jobs=v.filter(j=>j&&typeof j.id==='string').slice(0,25);}catch{}
jobs=jobs.map(j=>!j.native&&['connecting','downloading'].includes(j.state)?{...j,state:'interrupted',message:'Start the transfer again from the app page.'}:j);
export const nativeAvailable=()=>typeof window.JNRNative?.postMessage==='function';
export function clearTransfers(){jobs=[];try{localStorage.removeItem(KEY);}catch{}window.dispatchEvent(new Event('jnr:transfer'));}
export const transfers=()=>jobs.map(j=>({...j}));
export function recordTransfer(id,patch){const old=jobs.find(j=>j.id===id)||{id};const job={...old,...patch,time:Date.now()};jobs=[job,...jobs.filter(j=>j.id!==id)].slice(0,25);try{localStorage.setItem(KEY,JSON.stringify(jobs));}catch{}window.dispatchEvent(new CustomEvent('jnr:transfer',{detail:job}));return job;}
export function nativeCommand(action,app){if(!nativeAvailable())return false;window.JNRNative.postMessage(JSON.stringify({action,id:app?.id,url:app?.downloadUrl,name:app?.name,packageName:app?.packageName||'',sha256:app?.sha256||''}));return true;}
window.addEventListener('jnr:native-state',e=>{const j=e.detail;if(j&&typeof j.id==='string'&&['connecting','downloading','verifying','permission_required','install_pending','awaiting_confirmation','installed','failed','cancelled'].includes(j.state))recordTransfer(j.id,{...j,native:true});});
if(nativeAvailable())nativeCommand('state');
