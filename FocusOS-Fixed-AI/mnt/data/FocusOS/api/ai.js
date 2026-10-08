import { runAI, schemas } from './ai-core.mjs';

export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed.'});
  try{
    const {operation,context,taskId=''}=req.body||{};
    if(!schemas[operation]||!context||typeof context!=='object')return res.status(400).json({error:'Invalid AI request.'});
    const result=await runAI(operation,context,taskId);
    return res.status(200).json({result});
  }catch(error){
    console.error('AI route failed:',error?.message||error);
    return res.status(error.status||500).json({error:error.message||'AI Coach is temporarily unavailable.'});
  }
}
