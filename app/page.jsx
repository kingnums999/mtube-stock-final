'use client';
import { useState, useEffect, useCallback } from "react";

const COMPANIES = [
  { id: "mtube", name: "Mtube", full: "Manhar Tube Corporation", color: "#f59e0b", bg: "linear-gradient(135deg,#1e3a5f,#1e40af)" },
  { id: "rushabh", name: "Rushabh", full: "Rushabh Agency", color: "#10b981", bg: "linear-gradient(135deg,#064e3b,#047857)" },
];

const CK = {
  PA:{l:"APH Tube",f:"APH TUBE BS 6323 PART V",c:"#2563eb"},
  PB:{l:"ERW Boiler Tube",f:"ERW BOILER TUBE BS 3059 PT I GR 320 IBR",c:"#dc2626"},
  PC:{l:"Corten Steel Tube",f:"CORTEN STEEL TUBE A 423 GR 1",c:"#ea580c"},
  PD:{l:"ERW Boiler PT II",f:"ERW BOILER TUBE BS 3059 PT II GR 360 IBR",c:"#db2777"},
  PE:{l:"CDW Boiler Tube",f:"CDW BOILER TUBE BS 3059 PT I GR 320 IBR",c:"#7c3aed"},
  PF:{l:"ERW Black Pipe (Mtr)",f:"ERW BLACK PIPE IS 1239 (MTR)",c:"#4f46e5"},
  PFI:{l:"ERW Black Pipe (Kg)",f:"ERW BLACK PIPE IS 1239 (KG)",c:"#6366f1"},
  PG:{l:"GI Pipe",f:"GI PIPE IS 1239",c:"#0d9488"},
  PH:{l:"ERW Black Pipe 3589",f:"ERW BLACK PIPE IS 3589",c:"#0284c7"},
  PI:{l:"Spiral Welded",f:"SPIRAL WELDED PIPE IS 3589",c:"#0891b2"},
  PJ:{l:"CS Seamless SA 106",f:"CS SEAMLESS PIPE SA 106 GR B",c:"#16a34a"},
  PK:{l:"LTCS Seamless SA 333",f:"LTCS SEAMLESS PIPE SA 333 GR 6",c:"#65a30d"},
  PL:{l:"AS Seamless P11",f:"AS SEAMLESS PIPE SA 335 P11",c:"#e11d48"},
  PM:{l:"AS Seamless P22",f:"AS SEAMLESS PIPE SA 335 P22",c:"#be123c"},
  PN:{l:"AS Seamless P91",f:"AS SEAMLESS PIPE SA 335 P91",c:"#9f1239"},
  PO:{l:"CS SMLS Boiler Tube",f:"CS SMLS BOILER TUBE BS 3059 PT II GR 360",c:"#c026d3"},
  PP:{l:"CS SMLS Boiler SA210 A1",f:"CS SMLS BOILER TUBE SA 210 GR A1",c:"#a21caf"},
  PQ:{l:"AS SMLS Boiler T11",f:"AS SMLS BOILER TUBE SA 213 T11",c:"#86198f"},
  PR:{l:"AS SMLS Boiler T22",f:"AS SMLS BOILER TUBE SA 213 T22",c:"#701a75"},
  PS:{l:"AS SMLS Boiler T91",f:"AS SMLS BOILER TUBE SA 213 T91",c:"#581c87"},
  PT:{l:"CS SMLS Boiler SA210 C",f:"CS SMLS BOILER TUBE SA 210 GR C",c:"#7e22ce"},
  PU:{l:"Heat Exchanger SA 179",f:"HEAT EXCHANGER TUBE SA 179",c:"#6d28d9"},
  PV:{l:"Heat Exchanger SA 192",f:"HEAT EXCHANGER TUBE SA 192",c:"#5b21b6"},
  PW:{l:"Seamless Bares DIN",f:"SEAMLESS BARES PIPE DIN ST 52",c:"#4338ca"},
  P304S:{l:"304 Seamless (Mtr)",f:"304 SEAMLESS (MTR)",c:"#0e7490"},
  P304S1:{l:"304 Seamless (Kg)",f:"304 SEAMLESS (KG)",c:"#0e7490"},
  P304E:{l:"304 ERW (Mtr)",f:"304 ERW (MTR)",c:"#0f766e"},
  P304E1:{l:"304 ERW (Kg)",f:"304 ERW (KG)",c:"#0f766e"},
  P316S:{l:"316 Seamless (Mtr)",f:"316 SEAMLESS (MTR)",c:"#155e75"},
  P316S1:{l:"316 Seamless (Kg)",f:"316 SEAMLESS (KG)",c:"#155e75"},
  P316E:{l:"316 ERW (Mtr)",f:"316 ERW (MTR)",c:"#115e59"},
  P316E1:{l:"316 ERW (Kg)",f:"316 ERW (KG)",c:"#115e59"},
};
const GRADES = Object.entries(CK).map(([p, v]) => ({ prefix: p, ...v }));

