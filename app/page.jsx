'use client';
import { useState, useEffect, useCallback } from "react";

const CK = {
  PA:{l:"APH Tube",f:"APH TUBE BS 6323 PART V",c:"#3b82f6"},
  PB:{l:"ERW Boiler Tube",f:"ERW BOILER TUBE BS 3059 PT I GR 320 IBR",c:"#ef4444"},
  PC:{l:"Corten Steel Tube",f:"CORTEN STEEL TUBE A 423 GR 1",c:"#f97316"},
  PD:{l:"ERW Boiler PT II",f:"ERW BOILER TUBE BS 3059 PT II GR 360 IBR",c:"#ec4899"},
  PE:{l:"CDW Boiler Tube",f:"CDW BOILER TUBE BS 3059 PT I GR 320 IBR",c:"#8b5cf6"},
  PF:{l:"ERW Black Pipe (Mtr)",f:"ERW BLACK PIPE IS 1239 (MTR)",c:"#6366f1"},
  PFI:{l:"ERW Black Pipe (Kg)",f:"ERW BLACK PIPE IS 1239 (KG)",c:"#818cf8"},
  PG:{l:"GI Pipe",f:"GI PIPE IS 1239",c:"#14b8a6"},
  PH:{l:"ERW Black Pipe 3589",f:"ERW BLACK PIPE IS 3589",c:"#0ea5e9"},
  PI:{l:"Spiral Welded",f:"SPIRAL WELDED PIPE IS 3589",c:"#06b6d4"},
  PJ:{l:"CS Seamless SA 106",f:"CS SEAMLESS PIPE SA 106 GR B",c:"#22c55e"},
  PK:{l:"LTCS Seamless SA 333",f:"LTCS SEAMLESS PIPE SA 333 GR 6",c:"#84cc16"},
  PL:{l:"AS Seamless P11",f:"AS SEAMLESS PIPE SA 335 P11",c:"#f43f5e"},
  PM:{l:"AS Seamless P22",f:"AS SEAMLESS PIPE SA 335 P22",c:"#e11d48"},
  PN:{l:"AS Seamless P91",f:"AS SEAMLESS PIPE SA 335 P91",c:"#be123c"},
  PO:{l:"CS SMLS Boiler Tube",f:"CS SMLS BOILER TUBE BS 3059 PT II GR 360",c:"#d946ef"},
  PP:{l:"CS SMLS Boiler SA210 A1",f:"CS SMLS BOILER TUBE SA 210 GR A1",c:"#c026d3"},
  PQ:{l:"AS SMLS Boiler T11",f:"AS SMLS BOILER TUBE SA 213 T11",c:"#a21caf"},
  PR:{l:"AS SMLS Boiler T22",f:"AS SMLS BOILER TUBE SA 213 T22",c:"#86198f"},
  PS:{l:"AS SMLS Boiler T91",f:"AS SMLS BOILER TUBE SA 213 T91",c:"#701a75"},
  PT:{l:"CS SMLS Boiler SA210 C",f:"CS SMLS BOILER TUBE SA 210 GR C",c:"#9333ea"},
  PU:{l:"Heat Exchanger SA 179",f:"HEAT EXCHANGER TUBE SA 179",c:"#7c3aed"},
  PV:{l:"Heat Exchanger SA 192",f:"HEAT EXCHANGER TUBE SA 192",c:"#6d28d9"},
  PW:{l:"Seamless Bares DIN",f:"SEAMLESS BARES PIPE DIN ST 52",c:"#4f46e5"},
  P304S:{l:"304 Seamless (Mtr)",f:"304 SEAMLESS (MTR)",c:"#0891b2"},
  P304S1:{l:"304 Seamless (Kg)",f:"304 SEAMLESS (KG)",c:"#0891b2"},
  P304E:{l:"304 ERW (Mtr)",f:"304 ERW (MTR)",c:"#0e7490"},
  P304E1:{l:"304 ERW (Kg)",f:"304 ERW (KG)",c:"#0e7490"},
  P316S:{l:"316 Seamless (Mtr)",f:"316 SEAMLESS (MTR)",c:"#155e75"},
  P316S1:{l:"316 Seamless (Kg)",f:"316 SEAMLESS (KG)",c:"#155e75"},
  P316E:{l:"316 ERW (Mtr)",f:"316 ERW (MTR)",c:"#164e63"},
  P316E1:{l:"316 ERW (Kg)",f:"316 ERW (KG)",c:"#164e63"},
};
const GRADES = Object.entries(CK).map(([p, v]) => ({ prefix: p, ...v }));

