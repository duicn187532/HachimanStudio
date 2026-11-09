'use client';
import {useEffect,useRef,useState} from 'react';
import {BookOpen,Settings,X} from 'lucide-react';
import Music from './Music';
import ProfileEditor from './ProfileEditor';
export default function HeaderSettings({onGuide,onAppearance}:{onGuide?:()=>void;onAppearance?:(avatar:string|null)=>Promise<void>}){
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null),button=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  const outside=(event:PointerEvent)=>{if(!root.current?.contains(event.target as Node))setOpen(false)};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&!root.current?.querySelector('[role="dialog"]')){setOpen(false);button.current?.focus()}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape)};
 },[open]);
 return <div className="header-settings" ref={root}>
  <button type="button" className="icon-text settings-trigger" ref={button} aria-label="設定選單" aria-expanded={open} aria-controls="header-settings-panel" onClick={()=>setOpen(v=>!v)}><Settings size={18}/><span>設定</span></button>
  <div id="header-settings-panel" className="settings-popover" hidden={!open}>
   <div className="settings-heading"><strong>圓桌設定</strong><button type="button" aria-label="關閉設定選單" onClick={()=>{setOpen(false);button.current?.focus()}}><X size={17}/></button></div>
   <ProfileEditor onSave={onAppearance}/>
   <div className="settings-music"><span>背景配樂</span><Music/></div>
   {onGuide&&<button type="button" className="icon-text" onClick={()=>{setOpen(false);onGuide()}}><BookOpen size={17}/>遊戲指南</button>}
  </div>
 </div>;
}
