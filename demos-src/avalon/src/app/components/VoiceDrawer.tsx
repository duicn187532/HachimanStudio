'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {Headphones,X} from 'lucide-react';

export default function VoiceDrawer({open,onClose,children}:{open:boolean;onClose:()=>void;children:ReactNode}){
 const panel=useRef<HTMLElement>(null),close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  if(!open)return;
  const previous=document.activeElement as HTMLElement|null,overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';panel.current?.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close.current()}
   if(e.key==='Tab'){
    const items=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],summary')||[]).filter(el=>el.getClientRects().length>0);
    const first=items[0],last=items[items.length-1];
    if(!first){e.preventDefault();return}
    if(e.shiftKey&&(document.activeElement===first||document.activeElement===panel.current)){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&(document.activeElement===last||document.activeElement===panel.current)){e.preventDefault();first.focus()}
   }
  };
  document.addEventListener('keydown',key);
  return()=>{document.body.style.overflow=overflow;document.removeEventListener('keydown',key);previous?.focus()};
 },[open]);
 // Keep media and transcription mounted when the drawer is folded away.
 return <div className="voice-drawer-backdrop" hidden={!open} onClick={onClose}>
  <section id="voice-drawer" className="voice-drawer" role="dialog" aria-modal="true" aria-labelledby="voice-drawer-title" tabIndex={-1} ref={panel} onClick={e=>e.stopPropagation()}>
   <header className="voice-drawer-heading"><div><h2 id="voice-drawer-title"><Headphones size={21}/>語音與逐字稿</h2><p>收起面板後，通話與正在進行的逐字稿會繼續。</p></div><button className="icon-text" aria-label="收起語音面板" onClick={onClose}><X size={22}/></button></header>
   {children}
  </section>
 </div>;
}
