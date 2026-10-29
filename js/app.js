import {renderDownloads} from './pages/downloads.js?v=7c0f1d9b2ad34129';
import {config} from './config.js?v=7c0f1d9b2ad34129';
import {el,link,toast} from './utils/dom.js?v=7c0f1d9b2ad34129';
import {safeURL} from './utils/validation.js?v=7c0f1d9b2ad34129';
import {startRouter,route} from './router.js?v=7c0f1d9b2ad34129';
import {renderHeader,renderNavigation} from './components/header.js?v=7c0f1d9b2ad34129';
import {renderHome,renderCategorySections,sectionHeading} from './pages/home.js?v=7c0f1d9b2ad34129';
import {renderSearch} from './components/search.js?v=7c0f1d9b2ad34129';
import {renderLibrary} from './pages/library.js?v=7c0f1d9b2ad34129';
import {renderAppDetails} from './pages/app-details.js?v=7c0f1d9b2ad34129';
import {renderAppGrid} from './components/app-card.js?v=7c0f1d9b2ad34129';
import {collections} from './data/collections.js?v=7c0f1d9b2ad34129';
import {collectionApps,getApp} from './services/app-service.js?v=7c0f1d9b2ad34129';
import {toggleBookmark,read} from './utils/storage.js?v=7c0f1d9b2ad34129';
import {download} from './services/download-service.js?v=7c0f1d9b2ad34129';
document.documentElement.style.setProperty('--accent',config.accent);
function render(){try{const {parts,params}=route();const [page,id]=parts;const active=['home','games','apps','search','library'].includes(page)?page:['app','category','categories','collection'].includes(page)?'apps':'home';document.querySelector('#header').replaceChildren(renderHeader(active));document.querySelector('#navigation').replaceChildren(renderNavigation(active));let content;
 const opts={q:params.get('q')||'',category:params.get('category')||config.defaultCategory,sort:params.get('sort')||'name'};
 if(page==='home')content=renderHome();else if(page==='apps'||page==='games'||page==='search')content=renderSearch({...opts,type:page==='games'?'game':page==='apps'?'app':'',title:page==='games'?'Make a little time for play.':page==='apps'?'Apps for a better everyday.':'Find your next favorite.'});else if(page==='downloads')content=renderDownloads();else if(page==='library')content=renderLibrary();else if(page==='app')content=renderAppDetails(id);else if(page==='categories')content=renderCategorySections();else if(page==='category')content=renderSearch({...opts,category:id,title:id||'Categories'});else if(page==='collection'){const c=collections.find(c=>c.id===id);content=c?el('div',{},sectionHeading(c.title,c.subtitle),collectionApps(c).length?renderAppGrid(collectionApps(c),c.layout):el('div',{class:'empty'},'No apps in this collection yet.')):el('h1',{},'Collection not found');}else content=el('div',{class:'empty'},el('h1',{},'Page not found'),link('Return home','#/home','button'));
 document.querySelector('#main').replaceChildren(content);document.title=(page==='app'?getApp(id)?.name||'App not found':config.navigationLabels[page]||id||'Discover')+' · '+config.storeName;const footer=el('div',{class:'footer-inner'},el('div',{},el('strong',{},config.storeName),el('p',{},config.footer)),el('p',{},'Independent catalog · Sample content',el('br'),'No account. Just discovery.'));if(config.supportEmail)footer.append(link('Contact support','mailto:'+config.supportEmail));for(const s of config.socialLinks){const u=safeURL(s.url);if(u)footer.append(el('a',{href:u,target:'_blank',rel:'noopener noreferrer'},s.label));}document.querySelector('#footer').replaceChildren(footer);
 }catch(e){console.error(e);document.querySelector('#main').replaceChildren(el('div',{class:'empty'},el('h1',{},'Something needs a refresh'),el('p',{},'The catalog could not be displayed. Please try reloading.'),el('button',{class:'button',onClick:()=>location.reload()},'Reload catalog')));}}
 document.addEventListener('click',e=>{if(e.target.closest('.skip')){e.preventDefault();document.querySelector('#main').focus();document.querySelector('#main').scrollIntoView();return;}const d=e.target.closest('[data-download]');if(d){e.preventDefault();download(d.dataset.download);return;}const b=e.target.closest('[data-save]');if(b){const saved=toggleBookmark(b.dataset.save);b.setAttribute('aria-pressed',String(saved));b.lastChild.textContent=saved?'Saved':'Save';toast(saved?'Saved to your library':'Removed from saved apps');}});
 function connection(){const node=document.querySelector('#connection');node.hidden=navigator.onLine;node.textContent='You’re offline. Cached catalog content is available; external downloads need a connection.';}window.addEventListener('online',connection);window.addEventListener('offline',connection);connection();startRouter(render);

