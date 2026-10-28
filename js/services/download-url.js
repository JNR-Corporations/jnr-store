// Relative downloads resolve against the installed store directory, never the hash route.
export function resolveDownloadURL(value, base = new URL('../../', import.meta.url).href) {
 if(typeof value!=='string'||!value.trim())return null;
 const raw=value.trim();
 if(raw.startsWith('#')||raw.startsWith('//')||/[\\\x00-\x1f]/.test(raw))return null;
 if(/^[a-z][a-z0-9+.-]*:/i.test(raw)&&!/^https?:/i.test(raw))return null;
 try {const root=new URL(base);const url=new URL(raw,root);
 if(url.username||url.password||url.hash)return null;
 if(url.protocol!=='https:'&&!(url.protocol==='http:'&&url.origin===root.origin))return null;
 return url.href;}catch{return null;}
}
export function downloadFilename(app,url,disposition='',contentType=''){
 const encoded=disposition.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)?.[1];
 const quoted=disposition.match(/filename\s*=\s*"([^"]+)"/i)?.[1]||disposition.match(/filename\s*=\s*([^;]+)/i)?.[1];
 let name=app.downloadFileName||encoded||quoted||new URL(url).pathname.split('/').pop()||app.id+'.apk';
 try{name=decodeURIComponent(name);}catch{}
 name=name.replace(/[\/\\:*?"<>|\x00-\x1f]/g,'_').trim().slice(0,150);
 if(!/\.[a-z0-9]{2,8}$/i.test(name)&&/android.package-archive/i.test(contentType))name+='.apk';
 return name||'download.apk';
}
export function isHTML(response){return /(?:text\/html|application\/xhtml)/i.test(response.headers.get('content-type')||'');}
