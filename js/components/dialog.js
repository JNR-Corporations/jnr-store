import {el,link} from '../utils/dom.js?v=7c0f1d9b2ad34129';
import {icon} from './icons.js?v=7c0f1d9b2ad34129';
export function showDialog(title,content){const d=document.querySelector('#dialog');d.replaceChildren(el('button',{class:'round-button dialog-close','aria-label':'Close dialog',onClick:()=>d.close()},icon('close')),el('h2',{},title),content);if(!d.open)d.showModal();d.onclick=e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}};return d;}
