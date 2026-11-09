// Local UI preview only: no game API, transcript queue or persistence access.
export class SpeechPreview {
 /** @param {any} Recognition
  * @param {{onDraft?:(text:string)=>void,onFinal?:(text:string)=>void,onState?:(state:string)=>void,onError?:(message:string)=>void}} [handlers]
  */
 constructor(Recognition,handlers={}){
  this.Recognition=Recognition;this.handlers=handlers;this.active=false;this.recognition=null;this.timer=null;
 }
 start(){if(this.active)return;this.active=true;try{this.launch()}catch(e){this.active=false;this.handlers.onState?.('error');throw e}}
 launch(){
  if(!this.active)return;const rec=new this.Recognition();this.recognition=rec;const committed=new Set();
  rec.lang='zh-TW';rec.continuous=true;rec.interimResults=true;
  this.handlers.onState?.('starting');
  const current=()=>this.active&&this.recognition===rec;
  rec.onstart=()=>{if(current())this.handlers.onState?.('listening')};
  rec.onresult=event=>{
   if(!current())return;const draft=[];
   // A later result may revise just one interim entry. Rebuild all interim text;
   // final entries stay stable and are emitted at most once per recognition run.
   for(let i=0;i<event.results.length;i++){
    const result=event.results[i],text=String(result[0]?.transcript||'');
    if(result.isFinal){if(!committed.has(i)){committed.add(i);if(text.trim())this.handlers.onFinal?.(text.trim())}}
    else draft.push(text);
   }
   this.handlers.onDraft?.(draft.join(''));
  };
  rec.onerror=event=>{
   if(!current()||event.error==='no-speech'||event.error==='aborted')return;
   this.active=false;this.recognition=null;clearTimeout(this.timer);this.handlers.onDraft?.('');this.handlers.onState?.('error');
   try{rec.abort()}catch{}
   this.handlers.onError?.(event.error==='not-allowed'||event.error==='service-not-allowed'?'未允許語音辨識，請檢查麥克風與瀏覽器權限。':event.error==='network'?'辨識服務連線失敗，請確認網路後再試。':event.error==='language-not-supported'?'此裝置的辨識服務不支援目前中文設定。':'語音辨識已中斷，請重新開始測試。');
  };
  rec.onend=()=>{if(!current())return;this.recognition=null;this.handlers.onDraft?.('');this.handlers.onState?.('restarting');this.timer=setTimeout(()=>{try{this.launch()}catch{this.active=false;this.handlers.onState?.('error');this.handlers.onError?.('無法恢復辨識，請重新開始測試。')}},600)};
  rec.start();
 }
 stop(){this.active=false;clearTimeout(this.timer);const rec=this.recognition;this.recognition=null;try{rec?.abort()}catch{}this.handlers.onDraft?.('');this.handlers.onState?.('idle')}
}
