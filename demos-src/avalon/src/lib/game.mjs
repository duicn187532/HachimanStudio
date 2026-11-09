export const SIZES={5:[2,3,2,3,3],6:[2,3,4,3,4],7:[2,3,3,4,4],8:[3,4,4,5,5],9:[3,4,4,5,5],10:[3,4,4,5,5]};
export const EVIL={5:2,6:2,7:3,8:3,9:3,10:4};
export const ROLES={merlin:'梅林',percival:'派西維爾',loyal:'忠臣',assassin:'刺客',morgana:'莫甘娜',minion:'爪牙',mordred:'莫德雷德',oberon:'奧伯倫',lancelot_good:'蘭斯洛特・初始善',lancelot_evil:'蘭斯洛特・初始惡'};
export const LANCE_MODES={off:'不使用',mutual:'固定互認',random:'隨機轉換（大盒版）',forecast:'預告轉換（大盒版）'};
export const isEvil=r=>['assassin','morgana','minion','mordred','oberon','lancelot_evil'].includes(r);
export const alignment=p=>p.loyalty||(isEvil(p.role)?'evil':'good');
export const isLancelot=p=>['lancelot_good','lancelot_evil'].includes(p.role);
const check=(v,m)=>{if(!v)throw Error(m)};
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const b=new Uint32Array(1);const max=Math.floor(4294967296/(i+1))*(i+1);do{crypto.getRandomValues(b)}while(b[0]>=max);const j=b[0]%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a};
export function options(s){return {percival:!!s.advanced,morgana:!!s.advanced,mordred:false,oberon:false,lady:false,lancelot:'off',voice:false,transcripts:false,...s.options};}
export function roster(s){const o=options(s),n=s.players.length;const good=['merlin'],bad=['assassin'];if(o.percival)good.push('percival');if(o.morgana)bad.push('morgana');if(o.mordred)bad.push('mordred');if(o.oberon)bad.push('oberon');if(o.lancelot!=='off'){good.push('lancelot_good');bad.push('lancelot_evil')}
 const errors=[];if(n<5||n>10)errors.push(`目前 ${n} 人，需要 5–10 人才能開始。`);const badSlots=EVIL[n]||0,goodSlots=n-badSlots;
 if(EVIL[n]){if(bad.length>badSlots)errors.push(`邪惡特殊角色 ${bad.length} 位，但 ${n} 人局只有 ${badSlots} 個邪惡名額；請關閉部分角色。`);if(good.length>goodSlots)errors.push(`正義特殊角色 ${good.length} 位，超過本局 ${goodSlots} 個正義名額。`);if(n===5&&o.percival&&!o.morgana&&!o.mordred)errors.push('5 人局使用派西維爾時，需同時加入莫甘娜或莫德雷德。');}
 if(o.morgana&&!o.percival)errors.push('莫甘娜需搭配派西維爾。');
 if(EVIL[n]){while(good.length<goodSlots)good.push('loyal');while(bad.length<badSlots)bad.push('minion')}
 const counts={};for(const r of [...good,...bad])counts[r]=(counts[r]||0)+1;
 return {valid:errors.length===0,errors,roles:counts,good:goodSlots,evil:badSlots,goodCards:good,evilCards:bad,warnings:n<7&&(o.lady||o.lancelot!=='off')?['湖中女神與蘭斯洛特建議 7 人以上使用。']:[]};}