function Setup({ onConnect }) {
  const [url, setUrl] = useState(""); const [loading, setLoading] = useState(false); const [err, setErr] = useState("");
  const getId = (s) => { const m = s.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/); return m ? m[1] : /^[a-zA-Z0-9_-]{20,}$/.test(s.trim()) ? s.trim() : null; };
  const go = async () => {
    const id = getId(url); if (!id) { setErr("Paste the full Google Sheet link."); return; }
    setLoading(true); setErr("");
    try { const r = await fetch(`/api/stock?sheetId=${id}`); const d = await r.json(); if (d.error) { setErr(d.error); setLoading(false); return; } localStorage.setItem("mtube-sid", id); window.history.replaceState({}, "", `?sheetId=${id}`); onConnect(id, d); } catch { setErr("Connection failed."); }
    setLoading(false);
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,padding:24 }}>
      <div style={{ fontSize:48,marginBottom:16 }}>🔗</div>
      <div style={{ fontSize:20,fontWeight:800,marginBottom:6,textAlign:"center" }}>Connect Google Sheet</div>
      <div style={{ fontSize:13,color:"#6b7a90",marginBottom:16,textAlign:"center",maxWidth:340 }}>One-time setup. Share the URL with your team after connecting.</div>
      <div style={{ width:"100%",maxWidth:380,background:"rgba(255,255,255,0.03)",borderRadius:12,padding:16,marginBottom:16,border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:13,fontWeight:700,color:"#f59e0b",marginBottom:10 }}>Setup steps:</div>
        <div style={{ fontSize:12,color:"#9ca3af",lineHeight:1.8 }}>1. Open <b style={{color:"#e8eaf0"}}>Google Sheets</b> → new spreadsheet<br/>2. <b style={{color:"#e8eaf0"}}>File → Import → Upload</b> Spectrum Excel<br/>3. <b style={{color:"#e8eaf0"}}>"Replace spreadsheet"</b> → Import<br/>4. <b style={{color:"#e8eaf0"}}>Share</b> → "Anyone with the link" → Viewer<br/>5. <b style={{color:"#e8eaf0"}}>Copy link</b> → paste below ↓</div>
      </div>
      <div style={{ width:"100%",maxWidth:380 }}>
        <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="Paste Google Sheet link..." style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e8eaf0",fontSize:13,outline:"none",marginBottom:10,boxSizing:"border-box" }} onKeyDown={e=>e.key==="Enter"&&go()} />
        <button onClick={go} disabled={loading||!url.trim()} style={{ width:"100%",padding:12,borderRadius:10,border:"none",background:url.trim()?"linear-gradient(135deg,#f59e0b,#d97706)":"rgba(255,255,255,0.06)",color:url.trim()?"#0a0f1a":"#6b7a90",fontWeight:700,fontSize:15,cursor:url.trim()?"pointer":"default" }}>{loading?"Connecting...":"Connect & Load Stock"}</button>
      </div>
      {err&&<div style={{ marginTop:14,padding:"10px 16px",borderRadius:10,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",color:"#ef4444",fontSize:12,maxWidth:380,textAlign:"center" }}>{err}</div>}
    </div>
  );
}

function ItemRow({ item, color, hasStores }) {
  const p = item.desc.match(/^(\d+\.?\d*)\s*OD\s*X\s*(\d+\.?\d*)\s*THK\s*(.*)$/i);
  return (
    <div style={{ padding:"10px 14px",borderRadius:8,background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.05)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <div style={{ minWidth:0 }}>
        {hasStores && <div style={{ fontSize:9,color:"#f59e0b",fontWeight:700,marginBottom:3,fontFamily:"monospace",background:"rgba(245,158,11,0.1)",display:"inline-block",padding:"1px 6px",borderRadius:3 }}>GD {item.store}</div>}
        <div style={{ fontSize:13,fontWeight:600,fontFamily:"monospace",display:"flex",gap:4,flexWrap:"wrap",alignItems:"baseline" }}>
          {p?(<><span style={{color}}>{p[1]}</span><span style={{color:"#6b7a90",fontSize:11}}> OD × </span><span style={{color:"#e8eaf0"}}>{p[2]}</span><span style={{color:"#6b7a90",fontSize:11}}> THK </span><span style={{color:"#6b7a90",fontSize:11}}>{p[3]}</span></>):<span>{item.desc}</span>}
        </div>
        <div style={{ fontSize:10,color:"#4a5568",marginTop:3,fontFamily:"monospace" }}>{item.code}</div>
      </div>
      <div style={{ textAlign:"right",flexShrink:0,paddingLeft:12 }}>
        <div style={{ fontSize:15,fontWeight:800,color:item.mtr>0?color:"#ef4444",fontFamily:"monospace" }}>{item.mtr>0?`${item.mtr.toLocaleString()} Mtr`:"NIL"}</div>
        <div style={{ fontSize:10,color:"#6b7a90" }}>{item.mtr>0?`${item.nos.toLocaleString()} Nos`:""}</div>
        {item.rate>0&&<div style={{ fontSize:11,fontWeight:700,color:"#f59e0b",fontFamily:"monospace",marginTop:3 }}>Avg Cost ₹{item.rate.toLocaleString()}/Mtr</div>}
      </div>
    </div>
  );
}

function Browser({ data, onRefresh, onReset, refreshing }) {
  const [scr, setScr] = useState("grades");
  const [grade, setGrade] = useState(null);
  const [od, setOd] = useState(null);
  const [filter, setFilter] = useState("");
  const [sizeMode, setSizeMode] = useState(false);
  const [sizeQ, setSizeQ] = useState("");
  const [store, setStore] = useState("ALL");

  const { items: all, reportDate, stores = [], hasStores } = data;
  const items = store === "ALL" ? all : all.filter(i => i.store === store);
  const gi = (p) => items.filter(i => i.prefix === p);
  const gs = (p) => { const g = gi(p); return { n: g.length, m: g.reduce((s,i) => s+i.mtr, 0) }; };

  const pickGrade = (g) => {
    setGrade(g); const g2 = gi(g.prefix);
    const ods = [...new Set(g2.map(i => { const m = i.desc.match(/^(\d+\.?\d*)\s*OD/); return m?parseFloat(m[1]):null; }).filter(Boolean))].sort((a,b)=>a-b);
    if (g2.length===0||ods.length<=1) { setOd(null); setScr("items"); } else setScr("sizes");
  };
  const back = () => { if (scr==="items"&&od) { setOd(null); setScr("sizes"); } else { setGrade(null); setOd(null); setScr("grades"); setFilter(""); setSizeQ(""); setSizeMode(false); } };

  const cur = grade ? gi(grade.prefix) : [];
  const ods = [...new Set(cur.map(i => { const m = i.desc.match(/^(\d+\.?\d*)\s*OD/); return m?parseFloat(m[1]):null; }).filter(Boolean))].sort((a,b)=>a-b);
  const disp = od ? cur.filter(i => { const m = i.desc.match(/^(\d+\.?\d*)/); return m&&Math.abs(parseFloat(m[1])-od)<0.01; }) : cur;

  const sRes = sizeMode&&sizeQ.trim() ? items.filter(i => {
    const q = sizeQ.toLowerCase().replace(/x/g," ").trim(); const nums = q.match(/\d+\.?\d*/g);
    if (nums&&nums.length>0) return nums.every(n => { const d=i.desc.toLowerCase(); const re=new RegExp(n.replace(".","\\."));if(re.test(d))return true;const nf=parseFloat(n);const om=d.match(/(\d+\.?\d*)\s*od/);if(om&&Math.abs(parseFloat(om[1])-nf)<0.5)return true;const tm=d.match(/(\d+\.?\d*)\s*thk/);if(tm&&Math.abs(parseFloat(tm[1])-nf)<0.1)return true;return false;});
    return `${i.desc} ${i.cat} ${i.code}`.toLowerCase().includes(q);
  }) : [];

  const fg = filter ? GRADES.filter(g => g.l.toLowerCase().includes(filter.toLowerCase())||g.f.toLowerCase().includes(filter.toLowerCase())||g.prefix.toLowerCase()===filter.toLowerCase()) : GRADES;
  const inS = fg.filter(g => gs(g.prefix).n>0), noS = fg.filter(g => gs(g.prefix).n===0);
  const tM = disp.reduce((s,i)=>s+i.mtr,0), tN = disp.reduce((s,i)=>s+i.nos,0), tV = disp.reduce((s,i)=>s+i.val,0);
  const gc = grade?(CK[grade.prefix]?.c||"#f59e0b"):"#f59e0b";

  const pill = (active, label, onClick) => ({ padding:"6px 14px",borderRadius:20,border:active?"1px solid #f59e0b":"1px solid rgba(255,255,255,0.1)",background:active?"rgba(245,158,11,0.15)":"transparent",color:active?"#f59e0b":"#6b7a90",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" });

  return (<>
    {/* Header */}
    <div style={{ background:"linear-gradient(135deg,#0d1b2a,#1b2d45)",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.06)",flexShrink:0 }}>
      {scr!=="grades"&&<button onClick={back} style={{ background:"rgba(255,255,255,0.06)",border:"none",color:"#f59e0b",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>}
      <div style={{ width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#0a0f1a",flexShrink:0 }}>MT</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontWeight:700,fontSize:15 }}>{scr==="grades"?"Mtube Stock":scr==="sizes"?grade?.l:od?`${grade?.l} — ${od} OD`:grade?.l}</div>
        <div style={{ fontSize:11,color:"#6b7a90",marginTop:1 }}>{scr==="grades"?`${items.length} items • ${reportDate||"—"}${store!=="ALL"?` • GD ${store}`:""}`:scr==="sizes"?`${cur.length} items — Select OD`:`${disp.length} items • ${tM.toLocaleString(undefined,{maximumFractionDigits:1})} Mtr`}</div>
      </div>
      {scr==="grades"&&<div style={{display:"flex",gap:6}}>
        <button onClick={onRefresh} disabled={refreshing} style={{ background:"rgba(255,255,255,0.06)",border:"none",color:refreshing?"#4a5568":"#22c55e",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700 }}>{refreshing?"...":"↻"}</button>
        <button onClick={onReset} style={{ background:"rgba(255,255,255,0.06)",border:"none",color:"#6b7a90",padding:"6px 10px",borderRadius:8,cursor:"pointer",fontSize:11 }}>⚙</button>
      </div>}
    </div>

    {/* Godown pills */}
    {hasStores&&stores.length>0&&scr==="grades"&&(
      <div style={{ padding:"8px 12px",display:"flex",gap:6,overflowX:"auto",borderBottom:"1px solid rgba(255,255,255,0.04)",flexShrink:0,background:"rgba(255,255,255,0.015)" }}>
        <button onClick={()=>setStore("ALL")} style={pill(store==="ALL")}>All Godowns</button>
        {stores.map(s=>{const n=all.filter(i=>i.store===s).length;return(<button key={s} onClick={()=>setStore(s)} style={pill(store===s)}>{s} <span style={{fontSize:10,opacity:0.7}}>({n})</span></button>);})}
      </div>
    )}

    {/* Content */}
    <div style={{ flex:1,overflowY:"auto",padding:12 }}>

      {scr==="grades"&&(<>
        {/* By Grade / By Size toggle */}
        <div style={{ display:"flex",gap:2,marginBottom:10,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:3 }}>
          {[{k:false,l:"By Grade"},{k:true,l:"By Size"}].map(t=>(<button key={String(t.k)} onClick={()=>{setSizeMode(t.k);setFilter("");setSizeQ("");}} style={{ flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:sizeMode===t.k?"rgba(245,158,11,0.12)":"transparent",color:sizeMode===t.k?"#f59e0b":"#6b7a90" }}>{t.l}</button>))}
        </div>

        {!sizeMode?(<>
          <div style={{marginBottom:10}}><input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Filter grades..." style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e8eaf0",fontSize:14,outline:"none",boxSizing:"border-box" }}/></div>
          <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#f59e0b" }}>In Stock ({inS.length})</div>
          <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
            {inS.map(g=>{const s=gs(g.prefix);return(
              <button key={g.prefix} onClick={()=>pickGrade(g)} style={{ border:`1px solid ${g.c}22`,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"monospace",fontWeight:800,fontSize:13,color:g.c,background:`${g.c}15`,padding:"2px 8px",borderRadius:5}}>{g.prefix}</span><span style={{fontSize:14,fontWeight:600,color:"#e8eaf0"}}>{g.l}</span></div><div style={{fontSize:11,color:"#6b7a90",marginTop:4,paddingLeft:2}}>{g.f}</div></div>
                <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:g.c,fontFamily:"monospace"}}>{s.m.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style={{fontSize:10,color:"#6b7a90"}}>Mtr • {s.n} sizes</div></div>
              </button>
            );})}
          </div>
          {noS.length>0&&(<><div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#6b7a90" }}>No Current Stock ({noS.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>{noS.map(g=>(<div key={g.prefix} style={{padding:"8px 14px",borderRadius:10,background:"rgba(255,255,255,0.015)",border:"1px solid rgba(255,255,255,0.04)",display:"flex",justifyContent:"space-between",alignItems:"center",opacity:0.5}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#6b7a90"}}>{g.prefix}</span><span style={{fontSize:13,color:"#6b7a90"}}>{g.l}</span></div><span style={{fontSize:11,color:"#4a5568",fontStyle:"italic"}}>NIL</span></div>))}</div></>)}
        </>):(
          <>
            <div style={{marginBottom:10}}><input value={sizeQ} onChange={e=>setSizeQ(e.target.value)} placeholder="Search size... e.g. 63.50 x 3.25 or 88.90" style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.04)",color:"#e8eaf0",fontSize:14,outline:"none",boxSizing:"border-box" }} autoFocus/></div>
            {sizeQ.trim()?(sRes.length>0?(<div style={{display:"flex",flexDirection:"column",gap:6}}><div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#22c55e"}}>Found {sRes.length} items</div>{sRes.map(i=><ItemRow key={i.code+i.store} item={i} color={CK[i.prefix]?.c||"#6b7a90"} hasStores={hasStores}/>)}</div>):(<div style={{padding:30,textAlign:"center",borderRadius:12,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)"}}><div style={{fontSize:28,marginBottom:8}}>🔍</div><div style={{fontSize:14,fontWeight:600,color:"#ef4444"}}>No items found</div></div>)):(<div style={{padding:20,textAlign:"center",color:"#6b7a90",fontSize:13}}>Type a size to search. e.g. "63.50" or "88.90 x 5.49"</div>)}
          </>
        )}
      </>)}

      {scr==="sizes"&&grade&&(cur.length===0?(<div style={{padding:30,textAlign:"center",borderRadius:12,background:"rgba(239,68,68,0.06)",border:"1px solid rgba(239,68,68,0.15)",marginTop:20}}><div style={{fontSize:36,marginBottom:10}}>📭</div><div style={{fontSize:16,fontWeight:700,color:"#ef4444"}}>No Stock</div></div>):(<>
        <button onClick={()=>{setOd(null);setScr("items");}} style={{border:`1px solid ${gc}30`,background:`${gc}10`,borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"center",width:"100%",marginBottom:10}}><div style={{fontSize:14,fontWeight:700,color:gc}}>📋 View All {cur.length} Sizes</div><div style={{fontSize:11,color:"#6b7a90",marginTop:2}}>Total: {cur.reduce((s,i)=>s+i.mtr,0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div></button>
        <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8,padding:"0 4px",color:"#6b7a90"}}>Select OD Size</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{ods.map(o=>{const oi=cur.filter(i=>{const m=i.desc.match(/^(\d+\.?\d*)/);return m&&Math.abs(parseFloat(m[1])-o)<0.01;});return(<button key={o} onClick={()=>{setOd(o);setScr("items");}} style={{border:`1px solid ${gc}22`,background:"rgba(255,255,255,0.03)",borderRadius:10,padding:"10px 16px",cursor:"pointer",textAlign:"center",minWidth:90}}><div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{o}</div><div style={{fontSize:10,color:"#6b7a90",marginTop:3}}>{oi.length} • {oi.reduce((s,i)=>s+i.mtr,0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div></button>);})}</div>
      </>))}

      {scr==="items"&&grade&&(<div style={{display:"flex",flexDirection:"column",gap:6}}>
        {/* Summary */}
        <div style={{padding:"10px 14px",borderRadius:10,marginBottom:4,background:`${gc}08`,border:`1px solid ${gc}20`,display:"flex",justifyContent:"space-around",textAlign:"center"}}>
          {[{v:disp.length,l:"Items"},{v:tM.toLocaleString(undefined,{maximumFractionDigits:0}),l:"Meters"},{v:tN.toLocaleString(),l:"Pieces"},{v:tM>0?`₹${Math.round(tV/tM).toLocaleString()}`:"—",l:"Avg Rate/Mtr"}].map((s,i)=>(<div key={i}><div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{s.v}</div><div style={{fontSize:10,color:"#6b7a90"}}>{s.l}</div></div>))}
        </div>
        {disp.map(i=><ItemRow key={i.code+i.store} item={i} color={gc} hasStores={hasStores}/>)}
      </div>)}
    </div>

    <div style={{ padding:"10px 16px",textAlign:"center",flexShrink:0,borderTop:"1px solid rgba(255,255,255,0.04)",fontSize:11,color:"#4a5568" }}>Manhar Tube Corporation • {reportDate?`Stock as on ${reportDate}`:""} • {items.length} items • ↻ to refresh</div>
  </>);
}

export default function App() {
  const [sid, setSid] = useState(null); const [data, setData] = useState(null); const [loading, setLoading] = useState(true); const [rfr, setRfr] = useState(false); const [err, setErr] = useState("");
  const fetch2 = useCallback(async(id)=>{try{const r=await fetch(`/api/stock?sheetId=${id}`);const d=await r.json();if(d.error){setErr(d.error);return null;}return d;}catch{setErr("Connection failed.");return null;}},[]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search); const u=p.get("sheetId"); const s=localStorage.getItem("mtube-sid"); const id=u||s;
    if(id){setSid(id);if(u)localStorage.setItem("mtube-sid",u);fetch2(id).then(d=>{if(d)setData(d);setLoading(false);});}else setLoading(false);
  },[fetch2]);

  const onConnect=useCallback((id,d)=>{setSid(id);setData(d);setErr("");},[]);
  const onRefresh=useCallback(async()=>{if(!sid||rfr)return;setRfr(true);const d=await fetch2(sid);if(d)setData(d);setRfr(false);},[sid,rfr,fetch2]);
  const onReset=useCallback(()=>{localStorage.removeItem("mtube-sid");window.history.replaceState({},"",window.location.pathname);setSid(null);setData(null);setErr("");},[]);

  if(loading)return(<div style={{fontFamily:"'-apple-system',sans-serif",height:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#0a0f1a",color:"#f59e0b"}}>Loading...</div>);

  return(<div style={{fontFamily:"'-apple-system',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#0a0f1a",color:"#e8eaf0"}}>
    {!sid||!data?(<><div style={{background:"linear-gradient(135deg,#0d1b2a,#1b2d45)",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid rgba(255,255,255,0.06)"}}><div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#0a0f1a"}}>MT</div><div><div style={{fontWeight:700,fontSize:15}}>Mtube Stock Query</div><div style={{fontSize:11,color:"#6b7a90"}}>Manhar Tube Corporation</div></div></div><Setup onConnect={onConnect}/>{err&&<div style={{padding:"10px 16px",textAlign:"center",color:"#ef4444",fontSize:12}}>{err}</div>}</>)
    :(<Browser data={data} onRefresh={onRefresh} onReset={onReset} refreshing={rfr}/>)}
  </div>);
}
