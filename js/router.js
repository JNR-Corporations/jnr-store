export function route(){const [path,query='']=location.hash.slice(1).split('?');return {parts:(path||'/home').split('/').filter(Boolean).map(x=>{try{return decodeURIComponent(x);}catch{return '';}}),params:new URLSearchParams(query)};}
export function navigate(path){location.hash=path;}
export function startRouter(render){window.addEventListener('hashchange',()=>{render();window.scrollTo({top:0,behavior:'instant'});});render();}
