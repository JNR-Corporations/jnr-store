import {el,image,link} from '../utils/dom.js?v=244a87fd408bff07';
import {apps,collectionApps} from '../services/app-service.js?v=244a87fd408bff07';
import {collections} from '../data/collections.js?v=244a87fd408bff07';
import {categories} from '../data/categories.js?v=244a87fd408bff07';
import {config} from '../config.js?v=244a87fd408bff07';
import {renderHorizontalCarousel} from '../components/app-card.js?v=244a87fd408bff07';
import {icon} from '../components/icons.js?v=244a87fd408bff07';
export function sectionHeading(title,subtitle,href){return el('div',{class:'section-heading'},el('div',{},el('h2',{},title),subtitle?el('p',{},subtitle):null),href?link('Explore all →',href,'text-link'):null);}
export function renderFeaturedBanner(a){const b=a.banner||{};const bannerImage=image(b.image||'assets/banners/bloom.svg',b.alt||`${a.name} featured illustration`,'hero-art');bannerImage.loading='eager';bannerImage.setAttribute('fetchpriority','high');return el('section',{class:'hero',style:`--hero-accent:${/^#[0-9a-f]{3,8}$/i.test(b.accent)?b.accent:'#dfebe1'}`},bannerImage,el('div',{class:'hero-copy'},el('span',{class:'eyebrow'},'THE EVERYDAY, UPGRADED'),el('h1',{},b.title||a.name),el('p',{},b.subtitle||a.shortDescription),el('div',{class:'hero-app'},image(a.icon,'','mini-icon'),el('div',{},el('strong',{},a.name),el('small',{},a.category+(a.sample?' · Sample app':'')))),link('Discover the app  →','#/app/'+a.id,'button')));}
export function renderCategorySections(){return el('section',{class:'section'},sectionHeading('Find your kind of app','A world of possibilities, neatly organized.','#/categories'),el('div',{class:'category-grid'},categories.map(c=>{const l=link('','#/category/'+encodeURIComponent(c.name),'category-card');l.append(el('span',{class:'category-icon'},icon(c.icon)),el('strong',{},c.name),el('small',{},c.description),el('span',{class:'category-arrow'},'↗'));return l;})));}
export function renderHome(){
 const root=el('div',{class:'home-page'},el('div',{class:'welcome'},el('div',{},el('p',{class:'eyebrow'},'A LITTLE SOMETHING NEW'),el('h2',{},'Find your next favorite.')),link('Your library ↗','#/library','text-link')));
 const search=link('','#/search','mobile-search');search.append(icon('search'),el('span',{},'Apps, games & everyday possibilities'),el('span',{},'→'));root.append(search);
 root.append(el('div',{class:'discovery-tabs'},link('For you','#/home','discovery-tab selected'),link('Apps','#/apps','discovery-tab'),link('Games','#/games','discovery-tab'),link('Categories','#/categories','discovery-tab')));
 const featured=apps.find(a=>a.featured);if(featured)root.append(renderFeaturedBanner(featured));
 root.append(el('div',{class:'quick-categories'},categories.slice(0,6).map(c=>{const l=link('','#/category/'+encodeURIComponent(c.name),'quick-category');l.append(icon(c.icon),c.name);return l;})));
 const primary=['editors','trending','new','games','updated'];const extra=el('details',{class:'more-collections'},el('summary',{},'More collections',el('span',{},'Explore your everyday →')));
 for(const c of collections){const items=collectionApps(c);const section=el('section',{class:'section'},sectionHeading(c.title,c.subtitle,'#/collection/'+c.id),items.length?renderHorizontalCarousel(items,c.layout):el('div',{class:'quiet-empty'},'No publisher ratings supplied yet.'));if(primary.includes(c.id))root.append(section);else extra.append(section);}
 root.append(extra,renderCategorySections());return root;
}
