export type VoicePeer={player_id:string;instance:string;muted:number};
type Peer={pc:RTCPeerConnection;instance:string;audio:HTMLAudioElement;pending:RTCIceCandidateInit[];retries:number;blocked:boolean;retryAt:number;offering:boolean;force:boolean;grace?:ReturnType<typeof setTimeout>};
// Retry an unanswered offer or a broken pair quickly at first, then back off.
const RETRY_DELAYS=[1500,3000,6000,12000,15000];
// Each player publishes only their own microphone. Received audio is never recorded.
export class VoiceMesh {
 private peers=new Map<string,Peer>();private closed=false;private volume=1;private deafened=false;
 private context:AudioContext|null=null;private meters=new Map<string,AnalyserNode>();private meterTimer:any;
 constructor(private me:string,private stream:MediaStream,private ice:RTCIceServer[],private send:(to:string,target:string,payload:any)=>Promise<void>,private changed:(states:Record<string,string>,speaking:string[])=>void,private blocked:()=>void,private wake:()=>void=()=>{}){
  try{this.context=new AudioContext();void this.context.resume();this.meter(me,stream)}catch{}
  this.meterTimer=setInterval(()=>this.report(),350);
 }
 private meter(id:string,stream:MediaStream){try{if(!this.context)return;const source=this.context.createMediaStreamSource(stream),analyser=this.context.createAnalyser();analyser.fftSize=256;source.connect(analyser);this.meters.set(id,analyser)}catch{}}
 private report(){if(this.closed)return;const states:Record<string,string>={};for(const [id,p] of this.peers)states[id]=p.blocked?'playback-blocked':p.pc.connectionState;
  const speaking:string[]=[];for(const [id,meter] of this.meters){const data=new Uint8Array(meter.fftSize);meter.getByteTimeDomainData(data);const rms=Math.sqrt(data.reduce((n,x)=>n+(x-128)**2,0)/data.length)/128;if(rms>.035&&(id!==this.me||this.stream.getAudioTracks().some(t=>t.enabled)))speaking.push(id)}this.changed(states,speaking);
 }
 private remove(id:string){const p=this.peers.get(id);if(p){clearTimeout(p.grace);p.pc.close();p.audio.srcObject=null;p.audio.remove();this.peers.delete(id)}this.meters.delete(id)}
 private peer(id:string,instance:string){let p=this.peers.get(id);if(p&&p.instance!==instance){this.remove(id);p=undefined}if(p)return p;
  const pc=new RTCPeerConnection({iceServers:this.ice});const audio=document.createElement('audio');audio.autoplay=true;audio.setAttribute('playsinline','');audio.style.display='none';audio.volume=this.volume;audio.muted=this.deafened;document.body.appendChild(audio);
  p={pc,instance,audio,pending:[],retries:0,blocked:false,retryAt:0,offering:false,force:false};this.peers.set(id,p);const current=p;
  for(const track of this.stream.getAudioTracks())pc.addTrack(track,this.stream);
  pc.onicecandidate=e=>{if(e.candidate&&!this.closed&&this.peers.get(id)===current)void this.send(id,instance,{candidate:e.candidate.toJSON()}).catch(()=>{})};
  pc.ontrack=e=>{if(this.closed||this.peers.get(id)!==current)return;const stream=e.streams[0]||new MediaStream([e.track]);audio.srcObject=stream;this.meter(id,stream);void audio.play().catch(()=>{current.blocked=true;this.blocked();this.report()})};
  pc.onconnectionstatechange=()=>{this.report();this.watch(id,current)};return p;
 }
 // A dropped pair (network switch, phone wake-up) is repaired right away instead of
 // waiting for the next scheduled retry. "disconnected" often heals itself, so it gets a short grace.
 private watch(id:string,p:Peer){
  if(this.closed||this.peers.get(id)!==p)return;
  const state=p.pc.connectionState;clearTimeout(p.grace);
  if(state==='failed')this.repair(id,p);
  else if(state==='disconnected')p.grace=setTimeout(()=>{if(!this.closed&&this.peers.get(id)===p&&p.pc.connectionState==='disconnected')this.repair(id,p)},1500);
 }
 // Only the offerer of a pair can restart ICE; the answerer just listens sooner for the new offer.
 private repair(id:string,p:Peer){if(this.me<id){p.force=true;p.retryAt=0;p.retries=0}this.wake()}
 /** The network changed (back online, Wi-Fi to mobile): restart ICE on every pair we offer. */
 restartAll(){if(this.closed)return;for(const [id,p] of this.peers)this.repair(id,p)}
 /** True while any pair is still negotiating or recovering; callers poll signaling faster then. */
 busy(){for(const p of this.peers.values())if(p.force||p.pc.connectionState!=='connected'||p.pc.signalingState!=='stable')return true;return false
 }
 // A pair has one offerer. Repeat an unanswered offer without creating glare;
 // after an answer, restart ICE only for pairs that have stopped connecting.
 private async maintain(id:string,p:Peer){
  if(this.me>=id||p.offering||this.closed)return;
  if(p.pc.connectionState==='connected'&&p.pc.signalingState==='stable'&&!p.force){p.retries=0;return}
  if(Date.now()<p.retryAt)return;
  p.offering=true;
  try{
   if(p.pc.signalingState==='stable'){
    p.force=false;
    const offer=await p.pc.createOffer({iceRestart:!!p.pc.localDescription});
    await p.pc.setLocalDescription(offer);
   }
   if(p.pc.signalingState==='have-local-offer'&&this.peers.get(id)===p&&!this.closed){
    await this.send(id,p.instance,{description:p.pc.localDescription?.toJSON()});
   }
  }finally{
   p.offering=false;
   p.retryAt=Date.now()+RETRY_DELAYS[Math.min(p.retries++,RETRY_DELAYS.length-1)];
  }
 }
 private async applySignal(id:string,p:Peer,v:any){
  if(v.candidate){
   if(p.pc.remoteDescription){
    try{await p.pc.addIceCandidate(v.candidate);return}catch{ /* A restart candidate can precede its SDP. */ }
   }
   if(p.pending.length<100)p.pending.push(v.candidate);
   return;
  }
  const description=v.description;
  if(!description)return;
  const answerer=this.me>id;
  if(answerer?description.type!=='offer':description.type!=='answer'||p.pc.signalingState!=='have-local-offer')return;
  await p.pc.setRemoteDescription(description);
  for(const candidate of p.pending.splice(0)){
   // One obsolete ICE candidate must not suppress the SDP answer.
   try{await p.pc.addIceCandidate(candidate)}catch{}
  }
  if(answerer){
   await p.pc.setLocalDescription(await p.pc.createAnswer());
   if(!this.closed&&this.peers.get(id)===p)await this.send(id,p.instance,{description:p.pc.localDescription?.toJSON()});
  }
 }
 async sync(members:VoicePeer[],signals:any[]){
  if(this.closed)return;
  const present=new Map(members.filter(m=>m.player_id!==this.me).map(m=>[m.player_id,m]));
  for(const id of this.peers.keys())if(!present.has(id))this.remove(id);
  await Promise.allSettled([...present].map(async ([id,m])=>{
   const p=this.peer(id,m.instance);
   for(const signal of signals){
    if(this.closed)return;
    if(signal.sender!==id||signal.source!==m.instance)continue;
    try{await this.applySignal(id,p,signal.payload)}catch{ /* Unanswered offers are retried independently. */ }
   }
   await this.maintain(id,p);
  }));
  this.report();
 }
 async diagnostics(){
  return Promise.all([...this.peers].map(async ([id,{pc}])=>{
   const stats=await pc.getStats();
   let packets=0,energy=0,candidates=0;
   stats.forEach(stat=>{
    if(stat.type==='local-candidate')candidates++;
    if(stat.type==='inbound-rtp'&&stat.kind==='audio'){packets+=stat.packetsReceived||0;energy+=stat.totalAudioEnergy||0}
   });
   return {id,state:pc.connectionState,signaling:pc.signalingState,candidates,packets,energy};
  }));
 }
 setAudio(volume:number,deafened:boolean){this.volume=volume;this.deafened=deafened;for(const p of this.peers.values()){p.audio.volume=volume;p.audio.muted=deafened}}
 async resume(){await Promise.all([...this.peers.values()].filter(p=>p.audio.srcObject).map(async p=>{await p.audio.play();p.blocked=false}));void this.context?.resume().catch(()=>{});this.report();}
 close(){this.closed=true;clearInterval(this.meterTimer);for(const id of this.peers.keys())this.remove(id);void this.context?.close().catch(()=>{});this.changed({},[])}
}
