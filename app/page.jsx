'use client';
import { useState, useEffect, useCallback } from "react";

var CK = {
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
var GRADES = Object.entries(CK).map(function(e) { return Object.assign({ prefix: e[0] }, e[1]); });

function getOd(d) { var m = d.match(/^(\d+\.?\d*)\s*OD/); return m ? parseFloat(m[1]) : null; }
function getThk(d) { var m = d.match(/OD\s*X\s*(\d+\.?\d*)\s*THK/i); return m ? parseFloat(m[1]) : null; }

function ItemRow(props) {
  var item = props.item, color = props.color, hasStores = props.hasStores;
  var p = item.desc.match(/^(\d+\.?\d*)\s*OD\s*X\s*(\d+\.?\d*)\s*THK\s*(.*)$/i);
  return (
    <div style={{ padding:"10px 14px",borderRadius:8,background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
      <div style={{ minWidth:0 }}>
        {hasStores && <div style={{ fontSize:9,color:"#b45309",fontWeight:700,marginBottom:3,fontFamily:"monospace",background:"#fef3c7",display:"inline-block",padding:"1px 6px",borderRadius:3 }}>GD {item.store}</div>}
        <div style={{ fontSize:13,fontWeight:600,fontFamily:"monospace",display:"flex",gap:4,flexWrap:"wrap",alignItems:"baseline" }}>
          {p ? (<><span style={{color:color}}>{p[1]}</span><span style={{color:"#6b7280",fontSize:11}}> OD × </span><span style={{color:"#1a1a2e"}}>{p[2]}</span><span style={{color:"#6b7280",fontSize:11}}> THK </span><span style={{color:"#6b7280",fontSize:11}}>{p[3]}</span></>) : (<span style={{color:"#1a1a2e"}}>{item.desc}</span>)}
        </div>
        <div style={{ fontSize:10,color:"#9ca3af",marginTop:3,fontFamily:"monospace" }}>{item.code}</div>
      </div>
      <div style={{ textAlign:"right",flexShrink:0,paddingLeft:12 }}>
        <div style={{ fontSize:15,fontWeight:800,color:item.mtr > 0 ? color : "#dc2626",fontFamily:"monospace" }}>{item.mtr > 0 ? item.mtr.toLocaleString() + " Mtr" : "NIL"}</div>
        <div style={{ fontSize:10,color:"#6b7280" }}>{item.mtr > 0 ? item.nos.toLocaleString() + " Nos" : ""}</div>
        {item.rate > 0 && <div style={{ fontSize:11,fontWeight:700,color:"#b45309",fontFamily:"monospace",marginTop:3 }}>Avg Cost ₹{item.rate.toLocaleString()}/Mtr</div>}
      </div>
    </div>
  );
}

function StockView(props) {
  var data = props.data, accentColor = props.accentColor;
  var _s1 = useState("grades"), scr = _s1[0], setScr = _s1[1];
  var _s2 = useState(null), grade = _s2[0], setGrade = _s2[1];
  var _s3 = useState(null), od = _s3[0], setOd = _s3[1];
  var _s4 = useState(null), thk = _s4[0], setThk = _s4[1];
  var _s5 = useState(""), filter = _s5[0], setFilter = _s5[1];
  var _s6 = useState(false), sizeMode = _s6[0], setSizeMode = _s6[1];
  var _s7 = useState(""), sizeQ = _s7[0], setSizeQ = _s7[1];
  var _s8 = useState("ALL"), store = _s8[0], setStore = _s8[1];

  if (!data) return <div style={{padding:40,textAlign:"center",color:"#9ca3af"}}>Not connected</div>;

  var all = data.items, reportDate = data.reportDate, stores = data.stores || [], hasStores = data.hasStores;
  var items = store === "ALL" ? all : all.filter(function(i) { return i.store === store; });
  var gi = function(p) { return items.filter(function(i) { return i.prefix === p; }); };
  var gs = function(p) { var g = gi(p); return { n: g.length, m: g.reduce(function(s,i){return s+i.mtr;},0) }; };

  var gradeItems = grade ? gi(grade.prefix) : [];

  var pickGrade = function(g) {
    setGrade(g);
    var g2 = gi(g.prefix);
    var seen = {}, odSet = [];
    g2.forEach(function(i) { var v = getOd(i.desc); if (v && !seen[v]) { seen[v]=true; odSet.push(v); } });
    if (g2.length === 0 || odSet.length <= 1) { setOd(null); setThk(null); setScr("items"); }
    else { setScr("sizes"); }
  };

  var pickOdFn = function(o) {
    setOd(o);
    var odFilt = gradeItems.filter(function(i) { var v = getOd(i.desc); return v !== null && Math.abs(v-o) < 0.01; });
    var seen = {}, thkSet = [];
    odFilt.forEach(function(i) { var v = getThk(i.desc); if (v && !seen[v]) { seen[v]=true; thkSet.push(v); } });
    if (thkSet.length <= 1) { setThk(null); setScr("items"); }
    else { setScr("thk"); }
  };

  var goBack = function() {
    if (scr === "items" && thk !== null) { setThk(null); setScr("thk"); }
    else if (scr === "items" && od !== null) { setOd(null); setThk(null); setScr("sizes"); }
    else if (scr === "thk") { setOd(null); setThk(null); setScr("sizes"); }
    else { setGrade(null); setOd(null); setThk(null); setScr("grades"); setFilter(""); setSizeQ(""); setSizeMode(false); }
  };

  var odList = [];
  var odSeen = {};
  gradeItems.forEach(function(i) { var v = getOd(i.desc); if (v && !odSeen[v]) { odSeen[v]=true; odList.push(v); } });
  odList.sort(function(a,b){return a-b;});

  var odFiltered = od !== null ? gradeItems.filter(function(i) { var v = getOd(i.desc); return v !== null && Math.abs(v-od) < 0.01; }) : gradeItems;

  var thkList = [];
  if (od !== null) {
    var thkSeen = {};
    odFiltered.forEach(function(i) { var v = getThk(i.desc); if (v && !thkSeen[v]) { thkSeen[v]=true; thkList.push(v); } });
    thkList.sort(function(a,b){return a-b;});
  }

  var disp = thk !== null ? odFiltered.filter(function(i) { var v = getThk(i.desc); return v !== null && Math.abs(v-thk) < 0.01; }) : odFiltered;
  var tM = disp.reduce(function(s,i){return s+i.mtr;},0);
  var tN = disp.reduce(function(s,i){return s+i.nos;},0);
  var tV = disp.reduce(function(s,i){return s+i.val;},0);

  var sRes = sizeMode && sizeQ.trim() ? items.filter(function(i) {
    var q = sizeQ.toLowerCase().replace(/x/g," ").trim();
    var nums = q.match(/\d+\.?\d*/g);
    if (nums && nums.length > 0) return nums.every(function(n) {
      var d = i.desc.toLowerCase();
      var nf = parseFloat(n);
      var om = d.match(/(\d+\.?\d*)\s*od/); if (om && Math.abs(parseFloat(om[1])-nf) < 0.5) return true;
      var tm = d.match(/(\d+\.?\d*)\s*thk/); if (tm && Math.abs(parseFloat(tm[1])-nf) < 0.1) return true;
      return new RegExp(n.replace(".","\\.")).test(d);
    });
    return (i.desc+" "+i.cat+" "+i.code).toLowerCase().indexOf(q) >= 0;
  }) : [];

  var fg = filter ? GRADES.filter(function(g) { return g.l.toLowerCase().indexOf(filter.toLowerCase())>=0 || g.f.toLowerCase().indexOf(filter.toLowerCase())>=0 || g.prefix.toLowerCase()===filter.toLowerCase(); }) : GRADES;
  var inS = fg.filter(function(g){return gs(g.prefix).n>0;});
  var noS = fg.filter(function(g){return gs(g.prefix).n===0;});
  var gc = grade ? (CK[grade.prefix] ? CK[grade.prefix].c : accentColor) : accentColor;

  return (
    <>
      {/* Sub-header for back + context */}
      {scr !== "grades" && (
        <div style={{ padding:"8px 12px",background:"#f8f9fa",borderBottom:"1px solid #e5e7eb",display:"flex",alignItems:"center",gap:10 }}>
          <button onClick={goBack} style={{ background:"#e5e7eb",border:"none",color:"#1a1a2e",width:30,height:30,borderRadius:6,cursor:"pointer",fontSize:14,fontWeight:700 }}>←</button>
          <div style={{ fontSize:13,fontWeight:600,color:"#1a1a2e" }}>
            {scr==="sizes" && grade ? grade.l : ""}
            {scr==="thk" && grade ? grade.l + " — " + od + " OD" : ""}
            {scr==="items" && thk !== null ? od + " OD × " + thk + " THK" : ""}
            {scr==="items" && thk === null && od !== null ? grade.l + " — " + od + " OD" : ""}
            {scr==="items" && od === null && grade ? grade.l + " (All)" : ""}
          </div>
        </div>
      )}

      {/* Godown pills */}
      {hasStores && stores.length > 0 && scr === "grades" && (
        <div style={{ padding:"8px 12px",display:"flex",gap:6,overflowX:"auto",borderBottom:"1px solid #e5e7eb",flexShrink:0,background:"#f8f9fa" }}>
          <button onClick={function(){setStore("ALL");}} style={{ padding:"5px 12px",borderRadius:20,border:store==="ALL"?"1px solid #d97706":"1px solid #d1d5db",background:store==="ALL"?"#fef3c7":"#fff",color:store==="ALL"?"#92400e":"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>All</button>
          {stores.map(function(s) {
            var n = all.filter(function(i){return i.store===s;}).length;
            return <button key={s} onClick={function(){setStore(s);}} style={{ padding:"5px 12px",borderRadius:20,border:store===s?"1px solid #d97706":"1px solid #d1d5db",background:store===s?"#fef3c7":"#fff",color:store===s?"#92400e":"#6b7280",fontSize:11,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap" }}>{s} ({n})</button>;
          })}
        </div>
      )}

      {/* Main scrollable content */}
      <div style={{ flex:1,overflowY:"auto",padding:12 }}>

        {scr === "grades" && (<>
          <div style={{ display:"flex",gap:2,marginBottom:10,background:"#f1f5f9",borderRadius:10,padding:3 }}>
            {[{k:false,l:"By Grade"},{k:true,l:"By Size"}].map(function(t) {
              return <button key={String(t.k)} onClick={function(){setSizeMode(t.k);setFilter("");setSizeQ("");}} style={{ flex:1,padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:sizeMode===t.k?"#fff":"transparent",color:sizeMode===t.k?accentColor:"#6b7280",boxShadow:sizeMode===t.k?"0 1px 3px rgba(0,0,0,0.1)":"none" }}>{t.l}</button>;
            })}
          </div>

          {!sizeMode ? (<>
            <input value={filter} onChange={function(e){setFilter(e.target.value);}} placeholder="Filter grades..." style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#fff",color:"#1a1a2e",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10 }} />
            {inS.length > 0 && <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,color:accentColor }}>In Stock ({inS.length})</div>}
            <div style={{ display:"flex",flexDirection:"column",gap:6,marginBottom:16 }}>
              {inS.map(function(g) { var s = gs(g.prefix); return (
                <button key={g.prefix} onClick={function(){pickGrade(g);}} style={{ border:"1px solid "+g.c+"30",background:"#fff",borderRadius:10,padding:"12px 14px",cursor:"pointer",textAlign:"left",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 1px 2px rgba(0,0,0,0.04)" }}>
                  <div><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontFamily:"monospace",fontWeight:800,fontSize:13,color:"#fff",background:g.c,padding:"2px 8px",borderRadius:5}}>{g.prefix}</span><span style={{fontSize:14,fontWeight:600,color:"#1a1a2e"}}>{g.l}</span></div><div style={{fontSize:11,color:"#6b7280",marginTop:4}}>{g.f}</div></div>
                  <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:14,fontWeight:700,color:g.c,fontFamily:"monospace"}}>{s.m.toLocaleString(undefined,{maximumFractionDigits:0})}</div><div style={{fontSize:10,color:"#6b7280"}}>Mtr • {s.n} sizes</div></div>
                </button>);
              })}
            </div>
            {noS.length > 0 && (<><div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6,color:"#9ca3af" }}>No Stock ({noS.length})</div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>{noS.map(function(g){return <div key={g.prefix} style={{padding:"8px 14px",borderRadius:10,background:"#f8f9fa",border:"1px solid #e5e7eb",display:"flex",justifyContent:"space-between",alignItems:"center",opacity:0.5}}><span style={{fontSize:13,color:"#9ca3af"}}>{g.prefix} — {g.l}</span><span style={{fontSize:11,color:"#d1d5db"}}>NIL</span></div>;})}</div></>)}
          </>) : (<>
            <input value={sizeQ} onChange={function(e){setSizeQ(e.target.value);}} placeholder="Search size... e.g. 63.50 x 3.25" style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#fff",color:"#1a1a2e",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:10 }} autoFocus />
            {sizeQ.trim() ? (sRes.length > 0 ? (<><div style={{fontSize:11,fontWeight:700,color:"#16a34a",marginBottom:6}}>Found {sRes.length} items</div>{sRes.map(function(i){return <ItemRow key={i.code+i.store} item={i} color={CK[i.prefix]?CK[i.prefix].c:"#6b7280"} hasStores={hasStores} />;})}</>) : <div style={{padding:30,textAlign:"center",color:"#dc2626",fontWeight:600}}>No items found</div>) : <div style={{padding:20,textAlign:"center",color:"#6b7280",fontSize:13}}>Type a size to search</div>}
          </>)}
        </>)}

        {scr === "sizes" && grade && (gradeItems.length === 0 ? <div style={{padding:30,textAlign:"center",color:"#dc2626",fontWeight:700}}>No Stock</div> : (<>
          <button onClick={function(){setOd(null);setThk(null);setScr("items");}} style={{border:"1px solid "+gc+"30",background:gc+"08",borderRadius:10,padding:"12px",cursor:"pointer",textAlign:"center",width:"100%",marginBottom:10}}><div style={{fontSize:14,fontWeight:700,color:gc}}>View All {gradeItems.length} Sizes</div></button>
          <div style={{fontSize:11,fontWeight:700,color:"#6b7280",marginBottom:8}}>SELECT OD</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{odList.map(function(o) { var oi = gradeItems.filter(function(i){var v=getOd(i.desc);return v!==null&&Math.abs(v-o)<0.01;}); return <button key={o} onClick={function(){pickOdFn(o);}} style={{border:"1px solid "+gc+"30",background:"#fff",borderRadius:10,padding:"10px 16px",cursor:"pointer",textAlign:"center",minWidth:90,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}><div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{o}</div><div style={{fontSize:10,color:"#6b7280",marginTop:3}}>{oi.length} • {oi.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div></button>; })}</div>
        </>))}

        {scr === "thk" && grade && od !== null && (<>
          <button onClick={function(){setThk(null);setScr("items");}} style={{border:"1px solid "+gc+"30",background:gc+"08",borderRadius:10,padding:"12px",cursor:"pointer",textAlign:"center",width:"100%",marginBottom:10}}><div style={{fontSize:14,fontWeight:700,color:gc}}>View All {odFiltered.length} for {od} OD</div></button>
          <div style={{fontSize:11,fontWeight:700,color:"#6b7280",marginBottom:8}}>SELECT THICKNESS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{thkList.map(function(t) { var ti = odFiltered.filter(function(i){var v=getThk(i.desc);return v!==null&&Math.abs(v-t)<0.01;}); return <button key={t} onClick={function(){setThk(t);setScr("items");}} style={{border:"1px solid "+gc+"30",background:"#fff",borderRadius:10,padding:"10px 16px",cursor:"pointer",textAlign:"center",minWidth:90,boxShadow:"0 1px 2px rgba(0,0,0,0.04)"}}><div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{t}</div><div style={{fontSize:10,color:"#6b7280",marginTop:3}}>{ti.length} • {ti.reduce(function(s,i){return s+i.mtr;},0).toLocaleString(undefined,{maximumFractionDigits:0})} Mtr</div></button>; })}</div>
        </>)}

        {scr === "items" && grade && (<div style={{display:"flex",flexDirection:"column",gap:6}}>
          <div style={{padding:"10px 14px",borderRadius:10,marginBottom:4,background:gc+"08",border:"1px solid "+gc+"20",display:"flex",justifyContent:"space-around",textAlign:"center"}}>
            {[{v:disp.length,l:"Items"},{v:tM.toLocaleString(undefined,{maximumFractionDigits:0}),l:"Meters"},{v:tN.toLocaleString(),l:"Pieces"},{v:tM>0?"₹"+Math.round(tV/tM).toLocaleString():"—",l:"Avg Rate/Mtr"}].map(function(s,i){return <div key={i}><div style={{fontSize:16,fontWeight:800,color:gc,fontFamily:"monospace"}}>{s.v}</div><div style={{fontSize:10,color:"#6b7280"}}>{s.l}</div></div>;})}
          </div>
          {disp.map(function(i){return <ItemRow key={i.code+i.store} item={i} color={gc} hasStores={hasStores} />;})}
        </div>)}
      </div>

      <div style={{ padding:"8px 16px",textAlign:"center",flexShrink:0,borderTop:"1px solid #e5e7eb",fontSize:10,color:"#9ca3af" }}>
        {reportDate ? "Stock as on " + reportDate : ""} • {items.length} items • ↻ to refresh
      </div>
    </>
  );
}

function SetupScreen(props) {
  var label = props.label, onConnect = props.onConnect;
  var _s1 = useState(""), url = _s1[0], setUrl = _s1[1];
  var _s2 = useState(false), loading = _s2[0], setLoading = _s2[1];
  var _s3 = useState(""), err = _s3[0], setErr = _s3[1];
  var getId = function(s) { var m = s.trim().match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/); return m ? m[1] : null; };
  var go = async function() {
    var id = getId(url); if (!id) { setErr("Paste the full Google Sheet link."); return; }
    setLoading(true); setErr("");
    try { var r = await fetch("/api/stock?sheetId="+id); var d = await r.json(); if (d.error) { setErr(d.error); setLoading(false); return; } onConnect(id, d); } catch(e) { setErr("Connection failed."); }
    setLoading(false);
  };
  return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24 }}>
      <div style={{ fontSize:20,fontWeight:800,color:"#1a1a2e",marginBottom:6 }}>Connect {label}</div>
      <div style={{ fontSize:12,color:"#6b7280",marginBottom:16,textAlign:"center",maxWidth:340 }}>Upload Spectrum Excel to Google Sheets, set sharing to "Anyone with the link", then paste the link below.</div>
      <div style={{ width:"100%",maxWidth:380 }}>
        <input value={url} onChange={function(e){setUrl(e.target.value);}} placeholder={"Paste "+label+" Google Sheet link..."} style={{ width:"100%",padding:"10px 14px",borderRadius:10,border:"1px solid #d1d5db",background:"#fff",color:"#1a1a2e",fontSize:13,outline:"none",marginBottom:10,boxSizing:"border-box" }} onKeyDown={function(e){if(e.key==="Enter")go();}} />
        <button onClick={go} disabled={loading||!url.trim()} style={{ width:"100%",padding:12,borderRadius:10,border:"none",background:url.trim()?"#f59e0b":"#e5e7eb",color:url.trim()?"#fff":"#9ca3af",fontWeight:700,fontSize:15,cursor:url.trim()?"pointer":"default" }}>{loading?"Connecting...":"Connect"}</button>
      </div>
      {err && <div style={{marginTop:14,padding:"10px 16px",borderRadius:10,background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",fontSize:12,maxWidth:380,textAlign:"center"}}>{err}</div>}
    </div>
  );
}

export default function App() {
  var _s1 = useState("mtube"), tab = _s1[0], setTab = _s1[1];
  var _s2 = useState({}), sheets = _s2[0], setSheets = _s2[1];
  var _s3 = useState({}), dataCache = _s3[0], setDataCache = _s3[1];
  var _s4 = useState(true), loading = _s4[0], setLoading = _s4[1];
  var _s5 = useState(false), rfr = _s5[0], setRfr = _s5[1];

  var fetchData = async function(sheetId) {
    try { var r = await fetch("/api/stock?sheetId="+sheetId); var d = await r.json(); return d.error ? null : d; }
    catch(e) { return null; }
  };

  var updateUrl = function(allSheets) {
    var parts = [];
    if (allSheets.mtube) parts.push("mtube=" + allSheets.mtube);
    if (allSheets.rushabh) parts.push("rushabh=" + allSheets.rushabh);
    var qs = parts.length > 0 ? "?" + parts.join("&") : window.location.pathname;
    window.history.replaceState({}, "", qs);
  };

  useEffect(function() {
    var p = new URLSearchParams(window.location.search);
    var saved = {};
    // Read from URL first, then localStorage fallback
    ["mtube","rushabh"].forEach(function(co) {
      var sid = p.get(co) || localStorage.getItem("stock-" + co);
      if (sid) { saved[co] = sid; localStorage.setItem("stock-" + co, sid); }
    });
    setSheets(saved);
    updateUrl(saved);

    // Load data for connected companies
    var promises = Object.keys(saved).map(function(co) {
      return fetchData(saved[co]).then(function(d) { return { co: co, data: d }; });
    });

    if (promises.length === 0) { setLoading(false); return; }

    Promise.all(promises).then(function(results) {
      var cache = {};
      results.forEach(function(r) { if (r.data) cache[r.co] = r.data; });
      setDataCache(cache);
      setLoading(false);
    });
  }, []);

  var onConnect = function(co, sheetId, data) {
    localStorage.setItem("stock-" + co, sheetId);
    var newSheets = Object.assign({}, sheets);
    newSheets[co] = sheetId;
    setSheets(newSheets);
    updateUrl(newSheets);
    var newCache = Object.assign({}, dataCache);
    newCache[co] = data;
    setDataCache(newCache);
  };

  var onRefresh = async function() {
    if (rfr || !sheets[tab]) return;
    setRfr(true);
    var d = await fetchData(sheets[tab]);
    if (d) { var c = Object.assign({}, dataCache); c[tab] = d; setDataCache(c); }
    setRfr(false);
  };

  if (loading) return <div style={{fontFamily:"'-apple-system',sans-serif",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff",color:"#b45309"}}>Loading...</div>;

  var tabStyle = function(id) {
    var active = tab === id;
    return { flex:1,padding:"10px 0",border:"none",cursor:"pointer",fontSize:14,fontWeight:700,background:active ? "#fff" : "transparent",color:active ? (id==="mtube" ? "#d97706" : "#059669") : "rgba(255,255,255,0.6)",borderBottom:active ? "3px solid " + (id==="mtube" ? "#f59e0b" : "#10b981") : "3px solid transparent" };
  };

  return (
    <div style={{fontFamily:"'-apple-system',sans-serif",height:"100vh",display:"flex",flexDirection:"column",background:"#fff",color:"#1a1a2e"}}>
      {/* Header with company tabs */}
      <div style={{ background:"linear-gradient(135deg,#1e3a5f,#1e40af)",flexShrink:0 }}>
        <div style={{ padding:"12px 16px",display:"flex",alignItems:"center",gap:10 }}>
          <div style={{ fontSize:15,fontWeight:800,color:"#fff" }}>Stock Query</div>
          <div style={{ flex:1 }}></div>
          <button onClick={onRefresh} disabled={rfr} style={{ background:"rgba(255,255,255,0.15)",border:"none",color:rfr?"rgba(255,255,255,0.4)":"#4ade80",padding:"4px 12px",borderRadius:6,cursor:"pointer",fontSize:13,fontWeight:700 }}>{rfr ? "..." : "↻"}</button>
        </div>
        <div style={{ display:"flex" }}>
          <button onClick={function(){setTab("mtube");}} style={tabStyle("mtube")}>Mtube</button>
          <button onClick={function(){setTab("rushabh");}} style={tabStyle("rushabh")}>Rushabh</button>
        </div>
      </div>

      {/* Content based on active tab */}
      {sheets[tab] && dataCache[tab] ? (
        <StockView data={dataCache[tab]} accentColor={tab === "mtube" ? "#d97706" : "#059669"} />
      ) : (
        <SetupScreen label={tab === "mtube" ? "Mtube" : "Rushabh"} onConnect={function(id, d) { onConnect(tab, id, d); }} />
      )}
    </div>
  );
}