export function newPlayer(name){check(typeof name==='string'&&name.trim().length>=1&&name.trim().length<=16,'暱稱請填 1–16 個字');return {id:crypto.randomUUID(),token:crypto.randomUUID()+crypto.randomUUID(),name:name.trim()};}
export function newRoom(code,p){return {code,host:p.id,players:[p],phase:'lobby',advanced:true,options:{voice:true,transcripts:true},session:crypto.randomUUID(),voiceChannel:crypto.randomUUID(),round:0,rejects:0,attempt:0,leader:0,team:[],votes:{},cards:{},ack:[],missions:[],history:[]};}
export const key=s=>`${s.session}:${s.round}:${s.attempt}:${s.phase}`;
function normalize(s){s.options=options(s);s.lanceHistory??=[];s.lakeLog??=[];s.lakeUsed??=[];s.missionSecrets??=[];s.surrenderHistory??=[];s.surrenderRule??='assassination';}
function initialKnowledge(s,p){const o=options(s);const groups=[];let clue='';const group=(label,people)=>groups.push({label,ids:people.map(p=>p.id)});
 if(p.role==='merlin'){group('初始可見邪惡（不含莫德雷德）',s.players.filter(x=>isEvil(x.role)&&x.role!=='mordred'));clue='你看見初始邪惡玩家，但看不見莫德雷德。奧伯倫與初始邪惡蘭斯洛特都會被你看見。線索不會隨陣營轉換更新。';}
 else if(p.role==='percival'){group(o.morgana?'梅林／莫甘娜（無法分辨）':'梅林',s.players.filter(x=>x.role==='merlin'||x.role==='morgana'));clue=o.morgana?'以下兩人分別是梅林與莫甘娜，你不知道誰是誰。':'本局未啟用莫甘娜，以下玩家是梅林。';}
 else if(p.role==='oberon')clue='你屬於邪惡，但不認識邪惡同伴，他們也看不見你。梅林仍能看見你。';
 else if(isLancelot(p)){
  if(o.lancelot==='mutual'){if(isEvil(p.role))group('初始邪惡同伴（不含奧伯倫）',s.players.filter(x=>isEvil(x.role)&&x.role!=='oberon'&&x.id!==p.id));group('另一位蘭斯洛特（與你陣營相反）',s.players.filter(x=>isLancelot(x)&&x.id!==p.id));clue='固定互認模式：兩位蘭斯洛特互相知道身分與陣營，全局不轉換。';}
  else clue='轉換模式：兩位蘭斯洛特不互認，初始邪惡蘭斯洛特也不知道其他壞人。每次任務開始前依公開卡轉換陣營；勝負與出牌依「目前陣營」。';
 }else if(isEvil(p.role)){group('初始邪惡同伴（不含奧伯倫）',s.players.filter(x=>isEvil(x.role)&&x.role!=='oberon'&&x.id!==p.id));clue='這些是初始邪惡同伴，不包含奧伯倫。蘭斯洛特可能轉換，線索名單不會更新。';}
 else clue='你不知道任何人的身分。透過討論、組隊與投票找出同伴。';
 return {groups,clue};}
