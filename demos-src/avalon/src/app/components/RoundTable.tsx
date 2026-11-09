'use client';
import PlayerAvatar from './PlayerAvatar';
import {Crown,Flag,Users} from 'lucide-react';
// Seats follow room.players order, which is also the leader rotation (leader+1), drawn clockwise from the top.
const point=(i:number,n:number,r:number)=>{const a=i/n*2*Math.PI-Math.PI/2;return [50+r*Math.cos(a),50+r*Math.sin(a)]};
export default function RoundTable({room}:{room:any}){
 const players=room.players,n=players.length,lead=players.findIndex((p:any)=>p.id===room.leader),next=(lead+1)%n,live=lead>=0&&room.phase!=='ended';
 const [x1,y1]=point(lead,n,25),[x2,y2]=point(next,n,25);
 return <section className="panel table-status"><h3><Users size={18}/>圓桌座位</h3>
 <div className="round-table" role="list" aria-label="圓桌座位，隊長依順時針輪替">
  <svg viewBox="0 0 100 100" aria-hidden="true"><defs><marker id="rt-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" className="rt-head"/></marker></defs><circle cx="50" cy="50" r="29" className="rt-table"/>{live&&<path d={`M${x1} ${y1}A25 25 0 0 1 ${x2} ${y2}`} className="rt-arrow" markerEnd="url(#rt-head)"/>}</svg>
  <div className="rt-center"><strong>第 {room.round+1} 回合</strong></div>
  {players.map((p:any,i:number)=>{const [x,y]=point(i,n,40),leader=i===lead,upNext=live&&i===next,team=room.team.includes(p.id),role=leader?'隊長':upNext?'下一位隊長':team?'任務隊員':'';return <div role="listitem" aria-label={p.name+(role?'，'+role:'')} key={p.id} className={'rt-seat'+(leader?' is-leader':'')+(upNext?' is-next':'')+(team?' on-team':'')} style={{left:x+'%',top:y+'%'}}><PlayerAvatar name={p.name} avatar={p.avatar} size={34} className={'mini-avatar av'+i}/><span className="rt-name">{p.id===room.me.id?'你':p.name}</span>{leader?<span className="rt-tag" title="隊長"><Crown size={11}/></span>:upNext?<span className="rt-tag next" title="下一位隊長">下</span>:team?<span className="rt-tag team" title="任務隊員"><Flag size={11}/></span>:null}</div>})}
 </div>
 {live&&n>1&&<p className="rt-caption">下一位隊長：{players[next].id===room.me.id?'你':players[next].name}</p>}
 </section>;
}
