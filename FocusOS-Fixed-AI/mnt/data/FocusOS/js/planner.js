import { getState, updateState } from './state.js';
import { saveState } from './storage.js';
import { uid } from './utils.js';
export const addSchedule = item => { updateState(s=>({...s,schedule:[...s.schedule,{...item,id:uid('schedule')}]})); return saveState(getState()); };
export const updateSchedule = (id,patch) => { updateState(s=>({...s,schedule:s.schedule.map(x=>x.id===id?{...x,...patch}:x)})); return saveState(getState()); };
export const deleteSchedule = id => { updateState(s=>({...s,schedule:s.schedule.filter(x=>x.id!==id)})); return saveState(getState()); };
export const sortedSchedule = () => [...getState().schedule].sort((a,b)=>a.start.localeCompare(b.start));
