export const EMBLEMS=['shield','crown','sword','castle','dragon','moon','star','flame','tree','gem','feather','sun'];
export const COLORS={forest:'#315b47',wine:'#843d49',navy:'#344e75',gold:'#886627',violet:'#655080',slate:'#52636a'};
export function parseAvatar(value){
 if(typeof value!=='string')return null;
 const [prefix,emblem,color,...extra]=value.split(':');
 return prefix==='avalon'&&EMBLEMS.includes(emblem)&&Object.hasOwn(COLORS,color)&&!extra.length?{emblem,color}:null;
}
export function customAvatar(value){
 if(value===null)return null;
 if(!parseAvatar(value))throw Error('請選擇有效的徽章與配色');
 return value;
}
