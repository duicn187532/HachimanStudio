'use client';
import {useEffect,useRef,useState} from 'react';
import {Palette,X,Check} from 'lucide-react';
import {COLORS,EMBLEMS,parseAvatar} from '../../lib/profile.mjs';
import PlayerAvatar from './PlayerAvatar';
import {useAccount} from './AccountBox';
const emblemNames=['守護盾','王冠','騎士劍','城堡','飛龍','月亮','星辰','火焰','古樹','寶石','羽毛','太陽'];
const colorNames=['森林綠','酒紅','王室藍','古金','紫羅蘭','岩灰'];
export const PROFILE_KEY='avalon-appearance';
export default function ProfileEditor({onSave}:{onSave?:(avatar:string|null)=>Promise<void>}){
 const [me]=useAccount();
 const [open,setOpen]=useState(false),[avatar,setAvatar]=useState<string|null>(null),[name,setName]=useState(''),[saving,setSaving]=useState(false),[error,setError]=useState('');
 const panel=useRef<HTMLElement>(null),trigger=useRef<HTMLButtonElement>(null);
 const preset=parseAvatar(avatar);
 function show(){
  let saved=null;try{saved=localStorage.getItem(PROFILE_KEY)}catch{}
  setAvatar(me?.user?me.user.avatar:parseAvatar(saved)?saved:null);
  setName(me?.user?.name||localStorage.getItem('avalon-name')||'冒險者');setError('');setOpen(true);
 }
 useEffect(()=>{
  if(!open)return;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';panel.current?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'&&!saving)setOpen(false);
   if(event.key!=='Tab')return;
   const items=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled)')||[]);
   const first=items[0],last=items.at(-1);
   if(!first){event.preventDefault();return}
   if(event.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){event.preventDefault();last?.focus()}
   else if(!event.shiftKey&&(document.activeElement===last||document.activeElement===panel.current)){event.preventDefault();first.focus()}
  };
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);trigger.current?.focus()};
 },[open,saving]);
 async function save(){
  setSaving(true);setError('');
  try{
   if(me?.user){const response=await fetch('/api/me',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,avatar})});const data:any=await response.json();if(!response.ok)throw Error(data.error)}
   else localStorage.setItem('avalon-name',name.trim());
   // A provider photo is kept on the account; only presets are sent as guest appearance.
   const chosen=parseAvatar(avatar)?avatar:null;
   localStorage.setItem(PROFILE_KEY,chosen||'');
   await onSave?.(avatar);
   window.dispatchEvent(new CustomEvent('avalon-profile',{detail:{name:name.trim(),avatar:chosen}}));setOpen(false);
  }catch(e:any){setError(e.message||'儲存失敗，請重試')}finally{setSaving(false)}
 }
 return <><button type="button" className="icon-text profile-trigger" ref={trigger} onClick={show} disabled={!me} aria-label="個人化設定"><Palette size={18}/><span>個人化</span></button>
 {open&&<div className="modal-backdrop profile-backdrop"><section className="modal profile-editor" role="dialog" aria-modal="true" aria-labelledby="profile-title" tabIndex={-1} ref={panel}>
  <button type="button" className="modal-close" aria-label="關閉個人化設定" disabled={saving} onClick={()=>setOpen(false)}><X size={22}/></button>
  <div className="eyebrow small">YOUR HERALDRY</div><h2 id="profile-title">你的圓桌紋章</h2>
  <div className="profile-preview"><PlayerAvatar name={name} avatar={avatar} size={80}/><div><strong>{name||'冒險者'}</strong><p className="fine">{me?.user?'保存至帳號，可跨裝置使用':'保存於這台裝置，下次入座繼續使用'}</p></div></div>
  <label className="profile-label" htmlFor="profile-name">顯示名稱</label><input id="profile-name" value={name} maxLength={16} onChange={e=>setName(e.target.value)} disabled={saving}/>
  <p className="fine">房內暱稱於建立或加入房間時設定。</p>
  <div className="profile-label">選擇徽章</div><div className="emblem-grid">{EMBLEMS.map((emblem:string,i:number)=>{const value='avalon:'+emblem+':'+(preset?.color||'forest');return <button type="button" key={emblem} aria-label={emblemNames[i]} aria-pressed={preset?.emblem===emblem} disabled={saving} onClick={()=>setAvatar(value)}><PlayerAvatar name={name} avatar={value} size={44}/><small>{emblemNames[i]}</small>{preset?.emblem===emblem&&<Check size={12}/>}</button>})}</div>
  <div className="profile-label">紋章配色</div><div className="profile-colors">{Object.keys(COLORS).map((color,i)=><button type="button" key={color} aria-label={colorNames[i]} aria-pressed={preset?.color===color} style={{background:COLORS[color as keyof typeof COLORS]}} disabled={saving} onClick={()=>setAvatar('avalon:'+(preset?.emblem||'shield')+':'+color)}>{preset?.color===color&&<Check size={18}/>}</button>)}</div>
  <button type="button" className="text-btn" disabled={saving} onClick={()=>setAvatar(null)}>使用名字首字</button>
  {error&&<p className="error" role="alert">{error}</p>}<button type="button" className="btn primary full" disabled={saving||!name.trim()} onClick={save}>{saving?'正在儲存…':'儲存個人設定'}</button>
 </section></div>}</>;
}
