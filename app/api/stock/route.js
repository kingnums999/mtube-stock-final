import * as XLSX from 'xlsx';

const SP = ['P304S1','P304E1','P316S1','P316E1','P304S','P304E','P316S','P316E','PFI','PA','PB','PC','PD','PE','PF','PG','PH','PI','PJ','PK','PL','PM','PN','PO','PP','PQ','PR','PS','PT','PU','PV','PW'];

function parseSheet(buffer) {
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  const items = [];
  let store = "ALL", cat = null, reportDate = "", hasStores = false;
  const stores = new Set();

  for (const row of rows) {
    const c0 = String(row[0] || "").trim(), c1 = String(row[1] || "").trim();
    if (c0.includes("as on") || c0.includes("As on")) { const m = c0.match(/as on\s+(\d{2}\/\d{2}\/\d{4})/i); if (m) reportDate = m[1]; }
    if (c0.includes("Date")) { const m = c0.match(/Date\s*:?\s*(\d{2}\/\d{2}\/\d{4})/i); if (m) reportDate = m[1]; }
    if (/^\*\s+Store\s*:/i.test(c0)) { store = c0.replace(/\*/g,"").replace(/Store\s*:/i,"").trim() || "?"; stores.add(store); hasStores = true; continue; }
    if (c0.startsWith("***") && !c0.includes("Total")) { cat = c0.replace(/\*/g,"").trim(); continue; }
    if (c0.startsWith("**") && !c0.includes("Total")) { const t = c0.replace(/\*/g,"").trim(); if (t) cat = t; continue; }
    if (!c0 || c0.startsWith("*") || c0 === "Item Code" || c0.includes("MANHAR") || c0.includes("Date") || c0.includes("Itemwise") || c0.includes("Total") || c0.includes("Store-Itemwise")) continue;
    let prefix = "";
    for (const p of SP) { if (c0.startsWith(p)) { prefix = p; break; } }
    if (!prefix) continue;
    const mtr = parseFloat(row[2]) || 0;
    const val = parseFloat(row[6]) || 0;
    items.push({ code: c0, prefix, cat: cat || "", desc: c1, mtr, unit: String(row[3]||"Mtr").trim(), nos: parseInt(row[4])||0, val, rate: mtr > 0 ? Math.round(val / mtr) : 0, store });
  }
  return { items, reportDate, totalItems: items.length, stores: hasStores ? [...stores].sort() : [], hasStores };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const sheetId = searchParams.get('sheetId');
  if (!sheetId) return Response.json({ error: "No sheetId" }, { status: 400 });
  try {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`, { headers: { 'User-Agent': 'MtubeStock/3' } });
    if (!res.ok) return Response.json({ error: "Cannot fetch sheet. Set sharing to 'Anyone with the link can view'." }, { status: 400 });
    const buf = await res.arrayBuffer();
    const data = parseSheet(new Uint8Array(buf));
    if (data.totalItems === 0) return Response.json({ error: "No stock items found." }, { status: 400 });
    return Response.json({ ...data, fetchedAt: new Date().toISOString() });
  } catch (e) { return Response.json({ error: "Failed: " + e.message }, { status: 500 }); }
}
