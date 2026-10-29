import {el,image,link} from '../utils/dom.js?v=7c0f1d9b2ad34129';
import {icon} from './icons.js?v=7c0f1d9b2ad34129';
import {resolveDownloadURL} from '../services/download-url.js?v=7c0f1d9b2ad34129';
export function renderAppCard(a,layout='compact'){
 const meta=a.rating!==null?`${a.rating.toFixed(1)} ★ · ${a.category}`:a.category;
 const copy=el('div',{class:'card-copy'},el('h3',{},a.name),el('p',{},layout==='list'?a.shortDescription:meta),el('small',{},a.sample?'Sample app':a.downloadsLabel||a.developer||''));
 const card=el('article',{class:`app-card ${layout}`});
 const target=link('',`#/app/${encodeURIComponent(a.id)}`,'app-card-link');
 if(layout==='featured')target.append(el('div',{class:'feature-art'},image(a.screenshots[0]||a.icon,`${a.name} preview`,'art-screen'),el('span',{},a.shortDescription)));
 target.append(el('div',{class:'card-main'},image(a.icon,a.name,'app-icon'),copy));
 if(a.badges?.length&&!a.sample)copy.append(el('small',{class:'badge'},a.badges.join(' · ')));
 card.append(target);
 if(resolveDownloadURL(a.downloadUrl))card.append(el('button',{class:'get-button',type:'button','data-download':a.id,'aria-label':`Download ${a.name}`},icon('download'),el('span',{},'Get')));
 return card;
}
export function renderAppGrid(items,layout='compact'){return el('div',{class:layout==='list'?'app-list':'app-grid'},items.map(a=>renderAppCard(a,layout)));}
export function renderHorizontalCarousel(items,layout='compact'){return el('div',{class:`carousel ${layout}-carousel`,tabindex:'0','aria-label':'Scrollable app collection'},items.map(a=>renderAppCard(a,layout)));}
export function renderSimilarApps(a,items){return renderHorizontalCarousel(items.filter(x=>x.id!==a.id&&x.category===a.category).slice(0,6));}
