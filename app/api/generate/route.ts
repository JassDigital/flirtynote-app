export const runtime = 'edge';

const allowedTones = new Set(['romantic','flirty','poetic','playful','sweet','cheesy']);
const allowedLengths = new Set(['Short','Medium','Long']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim().slice(0,60) : '';
    const tone = typeof body.tone === 'string' && allowedTones.has(body.tone) ? body.tone : 'romantic';
    const occasion = typeof body.occasion === 'string' ? body.occasion.trim().slice(0,60) : 'Just because';
    const length = typeof body.length === 'string' && allowedLengths.has(body.length) ? body.length : 'Medium';
    const signature = typeof body.signature === 'string' ? body.signature.trim().slice(0,50) : '';
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) return Response.json({error:'Mistral API key is not configured.'},{status:503});
    const recipient = name.replace(/[^\p{L}\p{N}\s.'-]/gu,'');
    const prompt = `Write a ${tone} romantic note for ${recipient || 'someone special'}. Occasion: ${occasion}. Length: ${length}. Be warm, tasteful, personal, and natural. Avoid clichés when possible. Do not mention being an AI. Return only the note text${signature ? ` and do not add a signature because the user will add: ${signature}` : ''}.`;
    const res = await fetch('https://api.mistral.ai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${apiKey}`},body:JSON.stringify({model:process.env.MISTRAL_MODEL||'mistral-small',messages:[{role:'user',content:prompt}],temperature:.9})});
    if(!res.ok) return Response.json({error:`Mistral API error: ${res.status}`},{status:502});
    const data=await res.json(); const message=data.choices?.[0]?.message?.content?.trim();
    if(!message) return Response.json({error:'The AI returned an empty message.'},{status:502});
    return Response.json({message});
  } catch { return Response.json({error:'Unable to create the note right now.'},{status:500}); }
}
