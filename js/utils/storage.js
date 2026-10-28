const key='jnr-store:v1';let memory={bookmarks:[],views:[],downloads:[],searches:[]};
try{const x=JSON.parse(localStorage.getItem(key));if(x&&typeof x==='object')for(const k of Object.keys(memory))if(Array.isArray(x[k]))memory[k]=x[k].filter(v=>typeof v==='string').slice(0,40);}catch{}
export const read=()=>structuredClone(memory);
function save(){try{localStorage.setItem(key,JSON.stringify(memory));}catch{}window.dispatchEvent(new Event('librarychange'));}
export function remember(kind,value){if(!Object.hasOwn(memory,kind)||!value)return;memory[kind]=[value,...memory[kind].filter(x=>x!==value)].slice(0,40);save();}
export function toggleBookmark(id){memory.bookmarks=memory.bookmarks.includes(id)?memory.bookmarks.filter(x=>x!==id):[id,...memory.bookmarks];save();return memory.bookmarks.includes(id);}
export function clearHistory(){memory={bookmarks:[],views:[],downloads:[],searches:[]};save();}
