'use client';
import {Bot,Crown,FlaskConical,Minus,Plus,FastForward,StepForward} from 'lucide-react';
import {ROLES} from '../../lib/game.mjs';

const roleNames:Record<string,string>=ROLES;
type Seat={id:string;name:string;token:string;bot:boolean;role?:string;alignment?:string};
type Props={room:any;busy:boolean;onSwitch:(seat:Seat)=>void;onAct:(type:string,extra?:any)=>void};

/**
 * Single-player test room (UAT): one tester holds every seat. Switch the point of view
 * to act as any seat, or let the bots take every other seat's turn.
 */
export default function SoloPanel({room,busy,onSwitch,onAct}:Props){
 const seats:Seat[]=room.seats||[];const me=room.me.id;const lobby=room.phase==='lobby',ended=room.phase==='ended';
 const isHost=me===room.host;const current=seats.find(s=>s.id===me);
 return <section className="panel solo-panel" aria-label="單人測試面板">
  <div className="section-heading">
   <h2><FlaskConical size={19}/>單人測試房</h2>
   <span className="badge">不計入戰績</span>
  </div>
  <p className="fine">目前視角：<strong>{current?.name}</strong>{current?.role?`（${roleNames[current.role]}）`:''}。點選座位即可切換視角，以那個人的身分操作。</p>
  <div className="solo-seats">
   {seats.map(s=><button key={s.id} className={'solo-seat '+(s.id===me?'current ':'')+(s.alignment==='evil'?'evil':s.alignment==='good'?'good':'')} disabled={busy||s.id===me} onClick={()=>onSwitch(s)} aria-pressed={s.id===me}>
    {s.id===room.host?<Crown size={13} className="gold"/>:s.bot?<Bot size={13}/>:null}
    <span>{s.name}</span>
    {s.role&&<em>{roleNames[s.role]}</em>}
   </button>)}
  </div>
  {lobby?<div className="solo-actions">
   <span className="fine">測試人數</span>
   <button className="btn secondary" aria-label="減少一位" disabled={busy||!isHost||seats.length<=5} onClick={()=>onAct('bots',{count:seats.length-2})}><Minus size={16}/></button>
   <strong>{seats.length} 人</strong>
   <button className="btn secondary" aria-label="增加一位" disabled={busy||!isHost||seats.length>=10} onClick={()=>onAct('bots',{count:seats.length})}><Plus size={16}/></button>
   {!isHost&&<span className="fine">切回房主才能調整人數與開局。</span>}
  </div>:!ended&&<div className="solo-actions">
   <button className="btn secondary" disabled={busy} onClick={()=>onAct('autoplay',{except:me})}><StepForward size={16}/>代打其他座位</button>
   <button className="btn secondary" disabled={busy} onClick={()=>onAct('autoplay',{all:true})}><FastForward size={16}/>自動跑完整局</button>
  </div>}
  {!lobby&&!ended&&<p className="fine">「代打其他座位」會替目前視角以外的座位做決定，直到輪到你或任務揭曉；「自動跑完整局」連你的座位也一起代打。</p>}
 </section>;
}
