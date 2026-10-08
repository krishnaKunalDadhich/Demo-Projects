import { getState, updateState } from './state.js';
export const notify = (message,type='success') => window.dispatchEvent(new CustomEvent('focusos:toast',{detail:{message,type}}));
export const requestNotifications = async () => { if(!('Notification' in window)) throw new Error('Browser notifications are not supported.'); const permission=await Notification.requestPermission(); if(permission!=='granted') throw new Error('Notification permission was not granted.'); updateState(s=>({...s,settings:{...s.settings,notifications:true}})); return permission; };
export const browserNotify = (title,body) => { if(getState().settings.notifications && 'Notification' in window && Notification.permission==='granted') new Notification(title,{body}); };