function getOd(desc) {
  var m = desc.match(/^(\d+\.?\d*)\s*OD/);
  return m ? parseFloat(m[1]) : null;
}
function getThk(desc) {
  var m = desc.match(/OD\s*X\s*(\d+\.?\d*)\s*THK/i);
  return m ? parseFloat(m[1]) : null;
}

function CompanyPicker({ companies, sheets, onPick, onSetup }) {
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,padding:24 }}>
      <div style={{ fontSize:48,marginBottom:16 }}>📊</div>
      <div style={{ fontSize:20,fontWeight:800,marginBottom:6,textAlign:"center",color:"#1a1a2e" }}>Stock Query</div>
      <div style={{ fontSize:13,color:"#6b7280",marginBottom:24,textAlign:"center" }}>Select company</div>
      <div style={{ width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:10 }}>
        {companies.map(co => {
          var connected = !!sheets[co.id];
          return (
            <button key={co.id} onClick={() => connected ? onPick(co.id) : onSetup(co.id)}
              style={{ background:"#ffffff",border:"2px solid " + (connected ? co.color : "#e5e7eb"),borderRadius:14,padding:"18px 20px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}>
              <div>
                <div style={{ fontSize:18,fontWeight:800,color:"#1a1a2e" }}>{co.name}</div>
                <div style={{ fontSize:12,color:"#6b7280",marginTop:2 }}>{co.full}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                {connected ? (
                  <div style={{ background:co.color,color:"#fff",padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:700 }}>Open</div>
                ) : (
                  <div style={{ background:"#f1f5f9",color:"#6b7280",padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:600 }}>Setup</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
      <div style={{ marginTop:20,fontSize:11,color:"#9ca3af",textAlign:"center" }}>Each company connects to its own Google Sheet</div>
    </div>
  );
}

function Setup({ company, onConnect, onBack }) {
  var [url, setUrl] = useState("");
  var [loading, setLoading] = useState(false);
  var [err, setErr] = useState("");
  var getId = function(s) {
    var m = s.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
    return m ? m[1] : /^[a-zA-Z0-9_-]{20,}$/.test(s.trim()) ? s.trim() : null;
  };
  var go = async function() {
    var id = getId(url);
    if (!id) { setErr("Paste the full Google Sheet link."); return; }
    setLoading(true); setErr("");
    try {
      var r = await fetch("/api/stock?sheetId=" + id);
      var d = await r.json();
      if (d.error) { setErr(d.error); setLoading(false); return; }
      onConnect(id, d);
    } catch (e) { setErr("Connection failed."); }
    setLoading(false);
  };
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flex:1,padding:24 }}>
      <div style={{ fontSize:48,marginBottom:16 }}>🔗</div>
      <div style={{ fontSize:20,fontWeight:800,marginBottom:6,textAlign:"center",color:"#1a1a2e" }}>
        Connect {company.name}
      </div>
      <div style={{ fontSize:13,color:"#6b7280",marginBottom:16,textAlign:"center",maxWidth:340 }}>
        Link the Google Sheet for {company.full}
      </div>
      <div style={{ width:"100%",maxWidth:380,background:"#f8f9fa",borderRadius:12,padding:16,marginBottom:16,border:"1px solid #e5e7eb" }}>
        <div style={{ fontSize:13,fontWeight:700,color:"#b45309",marginBottom:10 }}>Setup steps:</div>
        <div style={{ fontSize:12,color:"#6b7280",lineHeight:1.8 }}>
          1. Open <b style={{color:"#1a1a2e"}}>Google Sheets</b> → new spreadsheet<br/>
          2. <b style={{color:"#1a1a2e"}}>File → Import → Upload</b> Spectrum Excel<br/>
          3. <b style={{color:"#1a1a2e"}}>"Replace spreadsheet"</b> → Import<br/>
          4. <b style={{color:"#1a1a2e"}}>Share</b> → "Anyone with the link" → Viewer<br/>
          5. <b style={{color:"#1a1a2e"}}>Copy link</b> → paste below ↓
        </div>
      </div>
      <div style={{ width:"100%",maxWidth:380 }}>
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder={"Paste " + company.name + " Google Sheet link..."}
          style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#ffffff",color:"#1a1a2e",fontSize:13,outline:"none",marginBottom:10,boxSizing:"border-box" }}
          onKeyDown={e => e.key === "Enter" && go()} />
        <button onClick={go} disabled={loading || !url.trim()}
          style={{ width:"100%",padding:12,borderRadius:10,border:"none",background:url.trim() ? "linear-gradient(135deg," + company.color + "," + company.color + ")" : "#e5e7eb",color:url.trim() ? "#ffffff" : "#9ca3af",fontWeight:700,fontSize:15,cursor:url.trim() ? "pointer" : "default" }}>
          {loading ? "Connecting..." : "Connect & Load Stock"}
        </button>
        <button onClick={onBack}
          style={{ width:"100%",padding:10,borderRadius:10,border:"1px solid #e5e7eb",background:"transparent",color:"#6b7280",fontWeight:600,fontSize:13,cursor:"pointer",marginTop:8 }}>
          ← Back
        </button>
      </div>
      {err && <div style={{ marginTop:14,padding:"10px 16px",borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",fontSize:12,maxWidth:380,textAlign:"center" }}>{err}</div>}
    </div>
  );
}

function ItemRow({ item, color, hasStores }) {
  var p = item.desc.match(/^(\d+\.?\d*)\s*OD\s*X\s*(\d+\.?\d*)\s*THK\s*(.*)$/i);
  return (
    <div style={{ padding:"10px 14px",borderRadius:8,background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <div style={{ minWidth:0 }}>
        {hasStores && (
          <div style={{ fontSize:9,color:"#b45309",fontWeight:700,marginBottom:3,fontFamily:"monospace",background:"#fef3c7",display:"inline-block",padding:"1px 6px",borderRadius:3 }}>
            GD {item.store}
          </div>
        )}
        <div style={{ fontSize:13,fontWeight:600,fontFamily:"monospace",display:"flex",gap:4,flexWrap:"wrap",alignItems:"baseline" }}>
          {p ? (
            <>
              <span style={{color:color}}>{p[1]}</span>
              <span style={{color:"#6b7280",fontSize:11}}> OD × </span>
              <span style={{color:"#1a1a2e"}}>{p[2]}</span>
              <span style={{color:"#6b7280",fontSize:11}}> THK </span>
              <span style={{color:"#6b7280",fontSize:11}}>{p[3]}</span>
            </>
          ) : (
            <span style={{color:"#1a1a2e"}}>{item.desc}</span>
          )}
        </div>
        <div style={{ fontSize:10,color:"#9ca3af",marginTop:3,fontFamily:"monospace" }}>{item.code}</div>
      </div>
      <div style={{ textAlign:"right",flexShrink:0,paddingLeft:12 }}>
        <div style={{ fontSize:15,fontWeight:800,color:item.mtr > 0 ? color : "#dc2626",fontFamily:"monospace" }}>
          {item.mtr > 0 ? item.mtr.toLocaleString() + " Mtr" : "NIL"}
        </div>
        <div style={{ fontSize:10,color:"#6b7280" }}>
          {item.mtr > 0 ? item.nos.toLocaleString() + " Nos" : ""}
        </div>
        {item.rate > 0 && (
          <div style={{ fontSize:11,fontWeight:700,color:"#b45309",fontFamily:"monospace",marginTop:3 }}>
            Avg Cost ₹{item.rate.toLocaleString()}/Mtr
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryBar({ items, color }) {
  var tM = items.reduce(function(s,i) { return s+i.mtr; }, 0);
  var tN = items.reduce(function(s,i) { return s+i.nos; }, 0);
  var tV = items.reduce(function(s,i) { return s+i.val; }, 0);
  var stats = [
    { v: items.length, l: "Items" },
    { v: tM.toLocaleString(undefined, {maximumFractionDigits:0}), l: "Meters" },
    { v: tN.toLocaleString(), l: "Pieces" },
    { v: tM > 0 ? "₹" + Math.round(tV/tM).toLocaleString() : "—", l: "Avg Rate/Mtr" },
  ];
  return (
    <div style={{ padding:"10px 14px",borderRadius:10,marginBottom:4,background:color+"08",border:"1px solid "+color+"20",display:"flex",justifyContent:"space-around",textAlign:"center" }}>
      {stats.map(function(s,i) {
        return (
          <div key={i}>
            <div style={{ fontSize:16,fontWeight:800,color:color,fontFamily:"monospace" }}>{s.v}</div>
            <div style={{ fontSize:10,color:"#6b7280" }}>{s.l}</div>
          </div>
        );
      })}
    </div>
  );
}

function Browser({ data, company, onRefresh, onBack, refreshing }) {
  var [scr, setScr] = useState("grades");
  var [grade, setGrade] = useState(null);
  var [od, setOd] = useState(null);
  var [thk, setThk] = useState(null);
  var [filter, setFilter] = useState("");
  var [sizeMode, setSizeMode] = useState(false);
  var [sizeQ, setSizeQ] = useState("");
  var [store, setStore] = useState("ALL");

  var all = data.items;
  var reportDate = data.reportDate;
  var stores = data.stores || [];
  var hasStores = data.hasStores;
  var items = store === "ALL" ? all : all.filter(function(i) { return i.store === store; });
  var gi = function(p) { return items.filter(function(i) { return i.prefix === p; }); };
  var gs = function(p) { var g = gi(p); return { n: g.length, m: g.reduce(function(s,i) { return s+i.mtr; }, 0) }; };

  var pickGrade = function(g) {
    setGrade(g);
    var g2 = gi(g.prefix);
    var odSet = [];
    var seen = {};
    g2.forEach(function(i) { var v = getOd(i.desc); if (v && !seen[v]) { seen[v] = true; odSet.push(v); } });
    if (g2.length === 0 || odSet.length <= 1) {
      setOd(null); setThk(null); setScr("items");
    } else {
      setScr("sizes");
    }
  };

  var gradeItems = grade ? gi(grade.prefix) : [];

  var pickOdFn = function(o) {
    setOd(o);
    var odFilt = gradeItems.filter(function(i) { var v = getOd(i.desc); return v !== null && Math.abs(v - o) < 0.01; });
    var thkSet = [];
    var seen = {};
    odFilt.forEach(function(i) { var v = getThk(i.desc); if (v && !seen[v]) { seen[v] = true; thkSet.push(v); } });
    if (thkSet.length <= 1) {
      setThk(null); setScr("items");
    } else {
      setScr("thk");
    }
  };

  var pickThkFn = function(t) {
    setThk(t); setScr("items");
  };

  var goBack = function() {
    if (scr === "items" && thk !== null) { setThk(null); setScr("thk"); }
    else if (scr === "items" && od !== null) { setOd(null); setThk(null); setScr("sizes"); }
    else if (scr === "thk") { setOd(null); setThk(null); setScr("sizes"); }
    else { setGrade(null); setOd(null); setThk(null); setScr("grades"); setFilter(""); setSizeQ(""); setSizeMode(false); }
  };

  var odList = [];
  var odSeen = {};
  gradeItems.forEach(function(i) { var v = getOd(i.desc); if (v && !odSeen[v]) { odSeen[v] = true; odList.push(v); } });
  odList.sort(function(a,b) { return a-b; });

  var odFiltered = od !== null
    ? gradeItems.filter(function(i) { var v = getOd(i.desc); return v !== null && Math.abs(v - od) < 0.01; })
    : gradeItems;

  var thkList = [];
  if (od !== null) {
    var thkSeen = {};
    odFiltered.forEach(function(i) { var v = getThk(i.desc); if (v && !thkSeen[v]) { thkSeen[v] = true; thkList.push(v); } });
    thkList.sort(function(a,b) { return a-b; });
  }

  var disp = thk !== null
    ? odFiltered.filter(function(i) { var v = getThk(i.desc); return v !== null && Math.abs(v - thk) < 0.01; })
    : odFiltered;

  var sRes = sizeMode && sizeQ.trim() ? items.filter(function(i) {
    var q = sizeQ.toLowerCase().replace(/x/g," ").trim();
    var nums = q.match(/\d+\.?\d*/g);
    if (nums && nums.length > 0) {
      return nums.every(function(n) {
        var d = i.desc.toLowerCase();
        var re = new RegExp(n.replace(".","\\."));
        if (re.test(d)) return true;
        var nf = parseFloat(n);
        var om = d.match(/(\d+\.?\d*)\s*od/);
        if (om && Math.abs(parseFloat(om[1]) - nf) < 0.5) return true;
        var tm = d.match(/(\d+\.?\d*)\s*thk/);
        if (tm && Math.abs(parseFloat(tm[1]) - nf) < 0.1) return true;
        return false;
      });
    }
    return (i.desc + " " + i.cat + " " + i.code).toLowerCase().indexOf(q) >= 0;
  }) : [];

  var fg = filter
    ? GRADES.filter(function(g) { return g.l.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || g.f.toLowerCase().indexOf(filter.toLowerCase()) >= 0 || g.prefix.toLowerCase() === filter.toLowerCase(); })
    : GRADES;
  var inS = fg.filter(function(g) { return gs(g.prefix).n > 0; });
  var noS = fg.filter(function(g) { return gs(g.prefix).n === 0; });
  var gc = grade ? (CK[grade.prefix] ? CK[grade.prefix].c : "#b45309") : "#b45309";
  var tM = disp.reduce(function(s,i){return s+i.mtr;},0);

  var headerTitle = company.name + " Stock";
  if (scr === "sizes" && grade) headerTitle = grade.l;
  else if (scr === "thk" && grade) headerTitle = grade.l + " — " + od + " OD";
  else if (scr === "items" && grade && thk !== null) headerTitle = od + " OD × " + thk + " THK";
  else if (scr === "items" && grade && od !== null) headerTitle = grade.l + " — " + od + " OD";
  else if (scr === "items" && grade) headerTitle = grade.l;

  var subtitle = "";
  if (scr === "grades") subtitle = items.length + " items • " + (reportDate || "—") + (store !== "ALL" ? " • GD " + store : "");
  else if (scr === "sizes") subtitle = gradeItems.length + " items — Select OD";
  else if (scr === "thk") subtitle = odFiltered.length + " items — Select THK";
  else subtitle = disp.length + " items • " + tM.toLocaleString(undefined, {maximumFractionDigits:1}) + " Mtr";

  return (
    <>
      {/* Header */}
      <div style={{ background:company.bg,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #e5e7eb",flexShrink:0 }}>
        {scr !== "grades" ? (
          <button onClick={goBack} style={{ background:"rgba(255,255,255,0.15)",border:"none",color:"#fbbf24",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>
        ) : (
          <button onClick={onBack} style={{ background:"rgba(255,255,255,0.15)",border:"none",color:"#fbbf24",width:34,height:34,borderRadius:8,cursor:"pointer",fontSize:16,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center" }}>←</button>
        )}
        <div style={{ width:38,height:38,borderRadius:10,background:"linear-gradient(135deg," + company.color + "," + company.color + ")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:12,color:"#ffffff",flexShrink:0 }}>
          {company.id === "mtube" ? "MT" : "RA"}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontWeight:700,fontSize:15,color:"#ffffff" }}>{headerTitle}</div>
          <div style={{ fontSize:11,color:"rgba(255,255,255,0.7)",marginTop:1 }}>{subtitle}</div>
        </div>
        {scr === "grades" && (
          <button onClick={onRefresh} disabled={refreshing} style={{ background:"rgba(255,255,255,0.15)",border:"none",color:refreshing ? "rgba(255,255,255,0.4)" : "#4ade80",padding:"6px 12px",borderRadius:8,cursor:"pointer",fontSize:13,fontWeight:700 }}>
            {refreshing ? "..." : "↻"}
          </button>
        )}
      </div>

      {/* Godown pills */}
      {hasStores && stores.length > 0 && scr === "grades" && (
        <div style={{ padding:"8px 12px",display:"flex",gap:6,overflowX:"auto",borderBottom:"1px solid #e5e7eb",flexShrink:0,background:"#f8f9fa" }}>
          <button onClick={function() { setStore("ALL"); }} style={{ padding:"6px 14px",borderRadius:20,border:store==="ALL" ? "1px solid #d97706" : "1px solid #d1d5db",background:store==="ALL" ? "#fef3c7" : "#ffffff",color:store==="ALL" ? "#92400e" : "#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>All Godowns</button>
          {stores.map(function(s) {
            var n = all.filter(function(i) { return i.store === s; }).length;
            return (
              <button key={s} onClick={function() { setStore(s); }} style={{ padding:"6px 14px",borderRadius:20,border:store===s ? "1px solid #d97706" : "1px solid #d1d5db",background:store===s ? "#fef3c7" : "#ffffff",color:store===s ? "#92400e" : "#6b7280",fontSize:12,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>
                {s} <span style={{fontSize:10,opacity:0.7}}>({n})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <div style={{ flex:1,overflowY:"auto",padding:12 }}>

        {/* GRADES */}
        {scr === "grades" && (
          <>
            <div style={{ display:"flex",gap:2,marginBottom:10,background:"#f1f5f9",borderRadius:10,padding:3 }}>
              {[{k:false,l:"By Grade"},{k:true,l:"By Size"}].map(function(t) {
                return (
                  <button key={String(t.k)} onClick={function() { setSizeMode(t.k); setFilter(""); setSizeQ(""); }}
                    style={{ flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:sizeMode===t.k ? "#ffffff" : "transparent",color:sizeMode===t.k ? "#b45309" : "#6b7280",boxShadow:sizeMode===t.k ? "0 1px 3px rgba(0,0,0,0.1)" : "none" }}>
                    {t.l}
                  </button>
                );
              })}
            </div>

            {!sizeMode ? (
              <>
                <div style={{marginBottom:10}}>
                  <input value={filter} onChange={function(e) { setFilter(e.target.value); }} placeholder="Filter grades..."
                    style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#ffffff",color:"#1a1a2e",fontSize:14,outline:"none",boxSizing:"border-box" }} />
                </div>
                <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#b45309" }}>In Stock ({inS.length})</div>
                <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
                  {inS.map(function(g) {
                    var s = gs(g.prefix);
                    return (
                      <button key={g.prefix} onClick={function() { pickGrade(g); }}
                        style={{ border:"1px solid "+g.c+"30",background:"#ffffff",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}>
                        <div>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"monospace",fontWeight:800,fontSize:13,color:"#fff",background:g.c,padding:"2px 8px",borderRadius:5}}>{g.prefix}</span>
                            <span style={{fontSize:14,fontWeight:600,color:"#1a1a2e"}}>{g.l}</span>
                          </div>
                          <div style={{fontSize:11,color:"#6b7280",marginTop:4,paddingLeft:2}}>{g.f}</div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontSize:14,fontWeight:700,color:g.c,fontFamily:"monospace"}}>{s.m.toLocaleString(undefined,{maximumFractionDigits:0})}</div>
                          <div style={{fontSize:10,color:"#6b7280"}}>Mtr • {s.n} sizes</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {noS.length > 0 && (
                  <>
                    <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#9ca3af" }}>No Current Stock ({noS.length})</div>
                    <div style={{display:"flex",flexDirection:"column",gap:4}}>
                      {noS.map(function(g) {
                        return (
                          <div key={g.prefix} style={{padding:"8px 14px",borderRadius:10,background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center",opacity:0.6}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:"#9ca3af"}}>{g.prefix}</span>
                              <span style={{fontSize:13,color:"#9ca3af"}}>{g.l}</span>
                            </div>
                            <span style={{fontSize:11,color:"#d1d5db",fontStyle:"italic"}}>NIL</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div style={{marginBottom:10}}>
                  <input value={sizeQ} onChange={function(e) { setSizeQ(e.target.value); }} placeholder='Search size... e.g. 63.50 x 3.25 or 88.90'
                    style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#ffffff",color:"#1a1a2e",fontSize:14,outline:"none",boxSizing:"border-box" }} autoFocus />
                </div>
                {sizeQ.trim() ? (
                  sRes.length > 0 ? (
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,padding:"0 4px",color:"#16a34a"}}>Found {sRes.length} items</div>
                      {sRes.map(function(i) { return <ItemRow key={i.code+i.store} item={i} color={CK[i.prefix] ? CK[i.prefix].c : "#6b7280"} hasStores={hasStores} />; })}
                    </div>
                  ) : (
                    <div style={{padding:30,textAlign:"center",borderRadius:12,background:"#fef2f2",border:"1px solid #fecaca"}}>
                      <div style={{fontSize:28,marginBottom:8}}>🔍</div>
                      <div style={{fontSize:14,fontWeight:600,color:"#dc2626"}}>No items found</div>
                    </div>
                  )
                ) : (
                  <div style={{padding:20,textAlign:"center",color:"#6b7280",fontSize:13}}>Type a size to search</div>
                )}
              </>
            )}
          </>
        )}

        {/* OD SIZES */}
        {scr === "sizes" && grade && (
          gradeItems.length === 0 ? (
            <div style={{padding:30,textAlign:"center",borderRadius:12,background:"#fef2f2",border:"1px solid #fecaca",marginTop:20}}>
              <div style={{fontSize:36,marginBottom:10}}>📭</div>
              <div style={{fontSize:16,fontWeight:700,color:"#dc2626"}}>No Stock</div>
            </div>
          ) : (
            <>
              <button onClick={function() { setOd(null); setThk(null); setScr("items"); }}
                style={{border:"1px solid "+gc+"30",background:gc+"08",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"center",width:"100%",marginBottom:10}}>
                <div style={{fontSize:14,fontWeight:700,color:gc}}>📋 View All {gradeItems.length} Sizes</div>
                <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Total: {gradeItems.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div>
              </button>
              <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8,padding:"0 4px",color:"#6b7280"}}>Select OD Size</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {odList.map(function(o) {
                  var oi = gradeItems.filter(function(i) { var v = getOd(i.desc); return v !== null && Math.abs(v-o) < 0.01; });
                  return (
                    <button key={o} onClick={function() { pickOdFn(o); }}
                      style={{border:"1px solid "+gc+"30",background:"#ffffff",borderRadius:10,padding:"10px 16px",cursor:"pointer",textAlign:"center",minWidth:90,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
                      <div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{o}</div>
                      <div style={{fontSize:10,color:"#6b7280",marginTop:3}}>{oi.length} • {oi.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div>
                    </button>
                  );
                })}
              </div>
            </>
          )
        )}

        {/* THICKNESS */}
        {scr === "thk" && grade && od !== null && (
          <>
            <button onClick={function() { setThk(null); setScr("items"); }}
              style={{border:"1px solid "+gc+"30",background:gc+"08",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"center",width:"100%",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:gc}}>📋 View All {odFiltered.length} for {od} OD</div>
              <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>Total: {odFiltered.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div>
            </button>
            <div style={{fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:8,padding:"0 4px",color:"#6b7280"}}>Select Thickness</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {thkList.map(function(t) {
                var ti = odFiltered.filter(function(i) { var v = getThk(i.desc); return v !== null && Math.abs(v-t) < 0.01; });
                return (
                  <button key={t} onClick={function() { pickThkFn(t); }}
                    style={{border:"1px solid "+gc+"30",background:"#ffffff",borderRadius:10,padding:"10px 16px",cursor:"pointer",textAlign:"center",minWidth:90,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}>
                    <div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{t}</div>
                    <div style={{fontSize:10,color:"#6b7280",marginTop:3}}>{ti.length} • {ti.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ITEMS */}
        {scr === "items" && grade && (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <SummaryBar items={disp} color={gc} />
            {disp.map(function(i) { return <ItemRow key={i.code+i.store} item={i} color={gc} hasStores={hasStores} />; })}
          </div>
        )}

      </div>

      <div style={{ padding:"10px 16px",textAlign:"center",flexShrink:0,borderTop:"1px solid #e5e7eb",fontSize:11,color:"#9ca3af" }}>
        {company.full} • {reportDate ? "Stock as on " + reportDate : ""} • {items.length} items
      </div>
    </>
  );
}

export default function App() {
  var [screen, setScreen] = useState("pick");
  var [activeCoId, setActiveCoId] = useState(null);
  var [sheets, setSheets] = useState({});
  var [dataCache, setDataCache] = useState({});
  var [rfr, setRfr] = useState(false);
  var [setupCoId, setSetupCoId] = useState(null);

  useEffect(function() {
    var saved = {};
    COMPANIES.forEach(function(co) {
      var sid = localStorage.getItem("stock-" + co.id);
      if (sid) saved[co.id] = sid;
    });
    setSheets(saved);

    // Read URL params: ?mtube=SHEET_ID&rushabh=SHEET_ID
    var p = new URLSearchParams(window.location.search);
    var urlSheets = {};
    COMPANIES.forEach(function(co) {
      var sid = p.get(co.id);
      if (sid) {
        urlSheets[co.id] = sid;
        saved[co.id] = sid;
        localStorage.setItem("stock-" + co.id, sid);
      }
    });
    if (Object.keys(urlSheets).length > 0) {
      setSheets(Object.assign({}, saved));
    }

    // Auto-load connected companies
    var connectedIds = Object.keys(saved);
    if (connectedIds.length === 0) return;

    // If exactly one company, auto-open it
    if (connectedIds.length === 1) {
      var onlyId = connectedIds[0];
      setActiveCoId(onlyId);
      setScreen("loading");
      fetchData(saved[onlyId]).then(function(d) {
        if (d) {
          setDataCache(function(prev) { var n = Object.assign({}, prev); n[onlyId] = d; return n; });
          setScreen("browse");
        } else {
          setScreen("pick");
        }
      });
    }
    // If multiple, show picker (don't auto-load all)
  }, []);

  var fetchData = async function(sheetId) {
    try {
      var r = await fetch("/api/stock?sheetId=" + sheetId);
      var d = await r.json();
      if (d.error) return null;
      return d;
    } catch (e) { return null; }
  };

  var openCompany = async function(coId) {
    setActiveCoId(coId);
    var sid = sheets[coId];
    if (dataCache[coId]) {
      setScreen("browse");
      return;
    }
    setScreen("loading");
    var d = await fetchData(sid);
    if (d) {
      setDataCache(function(prev) { var n = Object.assign({}, prev); n[coId] = d; return n; });
      setScreen("browse");
    } else {
      setScreen("pick");
    }
  };

  var onSetup = function(coId) {
    setSetupCoId(coId);
    setScreen("setup");
  };

  var updateUrl = function(allSheets) {
    var params = new URLSearchParams();
    COMPANIES.forEach(function(co) {
      if (allSheets[co.id]) params.set(co.id, allSheets[co.id]);
    });
    var qs = params.toString();
    window.history.replaceState({}, "", qs ? "?" + qs : window.location.pathname);
  };

  var onConnect = function(sheetId, data) {
    var coId = setupCoId;
    localStorage.setItem("stock-" + coId, sheetId);
    var newSheets = Object.assign({}, sheets);
    newSheets[coId] = sheetId;
    setSheets(newSheets);
    updateUrl(newSheets);
    setDataCache(function(prev) { var n = Object.assign({}, prev); n[coId] = data; return n; });
    setActiveCoId(coId);
    setScreen("browse");
  };

  var onRefresh = async function() {
    if (!activeCoId || rfr) return;
    setRfr(true);
    var d = await fetchData(sheets[activeCoId]);
    if (d) {
      setDataCache(function(prev) { var n = Object.assign({}, prev); n[activeCoId] = d; return n; });
    }
    setRfr(false);
  };

  var goHome = function() {
    setActiveCoId(null);
    setSetupCoId(null);
    setScreen("pick");
  };

  var activeCo = activeCoId ? COMPANIES.find(function(c) { return c.id === activeCoId; }) : null;
  var setupCo = setupCoId ? COMPANIES.find(function(c) { return c.id === setupCoId; }) : null;

  return (
    <div style={{fontFamily:"'-apple-system',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#ffffff",color:"#1a1a2e"}}>

      {screen === "loading" && (
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:"#b45309"}}>Loading...</div>
      )}

      {screen === "pick" && (
        <>
          <div style={{background:"linear-gradient(135deg,#1e3a5f,#1e40af)",padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #e5e7eb"}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg,#f59e0b,#d97706)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:16,color:"#ffffff"}}>📊</div>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:"#ffffff"}}>Stock Query</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>Select Company</div>
            </div>
          </div>
          <CompanyPicker companies={COMPANIES} sheets={sheets} onPick={openCompany} onSetup={onSetup} />
        </>
      )}

      {screen === "setup" && setupCo && (
        <>
          <div style={{background:setupCo.bg,padding:"14px 16px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #e5e7eb"}}>
            <div style={{width:38,height:38,borderRadius:10,background:"linear-gradient(135deg," + setupCo.color + "," + setupCo.color + ")",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:14,color:"#ffffff"}}>
              {setupCo.id === "mtube" ? "MT" : "RA"}
            </div>
            <div>
              <div style={{fontWeight:700,fontSize:15,color:"#ffffff"}}>Setup {setupCo.name}</div>
              <div style={{fontSize:11,color:"rgba(255,255,255,0.7)"}}>{setupCo.full}</div>
            </div>
          </div>
          <Setup company={setupCo} onConnect={onConnect} onBack={goHome} />
        </>
      )}

      {screen === "browse" && activeCo && dataCache[activeCoId] && (
        <Browser data={dataCache[activeCoId]} company={activeCo} onRefresh={onRefresh} onBack={goHome} refreshing={rfr} />
      )}

    </div>
  );
}
