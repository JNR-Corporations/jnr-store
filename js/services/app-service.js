import {apps as records} from '../data/apps.js?v=7c0f1d9b2ad34129';
import {validateApps} from '../utils/validation.js?v=7c0f1d9b2ad34129';
export const apps=validateApps(records).sort((a,b)=>(a.order??999)-(b.order??999));
export const getApp=id=>apps.find(a=>a.id===id);
export const inCategory=(a,c)=>!c||a.category===c||a.categories.includes(c);
const index=new Map(apps.map(a=>[a.id,[a.name,a.developer,a.description,a.category,...a.tags,...a.categories].join(' ').toLocaleLowerCase()]));
export function searchApps({q='',category='',sort='name',type=''}={}){const words=q.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);return apps.filter(a=>(!type||a.type===type)&&inCategory(a,category)&&words.every(w=>index.get(a.id).includes(w))).sort((a,b)=>sort==='rating'?(b.rating??-1)-(a.rating??-1):sort==='added'?String(b.releaseDate||'').localeCompare(a.releaseDate||''):sort==='updated'?String(b.updatedAt||'').localeCompare(a.updatedAt||''):a.name.localeCompare(b.name));}
export function collectionApps(c){if(c.appIds)return c.appIds.map(getApp).filter(Boolean);let list=apps.filter(a=>c.filter==='app'?a.type==='app':c.filter==='game'?a.type==='game':c.filter==='recommended'?a.editorPick:c.filter==='rated'?a.rating!==null:c.filter==='updated'?!!a.updatedAt:a[c.filter]===true||inCategory(a,c.filter));if(c.filter==='updated')list.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));if(c.filter==='rated')list.sort((a,b)=>b.rating-a.rating);return list.slice(0,8);}
