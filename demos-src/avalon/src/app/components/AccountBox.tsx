'use client';
import {useEffect,useState} from 'react';
import PlayerAvatar from './PlayerAvatar';
import {LogIn,LogOut,Trophy} from 'lucide-react';

export type Account={id:string;name:string;avatar:string|null;rating:number;games:number};
type Provider={key:string;label:string};
type Me={user:Account|null;providers:Provider[]};

const AUTH_ERRORS:Record<string,string>={
 unavailable:'這個登入方式尚未設定。',
 cancelled:'已取消登入。',
 expired:'登入逾時，請再試一次。',
 provider:'登入服務暫時無法使用，請稍後再試。',
 chatgpt:'沒有取得 ChatGPT 登入資訊，請再試一次。',
};

/** Where a provider button sends the browser; it comes back to the current page. */
export function signInHref(provider:string,back:string){
 if(provider==='chatgpt')return '/signin-with-chatgpt?return_to='+encodeURIComponent('/api/auth/chatgpt?next='+encodeURIComponent(back));
 return `/api/auth/${provider}?return_to=${encodeURIComponent(back)}`;
}
function here(){
 const url=new URL(location.href);url.searchParams.delete('auth_error');
 return url.pathname+(url.search||'');
}

export function useAccount(){
 const [me,setMe]=useState<Me|null>(null);
 useEffect(()=>{
  let active=true;
  const refresh=()=>fetch('/api/me',{cache:'no-store'}).then(r=>r.json() as Promise<Me>).then(d=>{if(active)setMe(d)}).catch(()=>{if(active)setMe({user:null,providers:[]})});
  void refresh();window.addEventListener('avalon-profile',refresh);
  return()=>{active=false;window.removeEventListener('avalon-profile',refresh)};
 },[]);
 return [me,setMe] as const;
}

export async function signOut(){
 await fetch('/api/auth/logout',{method:'POST'}).catch(()=>{});
 location.reload();
}

/** Sign-in buttons, or the signed-in account with a link to its stats. */
export default function AccountBox({onUser}:{onUser?:(user:Account|null)=>void}){
 const [me]=useAccount();
 const [error,setError]=useState('');
 useEffect(()=>{
  const code=new URL(location.href).searchParams.get('auth_error');
  if(code){setError(AUTH_ERRORS[code]||'登入失敗，請再試一次。');history.replaceState(null,'',here())}
 },[]);
 useEffect(()=>{if(me)onUser?.(me.user)},[me]); // eslint-disable-line react-hooks/exhaustive-deps
 if(!me)return <div className="account-box muted">正在確認登入狀態…</div>;
 if(me.user)return <div className="account-box signed-in">
  <PlayerAvatar name={me.user.name} avatar={me.user.avatar}/>
  <div><strong>{me.user.name}</strong><span className="fine">積分 {me.user.rating} · {me.user.games} 場</span></div>
  <a className="icon-text" href="./"><Trophy size={16}/>戰績</a>
  <button className="icon-text" onClick={signOut} aria-label="登出"><LogOut size={16}/></button>
 </div>;
 return <div className="account-box">
  <p className="account-hint"><LogIn size={15}/>登入後可記錄戰績與排名，換手機也能回到原座位。</p>
  <div className="account-providers">
   {me.providers.map(p=><a key={p.key} className={'btn secondary provider-'+p.key} href={signInHref(p.key,here())}>{p.label} 登入</a>)}
  </div>
  {error&&<div className="error" role="alert">{error}</div>}
  <p className="fine">不登入也能照常遊玩，只是不計入排名。</p>
 </div>;
}
