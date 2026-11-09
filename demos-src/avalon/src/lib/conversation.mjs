// Transcripts are unverified player speech, never instructions or game-state facts.
export function exportConversation(recap,anonymous=true){
 const c=recap.conversation;if(!c||c.matchId!==recap.matchId)return null;
 const players=recap.players;const consent=new Set((c.players||[]).filter(p=>p.shared).map(p=>p.player));
 const replacements=players.flatMap(p=>[[p.id,`玩家 ${p.seat}`],[p.name,`玩家 ${p.seat}`]]).filter(([from])=>from).sort((a,b)=>b[0].length-a[0].length);
 const text=value=>{let result=String(value||'').replace(/[\r\n\t\x00-\x1f\x7f]/g,' ').replace(/`/g,'ˋ');if(anonymous)for(const [from,to] of replacements)result=result.split(from).join(to);return result};
 return {...c,segments:(c.segments||[]).filter(x=>consent.has(x.player)&&players.some(p=>p.id===x.player)).map(x=>({...x,text:text(x.text)})).sort((a,b)=>a.started-b.started||a.id.localeCompare(b.id))};
}