function beginRound(s){const o=options(s);if(['random','forecast'].includes(o.lancelot)&&!s.lanceHistory.some(x=>x.round===s.round)){const switched=o.lancelot==='forecast'?s.lancePlan[s.round]:s.lanceDeck.shift();check(typeof switched==='boolean','蘭斯洛特卡堆異常，請保留房號回報');if(switched)resolveSurrender(s,'alignment_changed');if(switched)for(const p of s.players)if(isLancelot(p))p.loyalty=alignment(p)==='evil'?'good':'evil';s.lanceHistory.push({round:s.round,switched,at:new Date().toISOString()});}s.phase='propose';}
function advanceRound(s){s.round++;s.attempt=0;s.leader=(s.leader+1)%s.players.length;s.team=[];s.votes={};beginRound(s);}
export function move(s,id,a){normalize(s);const p=s.players.find(p=>p.id===id);check(p,'你已離開此房間');
 if(a.type==='join')throw Error('無效操作');
 if(a.type==='leave'){check(s.phase==='lobby','遊戲中請留在牌局；可關閉頁面後回來');s.players=s.players.filter(x=>x.id!==id);if(s.host===id)s.host=s.players[0]?.id;return;}
 if(a.type==='kick'){check(s.phase==='lobby'&&id===s.host&&a.target!==id,'現在無法移除玩家');s.players=s.players.filter(x=>x.id!==a.target);return;}
 if(a.type==='settings'){check(s.phase==='lobby'&&id===s.host,'只有房主可設定');const next={...s.options};if('advanced' in a){check(typeof a.advanced==='boolean','設定值必須是開或關');next.percival=a.advanced;next.morgana=a.advanced;}if(a.options){check(typeof a.options==='object'&&!Array.isArray(a.options),'設定格式不正確');for(const [k,v] of Object.entries(a.options)){check(['percival','morgana','mordred','oberon','lady','lancelot','voice','transcripts'].includes(k),'未知的房主設定');if(k==='lancelot')check(Object.hasOwn(LANCE_MODES,v),'未知的蘭斯洛特模式');else check(typeof v==='boolean','設定值必須是開或關');next[k]=v;}if(next.percival===false)next.morgana=false;}s.options=next;if(next.transcripts)s.transcriptsEverEnabled=true;s.advanced=next.percival&&next.morgana;return;}
 if(a.type==='communication'){check(id===s.host&&a.key===key(s),'只有房主可切換通訊功能');check(a.options&&Object.keys(a.options).length>0&&Object.keys(a.options).every(k=>['voice','transcripts'].includes(k)),'未知的通訊設定');for(const [k,v] of Object.entries(a.options)){check(typeof v==='boolean','設定值必須是開或關');s.options[k]=v;if(k==='transcripts'&&v)s.transcriptsEverEnabled=true;if(k==='transcripts'&&!v)s.transcriptsStoppedAt=Date.now();}return;}
 if(a.type==='start'){check(s.phase==='lobby'&&id===s.host,'只有房主可以開始');const deck=roster(s);check(deck.valid,deck.errors.join(' '));const roles=shuffle([...deck.goodCards,...deck.evilCards]);s.players.forEach((x,i)=>{x.role=roles[i];x.loyalty=isEvil(x.role)?'evil':'good'});s.initialKnowledge=Object.fromEntries(s.players.map(p=>[p.id,initialKnowledge(s,p)]));s.startedAt=new Date().toISOString();s.phase='reveal';s.leader=shuffle(s.players.map((_,i)=>i))[0];s.lakeHolder=s.options.lady?s.players[(s.leader+s.players.length-1)%s.players.length].id:null;s.lakeUsed=[];s.lakeLog=[];s.lanceHistory=[];if(s.options.lancelot==='random')s.lanceDeck=shuffle([false,false,false,false,true,true]);if(s.options.lancelot==='forecast')s.lancePlan=shuffle([false,false,false,false,false,true,true]).slice(0,5);return;}
 if(a.type==='reset'){check(s.phase==='ended'&&id===s.host,'只有房主能在結束後再開一局');const r=newRoom(s.code,s.players[0]);r.players=s.players.map(({role,loyalty,...p})=>p);r.host=s.host;r.options={...s.options};r.advanced=s.advanced;r.voiceChannel=s.voiceChannel||s.session;if(s.solo)r.solo=true;Object.keys(s).forEach(k=>delete s[k]);Object.assign(s,r);return;}
 if(a.type==='bots'){check(s.solo&&s.phase==='lobby'&&id===s.host,'只有測試房房主能在開局前調整人數');setBots(s,a.count);return;}
 if(a.type==='autoplay'){check(s.solo,'只有單人測試房能讓機器人代打');check(!['lobby','ended'].includes(s.phase),'請先開始遊戲');autoplay(s,a.all===true?null:typeof a.except==='string'?a.except:id);return;}
 check(a.key===key(s),'階段已更新，請依畫面重新操作');
 if(a.type.startsWith('surrender_')){check(!['lobby','ended','assassinate'].includes(s.phase)&&alignment(p)==='evil','只有目前邪惡陣營能在遊戲中使用投降表決');const eligible=s.players.filter(x=>alignment(x)==='evil').map(x=>x.id);if(a.type==='surrender_start'){check(!s.surrender?.active,'已有投降表決進行中');s.surrender={active:true,initiator:id,eligible,votes:{[id]:true},startedRound:s.round,startedPhase:s.phase,startedAt:new Date().toISOString()};}else{check(s.surrender?.active,'目前沒有進行中的投降表決');check(s.surrender.eligible.includes(id),'你不在本次表決名單');if(a.type==='surrender_cancel'){check(s.surrender.initiator===id,'只有發起人可以撤回表決');resolveSurrender(s,'cancelled');return;}check(a.type==='surrender_vote'&&typeof a.approve==='boolean','請選擇同意或反對投降');check(s.surrender.votes[id]!==a.approve,'你已送出相同選擇');s.surrender.votes[id]=a.approve;if(!a.approve){resolveSurrender(s,'rejected');return;}}
 if(eligible.every(x=>s.surrender.votes[x]===true)){resolveSurrender(s,'passed');s.surrenderPosition=capturePosition(s);s.surrenderAssassination=true;s.ending='surrender_assassination';s.phase='assassinate';}return;}

 if(a.type==='ack'){check(s.phase==='reveal','目前不是確認身分階段');if(!s.ack.includes(id))s.ack.push(id);if(s.ack.length===s.players.length)beginRound(s);return;}
 if(a.type==='propose'){check(s.phase==='propose'&&s.players[s.leader].id===id,'請等候隊長組隊');check(Array.isArray(a.team)&&a.team.length===SIZES[s.players.length][s.round]&&new Set(a.team).size===a.team.length&&a.team.every(x=>s.players.some(p=>p.id===x)),'隊伍人數不正確');s.team=a.team;s.votes={};s.phase='vote';return;}
 if(a.type==='vote'){check(s.phase==='vote','目前不是組隊投票階段');check(typeof a.approve==='boolean','請選擇贊成或反對');check(!(id in s.votes),'你已投票');s.votes[id]=a.approve;if(Object.keys(s.votes).length===s.players.length){const approved=Object.values(s.votes).filter(Boolean).length>s.players.length/2;s.history.push({at:new Date().toISOString(),round:s.round,leader:s.players[s.leader].id,team:[...s.team],votes:{...s.votes},approved});if(approved){s.phase='quest';s.cards={};s.rejects=0;}else{s.rejects++;s.leader=(s.leader+1)%s.players.length;s.attempt++;s.phase='propose';s.team=[];s.votes={};if(s.rejects===5)end(s,'evil','連續五次組隊被否決，邪惡陣營獲勝。');}}return;}
 if(a.type==='quest'){check(s.phase==='quest'&&s.team.includes(id),'只有本次任務隊員可以出牌');check(typeof a.success==='boolean','請選擇任務牌');check(alignment(p)==='evil'||a.success,'你目前是正義陣營，只能出成功牌');check(!(s.options.lancelot==='forecast'&&isLancelot(p)&&alignment(p)==='evil'&&a.success),'預告轉換模式的目前邪惡蘭斯洛特必須出失敗牌');check(!(id in s.cards),'你已出牌');s.cards[id]=a.success;if(Object.keys(s.cards).length===s.team.length){const fails=Object.values(s.cards).filter(v=>!v).length;const threshold=s.players.length>=7&&s.round===3?2:1;s.missionSecrets.push({round:s.round,cards:{...s.cards}});s.missions.push({at:new Date().toISOString(),round:s.round,team:[...s.team],fails,success:fails<threshold});s.cards={};s.phase='result';if(s.missions.filter(x=>!x.success).length===3)end(s,'evil','三次任務失敗，邪惡陣營獲勝。');else if(s.missions.filter(x=>x.success).length===3)s.phase='assassinate';}return;}
 if(a.type==='next'){check(s.phase==='result','目前無法前往下一輪');if(s.options.lady&&s.round>=1&&s.round<=3&&!s.lakeLog.some(x=>x.round===s.round)){s.phase='lake';return;}advanceRound(s);return;}
 if(a.type==='inspect'){check(s.phase==='lake'&&s.lakeHolder===id,'只有本次湖中女神持有人可以查驗');const target=s.players.find(x=>x.id===a.target);check(target&&target.id!==id&&!s.lakeUsed.includes(target.id),'不能查驗自己或已使用過湖中女神的人');check(!s.lakeLog.some(x=>x.round===s.round),'本輪已查驗');s.lakeLog.push({at:new Date().toISOString(),round:s.round,inspector:id,target:target.id,alignment:alignment(target)});s.lakeUsed.push(id);s.lakeHolder=target.id;s.phase='lake_result';return;}
 if(a.type==='lake_done'){const last=s.lakeLog.at(-1);check(s.phase==='lake_result'&&last?.inspector===id,'請等待查驗者確認');advanceRound(s);return;}
 if(a.type==='assassinate'){check(s.phase==='assassinate'&&p.role==='assassin','只有刺客可以選擇目標');const target=s.players.find(x=>x.id===a.target);check(target&&target.id!==id,'請選擇其他玩家');s.target=target.id;end(s,target.role==='merlin'?'evil':'good',target.role==='merlin'?'梅林遭到刺殺，邪惡陣營逆轉獲勝。':'刺殺未命中梅林，正義陣營獲勝。');return;}
 throw Error('未知操作');
}
function resolveSurrender(s,outcome){if(!s.surrender?.active)return;const b=s.surrender;s.surrenderHistory??=[];s.surrenderHistory.push({initiator:b.initiator,eligible:[...b.eligible],votes:{...b.votes},startedRound:b.startedRound,startedPhase:b.startedPhase,startedAt:b.startedAt,round:s.round,phase:s.phase,at:new Date().toISOString(),outcome});s.surrender={active:false,outcome};}
function capturePosition(s){return {phase:s.phase,round:s.round,leader:s.players[s.leader]?.id,team:[...s.team],votes:{...s.votes},cards:{...s.cards}};}
function end(s,winner,reason){s.finalPosition=s.surrenderPosition||capturePosition(s);resolveSurrender(s,'game_ended');s.phase='ended';s.winner=winner;s.reason=reason;s.endedAt=new Date().toISOString();}

