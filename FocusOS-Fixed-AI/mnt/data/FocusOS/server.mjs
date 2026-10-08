import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runAI, schemas } from './api/ai-core.mjs';

const root=path.dirname(fileURLToPath(import.meta.url));
const port=Number(process.env.PORT||5500);
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
async function loadLocalEnv(){
  try{
    const raw=await fs.readFile(path.join(root,'.env'),'utf8');
    for(const line of raw.split(/\r?\n/)){
      const trimmed=line.trim();
      if(!trimmed||trimmed.startsWith('#')) continue;
      const index=trimmed.indexOf('='); if(index<0) continue;
      const key=trimmed.slice(0,index).trim(); let value=trimmed.slice(index+1).trim();
      value=value.replace(/^['"]|['"]$/g,'');
      if(key&&!process.env[key]) process.env[key]=value;
    }
  }catch(error){ if(error.code!=='ENOENT') console.warn('Could not read .env:',error.message); }
}


const sendJSON=(res,status,payload)=>{res.writeHead(status,{'Content-Type':'application/json'});res.end(JSON.stringify(payload));};

async function handleAI(req,res){
  let body=''; for await(const chunk of req) body+=chunk;
  try{
    const {operation,context,taskId=''}=JSON.parse(body||'{}');
    if(!schemas[operation]||!context||typeof context!=='object')return sendJSON(res,400,{error:'Invalid AI request.'});
    const result=await runAI(operation,context,taskId);
    return sendJSON(res,200,{result});
  }catch(error){console.error('AI route failed:',error?.message||error);return sendJSON(res,error.status||500,{error:error.message||'AI Coach is temporarily unavailable.'});}
}

const server=http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/api/ai')return handleAI(req,res);
  try{
    let pathname=decodeURIComponent(req.url.split('?')[0]);if(pathname==='/')pathname='/index.html';
    const file=path.resolve(root,'.'+pathname);if(!file.startsWith(path.resolve(root)))throw new Error('Forbidden');
    const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(data);
  }catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');}
});
await loadLocalEnv();
server.listen(port,()=>console.log(`FocusOS running at http://localhost:${port}`));
