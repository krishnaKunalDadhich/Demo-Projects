const schemas = {
  next_action:{type:'object',properties:{type:{type:'string'},title:{type:'string'},reason:{type:'string'},duration:{type:'number'},priority:{type:'string'},nextStep:{type:'string'}},required:['type','title','reason','duration','priority','nextStep'],additionalProperties:false},
  daily_plan:{type:'object',properties:{type:{type:'string'},title:{type:'string'},blocks:{type:'array',items:{type:'object',properties:{start:{type:'string'},end:{type:'string'},subject:{type:'string'},task:{type:'string'}},required:['start','end','subject','task'],additionalProperties:false}},note:{type:'string'}},required:['type','title','blocks','note'],additionalProperties:false},
  breakdown:{type:'object',properties:{type:{type:'string'},title:{type:'string'},steps:{type:'array',items:{type:'string'}}},required:['type','title','steps'],additionalProperties:false},
  weekly_review:{type:'object',properties:{type:{type:'string'},title:{type:'string'},strength:{type:'string'},weakness:{type:'string'},pattern:{type:'string'},recommendation:{type:'string'}},required:['type','title','strength','weakness','pattern','recommendation'],additionalProperties:false}
};

const instructions='You are FocusOS AI Coach, a practical academic productivity coach. Analyze ONLY the supplied FocusOS data. Do not invent tasks, deadlines, classes, exams, study history, or available time. Prefer concrete, realistic recommendations. Respect existing planner commitments and avoid over-scheduling. Keep recommendations concise. Return JSON matching the requested schema.';

function promptFor(operation,context,taskId){
  const task=taskId?context.tasks.find(t=>t.id===taskId):null;
  const request={
    next_action:'Choose the single best next action for the student right now. Prefer urgent/overdue or deadline-near work, but consider status, priority, planner conflicts, and focus history. Duration must be 15-60 minutes.',
    daily_plan:'Create a realistic study plan for today using only actual pending tasks and planner information. Use 2-5 study blocks and leave sensible gaps. Do not schedule over fixed planner items.',
    breakdown:`Break down this real task into 3-7 concrete academic subtasks. Task: ${JSON.stringify(task)}`,
    weekly_review:'Analyze the recent productivity data and identify one evidence-based strength, weakness, pattern, and recommendation. Do not invent causal explanations.'
  }[operation];
  return `${instructions}\n\nOperation: ${operation}\n${request}\n\nFocusOS data:\n${JSON.stringify(context)}`;
}

export async function runAI(operation,context,taskId=''){
  if(!process.env.AI_API_KEY){const e=new Error('AI Coach is not configured. Add AI_API_KEY to the server environment.');e.status=503;throw e;}
  const response=await fetch('https://api.openai.com/v1/responses',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${process.env.AI_API_KEY}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-6-luna',input:promptFor(operation,context,taskId),text:{format:{type:'json_schema',name:`focusos_${operation}`,strict:true,schema:schemas[operation]}},max_output_tokens:900})});
  const payload=await response.json().catch(()=>({}));
  if(!response.ok){const e=new Error(response.status===429?'AI Coach is rate-limited. Please try again shortly.':'AI Coach is temporarily unavailable.');e.status=response.status;throw e;}
  const text=payload.output_text||payload.output?.flatMap(x=>x.content||[]).find(x=>x.type==='output_text')?.text;
  if(!text)throw new Error('AI returned an empty response.');
  try{return JSON.parse(text);}catch{throw new Error('AI returned an invalid response.');}
}

export { schemas };
