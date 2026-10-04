"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import {
  Copy, Download, Heart, History, Image as ImageIcon, Lightbulb,
  Loader2, MessageCircle, RefreshCw, Send, Settings2, Sparkles,
  Star, Trash2, WandSparkles, X
} from "lucide-react";

const tones = [
  ["romantic", "Romantic", "💖"], ["flirty", "Flirty", "😘"],
  ["poetic", "Poetic", "✨"], ["playful", "Playful", "😄"],
  ["sweet", "Sweet", "🌷"], ["cheesy", "Cheesy", "🧀"]
];
const occasions = ["Just because", "Good morning", "Good night", "Birthday", "Anniversary", "Missing you", "Thank you", "Date invitation"];
const lengths = ["Short", "Medium", "Long"];
const fonts: Record<string,string> = {
  script: "cursive", elegant: "Georgia, serif", modern: "Arial, sans-serif", mono: "ui-monospace, monospace"
};
const themes: Record<string,{name:string,bg:string,ink:string,accent:string}> = {
  rose: {name:"Rose", bg:"linear-gradient(135deg,#fff1f5,#ffe4ec)", ink:"#831843", accent:"#ec4899"},
  sunset: {name:"Sunset", bg:"linear-gradient(135deg,#fff7ed,#fed7aa)", ink:"#9a3412", accent:"#f97316"},
  lavender: {name:"Lavender", bg:"linear-gradient(135deg,#faf5ff,#ede9fe)", ink:"#6b21a8", accent:"#8b5cf6"},
  midnight: {name:"Midnight", bg:"linear-gradient(135deg,#172033,#312e81)", ink:"#fdf2f8", accent:"#c084fc"},
  cream: {name:"Cream", bg:"linear-gradient(135deg,#fffbeb,#fef3c7)", ink:"#78350f", accent:"#d97706"}
};
const fallback: Record<string,string[]> = {
  romantic: ["Every time you cross my mind, the day becomes a little brighter. I hope you know how wonderfully special you are to me."],
  flirty: ["I was going to play it cool, but then you smiled in my imagination again. So… when are we making that smile real?"],
  poetic: ["If thoughts could bloom, your name would be my favourite garden. Somehow, every quiet moment finds its way back to you."],
  playful: ["Important question: how are you this adorable without a permit? I think I need to investigate over coffee."],
  sweet: ["Just a little reminder that someone is thinking of you today—and smiling because of it. 💕"],
  cheesy: ["Are you made of sunshine? Because somehow you keep brightening every ordinary day. 🌞"]
};

type Note = { id:string; name:string; message:string; tone:string; occasion:string; theme:string; created:string; favorite:boolean };

