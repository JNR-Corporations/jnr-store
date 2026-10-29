import {clearTransfers} from '../services/install-state.js?v=7c0f1d9b2ad34129';
import {el,link} from '../utils/dom.js?v=7c0f1d9b2ad34129';
import {read,clearHistory} from '../utils/storage.js?v=7c0f1d9b2ad34129';
import {getApp} from '../services/app-service.js?v=7c0f1d9b2ad34129';
import {renderHorizontalCarousel} from '../components/app-card.js?v=7c0f1d9b2ad34129';
import {sectionHeading} from './home.js?v=7c0f1d9b2ad34129';
import {showDialog} from '../components/dialog.js?v=7c0f1d9b2ad34129';
export function renderLibrary(){const data=read();const root=el('div',{},el('p',{class:'eyebrow'},'A SPACE THAT’S YOURS'),el('h1',{class:'page-title'},'Your little collection'),el('p',{class:'lead'},'Keep your favorites close. No account needed.'),el('div',{class:'library-note'},'Stored on this device. Download history records links opened, not completed downloads.'));
 root.append(link('Manage downloads & installs →','#/downloads','manage-link'));
 for(const [key,title]of [['bookmarks','Saved for later'],['views','Recently explored'],['downloads','Download links opened']]){const items=data[key].map(getApp).filter(Boolean);root.append(el('section',{class:'section'},sectionHeading(title),items.length?renderHorizontalCarousel(items):el('div',{class:'quiet-empty'},key==='bookmarks'?'Your next favorite belongs here. Tap Save on any app.':'Nothing here yet. Your discoveries will appear here.')));}
 root.append(el('section',{class:'section'},sectionHeading('Recent searches'),el('div',{class:'filter-row'},data.searches.length?data.searches.map(t=>link(t,'#/search?q='+encodeURIComponent(t),'chip')):el('p',{class:'muted'},'Your searches will appear here.'))));
 root.append(el('button',{class:'button secondary',onClick:()=>showDialog('Clear your local library?',el('div',{},el('p',{},'This removes saved apps, viewed apps, opened download links and recent searches from this device.'),el('button',{class:'button',onClick:()=>{clearHistory();clearTransfers();document.querySelector('#dialog').close();document.querySelector('#main').replaceChildren(renderLibrary());}},'Clear local data')))},'Clear local data'));return root;}
