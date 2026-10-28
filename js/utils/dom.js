import {safeURL} from './validation.js?v=244a87fd408bff07';
export function el(tag, attrs={}, ...children) {
 const node=document.createElement(tag);
 for(const [k,v] of Object.entries(attrs)) {if(v===null||v===undefined||v===false)continue;if(k==='class')node.className=v;else if(k.startsWith('on')&&typeof v==='function')node.addEventListener(k.slice(2).toLowerCase(),v);else node.setAttribute(k,v===true?'':String(v));}
 for(const c of children.flat(Infinity))if(c!==null&&c!==undefined)node.append(c instanceof Node?c:document.createTextNode(String(c)));
 return node;
}
export const link=(text,href,cls='')=>el('a',{href,class:cls},text);
export function image(src,alt,cls='') {const i=el('img',{src:safeURL(src,true)||'assets/icons/fallback.svg',alt,class:cls,width:96,height:96,loading:'lazy',decoding:'async'});i.addEventListener('error',()=>{if(!i.dataset.failed){i.dataset.failed='1';i.src='assets/icons/fallback.svg';}});return i;}
export function toast(text){const t=document.querySelector('#toast');t.textContent=text;t.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove('show'),3000);}
