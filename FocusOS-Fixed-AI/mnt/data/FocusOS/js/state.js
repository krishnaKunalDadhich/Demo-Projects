import { todayISO } from './utils.js';
export const demoState = () => ({
  tasks:[
    {id:'t1',title:'Complete Java inheritance assignment',subjectId:'s1',category:'Assignment',priority:'High',status:'Completed',dueDate:todayISO(),notes:'Submit before 8 PM.'},
    {id:'t2',title:'DBMS normalization revision',subjectId:'s2',category:'Study',priority:'Medium',status:'In Progress',dueDate:todayISO(),notes:'Practice 3NF examples.'},
    {id:'t3',title:'Prepare CN subnetting notes',subjectId:'s3',category:'Study',priority:'High',status:'Pending',dueDate:new Date(Date.now()+86400000).toISOString().slice(0,10),notes:''},
    {id:'t4',title:'OS scheduling MCQ practice',subjectId:'s4',category:'Practice',priority:'Medium',status:'Pending',dueDate:new Date(Date.now()+2*86400000).toISOString().slice(0,10),notes:''},
    {id:'t5',title:'Build portfolio project section',subjectId:'s5',category:'Project',priority:'Low',status:'Pending',dueDate:new Date(Date.now()+4*86400000).toISOString().slice(0,10),notes:''},
    {id:'t6',title:'Revise Java collections',subjectId:'s1',category:'Study',priority:'Urgent',status:'Pending',dueDate:new Date(Date.now()-86400000).toISOString().slice(0,10),notes:'Focus on HashMap and Set.'},
    {id:'t7',title:'Create DBMS ER diagram',subjectId:'s2',category:'Assignment',priority:'Low',status:'Completed',dueDate:new Date(Date.now()-2*86400000).toISOString().slice(0,10),notes:''}
  ],
  subjects:[
    {id:'s1',name:'Java Programming',code:'JAVA',teacher:'Dr. Sharma',icon:'J'},
    {id:'s2',name:'Database Management',code:'DBMS',teacher:'Prof. Mehta',icon:'D'},
    {id:'s3',name:'Computer Networks',code:'CN',teacher:'Dr. Khan',icon:'C'},
    {id:'s4',name:'Operating Systems',code:'OS',teacher:'Prof. Joshi',icon:'O'},
    {id:'s5',name:'Web Development',code:'WEB',teacher:'Ms. Rao',icon:'W'}
  ],
  schedule:[
    {id:'p1',title:'Java Lab',start:'09:00',end:'10:00',category:'Class',status:'Done'},
    {id:'p2',title:'DBMS revision',start:'11:30',end:'12:15',category:'Study',status:'Planned'},
    {id:'p3',title:'Lunch / reset',start:'13:00',end:'14:00',category:'Break',status:'Planned'},
    {id:'p4',title:'FocusOS development',start:'19:30',end:'20:30',category:'Project',status:'Planned'}
  ],
  focusSessions:[
    {id:'f1',date:todayISO(),minutes:50,mode:'Focus',completed:true},
    {id:'f2',date:todayISO(),minutes:75,mode:'Focus',completed:true},
    {id:'f3',date:new Date(Date.now()-86400000).toISOString().slice(0,10),minutes:50,mode:'Focus',completed:true}
  ],
  settings:{theme:'light',demo:true,notifications:false},
  statistics:{},
  focus:{mode:'Focus',remaining:1500,initialDuration:1500,running:false,sessionCount:0,cycle:1}
});

let state = demoState();
export const getState = () => state;
export const replaceState = next => { state = next; return state; };
export const updateState = updater => { state = typeof updater==='function' ? updater(state) : {...state,...updater}; return state; };
