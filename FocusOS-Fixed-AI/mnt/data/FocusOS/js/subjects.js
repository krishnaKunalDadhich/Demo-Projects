import { getState, updateState } from './state.js';
import { saveState } from './storage.js';
import { uid } from './utils.js';
export const addSubject = subject => { updateState(s=>({...s,subjects:[...s.subjects,{...subject,id:uid('subject')}]})); return saveState(getState()); };
export const updateSubject = (id,patch) => { updateState(s=>({...s,subjects:s.subjects.map(x=>x.id===id?{...x,...patch}:x)})); return saveState(getState()); };
export const deleteSubject = id => { updateState(s=>({...s,subjects:s.subjects.filter(x=>x.id!==id),tasks:s.tasks.map(t=>t.subjectId===id?{...t,subjectId:''}:t)})); return saveState(getState()); };
export const subjectStats = subjectId => { const tasks=getState().tasks.filter(t=>t.subjectId===subjectId); const completed=tasks.filter(t=>t.status==='Completed').length; return {total:tasks.length,completed,percent:tasks.length?Math.round(completed/tasks.length*100):0}; };
