import {el,image,link} from '../utils/dom.js';
import {icon} from './icons.js';
export function renderAppCard(a,layout='compact'){
 const meta=a.rating!==null?`${a.rating.toFixed(1)} ★ · ${a.category}`:a.category;
 const body=el('div',{class:'card-copy'},el('h3',{},a.name),el('p',{},layout==='list'?a.shortDescription:meta),el('small',{},a.sample?'Sample app':a.downloadsLabel||a.developer||''));
 const card=layout==='list'?el('div',{class:'app-card list'}):link('',`#/app/${encodeURIComponent(a.id)}`,`app-card ${layout}`);
 if(layout==='featured'){card.append(el('div',{class:'feature-art',style:`--art-color:${a.color||'#edf1e7'}`},image(a.screenshots[0]||a.icon,`${a.name} sample preview`,'art-screen'),el('span',{},a.shortDescription)));}
 const main=layout==='list'?link('',`#/app/${encodeURIComponent(a.id)}`,'card-main'):el('div',{class:'card-main'});main.append(image(a.icon,a.name,'app-icon'),body);card.append(main);
 if(a.badges?.length&&!a.sample)body.append(el('small',{class:'badge'},a.badges.join(' · ')));
 if(layout==='list')card.append(el('button',{class:'round-button',type:'button','data-download':a.id,'aria-label':`Download ${a.name}`},icon('download')));
 return card;
}
export function renderAppGrid(items,layout='compact'){return el('div',{class:layout==='list'?'app-list':'app-grid'},items.map(a=>renderAppCard(a,layout)));}
export function renderHorizontalCarousel(items,layout='compact'){return el('div',{class:`carousel ${layout}-carousel`,tabindex:'0','aria-label':'Scrollable app collection'},items.map(a=>renderAppCard(a,layout)));}
export function renderSimilarApps(a,items){return renderHorizontalCarousel(items.filter(x=>x.id!==a.id&&x.category===a.category).slice(0,6));}