export function view(s,id){const me=s.players.find(p=>p.id===id);check(me,'身分憑證無效，請重新加入');const o=options(s);const knowledge=s.initialKnowledge?.[id]||initialKnowledge(s,me);const intel=[...new Set(knowledge.groups.flatMap(g=>g.ids))];
 return {code:s.code,matchId:s.session,host:s.host,phase:s.phase,solo:!!s.solo,transcriptsUsed:o.transcripts||!!s.transcriptsEverEnabled,assassinationFromSurrender:!!s.surrenderAssassination,advanced:o.percival&&o.morgana,options:o,roster:roster(s),key:key(s),round:s.round,rejects:s.rejects,leader:s.players[s.leader]?.id,team:s.team,missions:s.missions,history:s.history,ack:s.ack,submitted:s.phase==='vote'?Object.keys(s.votes):s.phase==='quest'?Object.keys(s.cards):[],me:{id:me.id,name:me.name,userId:me.userId||null,role:me.role,alignment:alignment(me),intel,knowledge:knowledge.groups,clue:knowledge.clue,surrender:alignment(me)==='evil'&&s.phase!=='lobby'&&s.phase!=='ended'&&s.phase!=='assassinate'?{active:!!s.surrender?.active,eligibleCount:s.players.filter(p=>alignment(p)==='evil').length,agreeCount:s.surrender?.active?Object.values(s.surrender.votes).filter(Boolean).length:0,myVote:s.surrender?.active?s.surrender.votes[id]??null:null,isInitiator:s.surrender?.active&&s.surrender.initiator===id,outcome:s.surrender?.outcome||null}:null,forcedFail:o.lancelot==='forecast'&&isLancelot(me)&&alignment(me)==='evil',lakeResults:(s.lakeLog||[]).filter(x=>x.inspector===id).map(x=>({...x})),acted:s.phase==='vote'?id in s.votes:s.phase==='quest'?id in s.cards:s.ack.includes(id)},players:s.players.map(p=>({id:p.id,name:p.name,avatar:p.avatar||null,...(p.userId?{userId:p.userId}:{}),...(p.bot?{bot:true}:{}),...(s.phase==='ended'?{role:p.role,alignment:alignment(p)}:{})})),lake:{enabled:o.lady,holder:s.lakeHolder||null,used:s.lakeUsed||[],history:(s.lakeLog||[]).map(({round,inspector,target})=>({round,inspector,target})),inspector:s.phase==='lake_result'?s.lakeLog?.at(-1)?.inspector:null},lancelot:{mode:o.lancelot,plan:o.lancelot==='forecast'?s.lancePlan||[]:[],events:s.lanceHistory||[]},sizes:SIZES[s.players.length]||[],evil:EVIL[s.players.length]||0,winner:s.winner,reason:s.reason,target:s.target};}