export default function FlirtyNote() {
  const [name,setName]=useState("");
  const [tone,setTone]=useState("romantic");
  const [occasion,setOccasion]=useState("Just because");
  const [length,setLength]=useState("Medium");
  const [font,setFont]=useState("script");
  const [theme,setTheme]=useState("rose");
  const [signature,setSignature]=useState("");
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [history,setHistory]=useState<Note[]>([]);
  const [showHistory,setShowHistory]=useState(false);
  const [showOptions,setShowOptions]=useState(false);
  const [copied,setCopied]=useState(false);
  const cardRef=useRef<HTMLDivElement>(null);

  useEffect(()=>{ try { setHistory(JSON.parse(localStorage.getItem("flirtynote-history")||"[]")); } catch {} },[]);
  useEffect(()=>{ localStorage.setItem("flirtynote-history",JSON.stringify(history.slice(0,30))); },[history]);

  const fullMessage = useMemo(()=> signature.trim() ? `${message}\n\n— ${signature.trim()}` : message,[message,signature]);
  const currentTheme=themes[theme];

  const generateMessage=async()=>{
    setLoading(true); setCopied(false);
    try {
      const res=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,tone,occasion,length,signature})});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error||"Generation failed");
      setMessage(data.message||fallback[tone][0]);
    } catch {
      const base=fallback[tone]?.[0]||fallback.romantic[0];
      setMessage(name ? base.replace(/you|your/gi,m=>m.toLowerCase()).replace(/^/,`Dear ${name}, `) : base);
    } finally { setLoading(false); }
  };

  const saveNote=()=>{
    if(!message.trim()) return;
    setHistory(h=>[{id:crypto.randomUUID(),name,message,tone,occasion,theme,created:new Date().toISOString(),favorite:false},...h]);
  };
  const copyMessage=async()=>{ await navigator.clipboard.writeText(fullMessage); setCopied(true); setTimeout(()=>setCopied(false),1600); };
  const downloadCard=async()=>{
    if(!cardRef.current) return;
    const canvas=await html2canvas(cardRef.current,{scale:2,backgroundColor:null,useCORS:true});
    const link=document.createElement("a"); link.download=`flirtynote-${(name||"note").replace(/[^a-z0-9]+/gi,"-").toLowerCase()}.png`; link.href=canvas.toDataURL("image/png"); link.click();
  };
  const share=()=>{ const text=encodeURIComponent(fullMessage); window.open(`https://wa.me/?text=${text}`,"_blank","noopener,noreferrer"); };
  const surprise=()=>{ const t=tones[Math.floor(Math.random()*tones.length)][0]; const o=occasions[Math.floor(Math.random()*occasions.length)]; setTone(t); setOccasion(o); generateMessage(); };

  return <main className="min-h-screen overflow-hidden">
    <div className="ambient ambient-one"/><div className="ambient ambient-two"/>
    <header className="site-header">
      <div className="brand"><div className="brand-mark"><Heart fill="currentColor"/></div><div><div className="brand-name">FlirtyNote<span>.ai</span></div><div className="brand-sub">little words · big feelings</div></div></div>
      <button className="ghost-button" onClick={()=>setShowHistory(true)}><History size={17}/> My Notes <span className="count">{history.length}</span></button>
    </header>

    <section className="hero">
      <div className="hero-copy"><div className="eyebrow"><Sparkles size={15}/> YOUR PERSONAL NOTE STUDIO</div><h1>Say it beautifully.</h1><p>Turn a feeling into a note worth saving, sharing, and remembering.</p>
        <div className="hero-pills"><span>💌 Personal</span><span>✨ AI-assisted</span><span>🔒 Your history stays in your browser</span></div>
      </div>
    </section>

    <section className="studio">
      <div className="composer panel">
        <div className="panel-heading"><div><div className="section-kicker">CREATE A NOTE</div><h2>What do you want to say?</h2></div><button className="icon-button" title="Surprise me" onClick={surprise}><WandSparkles size={18}/></button></div>
        <label>Recipient <span>optional</span><input value={name} onChange={e=>setName(e.target.value)} placeholder="Their name…" maxLength={60}/></label>
        <div className="field-grid"><label>Tone<select value={tone} onChange={e=>setTone(e.target.value)}>{tones.map(([v,n,i])=><option key={v} value={v}>{i} {n}</option>)}</select></label><label>Occasion<select value={occasion} onChange={e=>setOccasion(e.target.value)}>{occasions.map(x=><option key={x}>{x}</option>)}</select></label></div>
        <div className="tone-row">{tones.map(([v,n,i])=><button key={v} className={`tone-chip ${tone===v?"active":""}`} onClick={()=>setTone(v)}>{i} {n}</button>)}</div>
        <button className="generate" onClick={generateMessage} disabled={loading}>{loading?<Loader2 className="spin" size={20}/>:<Heart size={20} fill="currentColor"/>}{loading?"Creating your note…":"Create my note"}</button>
        <button className="advanced" onClick={()=>setShowOptions(!showOptions)}><Settings2 size={16}/> Personalize card <span>{showOptions?"⌃":"⌄"}</span></button>
        {showOptions && <div className="options-box"><label>Length<select value={length} onChange={e=>setLength(e.target.value)}>{lengths.map(x=><option key={x}>{x}</option>)}</select></label><label>Card style<select value={theme} onChange={e=>setTheme(e.target.value)}>{Object.entries(themes).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}</select></label><label>Letter style<select value={font} onChange={e=>setFont(e.target.value)}><option value="script">Handwritten</option><option value="elegant">Elegant</option><option value="modern">Modern</option><option value="mono">Typewriter</option></select></label><label>Signature <span>optional</span><input value={signature} onChange={e=>setSignature(e.target.value)} placeholder="Your name…" maxLength={50}/></label></div>}
      </div>

      <div className="preview panel">
        <div className="panel-heading"><div><div className="section-kicker">LIVE PREVIEW</div><h2>Your little masterpiece</h2></div>{message&&<button className="icon-button" title="New version" onClick={generateMessage}><RefreshCw size={18}/></button>}</div>
        <div ref={cardRef} className="note-card" style={{background:currentTheme.bg,color:currentTheme.ink,fontFamily:fonts[font]}}>
          <div className="card-decoration">✦</div>
          {message ? <><div className="to-line">{name?`For ${name}`:"For someone special"}</div><div className="note-message">{message}</div>{signature&&<div className="signature">— {signature}</div>}</> : <div className="empty-note"><Heart size={34}/><strong>Your note will appear here</strong><span>Choose a tone and let the words flow.</span></div>}
          <div className="card-footer">made with <Heart size={13} fill="currentColor"/> FlirtyNote</div>
        </div>
        {message && <div className="actions"><button onClick={copyMessage}><Copy size={17}/>{copied?"Copied!":"Copy"}</button><button onClick={downloadCard}><ImageIcon size={17}/>Save card</button><button onClick={share} className="whatsapp"><MessageCircle size={17}/>WhatsApp</button><button onClick={saveNote} className="save"><Star size={17}/>Save note</button></div>}
        {!message&&<div className="tip"><Lightbulb size={17}/><span><strong>Tip:</strong> A specific memory makes a note feel personal. Try “the way you smiled at breakfast”.</span></div>}
      </div>
    </section>

    <footer>FlirtyNote.ai · crafted for thoughtful messages, playful moments, and genuine connection.</footer>

    {showHistory && <div className="modal-backdrop" onClick={()=>setShowHistory(false)}><aside className="history-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><div><div className="section-kicker">YOUR COLLECTION</div><h2>Saved notes</h2></div><button className="icon-button" onClick={()=>setShowHistory(false)}><X size={18}/></button></div>{history.length===0?<div className="history-empty"><Heart size={32}/><p>No saved notes yet.</p><span>Create something lovely and tap Save note.</span></div>:<div className="history-list">{history.map(n=><div className="history-item" key={n.id}><div className="history-meta">{n.occasion} · {n.tone}</div><p>{n.message}</p><div className="history-actions"><button onClick={()=>{setMessage(n.message);setName(n.name);setTone(n.tone);setOccasion(n.occasion);setTheme(n.theme);setShowHistory(false)}}>Open</button><button onClick={()=>setHistory(h=>h.filter(x=>x.id!==n.id))}><Trash2 size={14}/></button></div></div>)}</div>}</aside></div>}
  </main>;
}
