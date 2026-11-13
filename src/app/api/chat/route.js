export const runtime='nodejs';
const fallback='The AI assistant is not active yet. Please send your project details using the enquiry form and our team will follow up.';
export async function POST(req){
 try{
  const body=await req.json();
  const messages=Array.isArray(body?.messages)?body.messages:[];
  if(!messages.length||messages.length>12)return Response.json({error:'Please send a shorter conversation.'},{status:400});
  const clean=messages.filter(m=>['user','assistant'].includes(m?.role)&&typeof m?.content==='string').map(m=>({role:m.role,content:m.content.slice(0,1800)}));
  if(!clean.length)return Response.json({error:'A message is required.'},{status:400});
  const key=process.env.OPENAI_API_KEY;
  if(!key)return Response.json({reply:fallback});
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),20000);
  try{
   const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',signal:controller.signal,headers:{'Content-Type':'application/json',Authorization:'Bearer '+key},body:JSON.stringify({model:'gpt-4o-mini',messages:[{role:'system',content:'You are Nexora Solutions project discovery assistant. Nexora builds websites, Flutter apps, AI assistants, automations, UI/UX and custom software. Be concise, practical and honest. Never invent prices, guarantees or client work. Ask about goals, users, features, integrations, timeline and budget. Never ask for passwords, payment details or confidential credentials. Encourage visitors to submit the project enquiry form.'},...clean],temperature:0.5,max_tokens:450})});
   const data=await response.json();if(!response.ok)return Response.json({reply:'The AI assistant is temporarily unavailable. Please use the project enquiry form.'});
   return Response.json({reply:data.choices?.[0]?.message?.content||'Tell me a little more about your project.'});
  }finally{clearTimeout(timer);}
 }catch{return Response.json({reply:'I could not process that message. Please use the project enquiry form.'},{status:200});}
}