import {Shield,Crown,Sword,Castle,Flame,Moon,Star,TreePine,Gem,Feather,Sun,Origami} from 'lucide-react';
import {COLORS,parseAvatar} from '../../lib/profile.mjs';
const icons={shield:Shield,crown:Crown,sword:Sword,castle:Castle,dragon:Origami,moon:Moon,star:Star,flame:Flame,tree:TreePine,gem:Gem,feather:Feather,sun:Sun};
export default function PlayerAvatar({name,avatar,size=40,className=''}:{name:string;avatar?:string|null;size?:number;className?:string}){
 const preset=parseAvatar(avatar);
 const style={width:size,height:size,minWidth:size};
 if(preset){const Icon=icons[preset.emblem as keyof typeof icons];return <span className={'player-avatar '+className} style={{...style,background:COLORS[preset.color as keyof typeof COLORS],color:'#f7e4b3'}} aria-hidden="true"><Icon size={size*.56}/></span>}
 if(avatar&&/^https:\/\//.test(avatar))return <span className={'player-avatar '+className} style={{...style,position:'relative'}}><span aria-hidden="true">{name.slice(0,1)}</span><img style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} src={avatar} alt="" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.display='none'}}/></span>;
 return <span className={'player-avatar '+className} style={style} aria-hidden="true">{name.slice(0,1)||'✦'}</span>;
}