// ── Single-player test rooms (UAT) ────────────────────────────────────────────
// One tester holds every seat: the host plus bots. Test rooms are never ranked.
export const SOLO_SIZES=[5,6,7,8,9,10];
const botName=(s,n)=>{let i=n;while(s.players.some(p=>p.name==='測試員'+i))i++;return '測試員'+i};
function setBots(s,count){
 check(Number.isInteger(count)&&count>=4&&count<=9,'機器人數量需為 4–9（總人數 5–10）');
 const humans=s.players.filter(p=>!p.bot);let bots=s.players.filter(p=>p.bot);
 while(bots.length>count)bots=bots.slice(0,-1);
 while(bots.length<count)bots.push({...newPlayer(botName({players:[...humans,...bots]},bots.length+1)),bot:true});
 s.players=[...humans,...bots];
}
export function makeSolo(s,count=4){s.solo=true;s.options={...s.options,voice:false,transcripts:false};setBots(s,Number.isInteger(count)?count:4);return s}
const pick=(list,n)=>shuffle([...list]).slice(0,n);
const chance=p=>{const b=new Uint32Array(1);crypto.getRandomValues(b);return b[0]/4294967296<p};
/** The single next action a bot (any seat but `except`) would take now, or null. */
function botAction(s,except){
 const bot=p=>p.id!==except;const evil=p=>alignment(p)==='evil';
 switch(s.phase){
  case 'reveal':{const p=s.players.find(p=>bot(p)&&!s.ack.includes(p.id));return p&&[p.id,{type:'ack'}]}
  case 'propose':{const leader=s.players[s.leader];if(!bot(leader))return null;const others=s.players.filter(p=>p.id!==leader.id).map(p=>p.id);return [leader.id,{type:'propose',team:[leader.id,...pick(others,SIZES[s.players.length][s.round]-1)]}]}
  case 'vote':{const p=s.players.find(p=>bot(p)&&!(p.id in s.votes));if(!p)return null;const hasEvil=s.team.some(id=>evil(s.players.find(x=>x.id===id)));
   const approve=s.rejects>=3||(evil(p)?hasEvil||chance(.4):chance(.7));return [p.id,{type:'vote',approve}]}
  case 'quest':{const p=s.players.find(p=>bot(p)&&s.team.includes(p.id)&&!(p.id in s.cards));if(!p)return null;
   const forced=options(s).lancelot==='forecast'&&isLancelot(p)&&evil(p);return [p.id,{type:'quest',success:evil(p)?!forced&&chance(.4):true}]}
  case 'result':return except===null?[s.players[0].id,{type:'next'}]:null;
  case 'lake':{const p=s.players.find(p=>p.id===s.lakeHolder);if(!p||!bot(p))return null;const targets=s.players.filter(x=>x.id!==p.id&&!s.lakeUsed.includes(x.id));return targets.length?[p.id,{type:'inspect',target:pick(targets,1)[0].id}]:null}
  case 'lake_result':{const id=s.lakeLog.at(-1)?.inspector;return id&&id!==except?[id,{type:'lake_done'}]:null}
  case 'assassinate':{const p=s.players.find(p=>p.role==='assassin');if(!p||!bot(p))return null;const targets=s.players.filter(x=>x.id!==p.id&&!evil(x));return [p.id,{type:'assassinate',target:pick(targets,1)[0].id}]}
  default:return null;
 }
}
/**
 * Let bots act until a human decision is needed. `except` is the seat the tester is
 * playing (it never acts and results wait for the tester); `null` plays the whole game out.
 */
function autoplay(s,except){
 for(let step=0;step<400;step++){
  if(s.phase==='ended')return;
  const next=botAction(s,except);if(!next)return;
  try{move(s,next[0],{...next[1],key:key(s)})}catch{return}
 }
}
