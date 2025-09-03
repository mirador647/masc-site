"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Save } from "lucide-react";

type Repent = { regret: boolean; stop: boolean; resolve: boolean };
type Sin = { id: string; when: string; category: string; severity: number; note?: string; repent?: Repent; needsReason?: boolean; };
const STORAGE = "sins:entries";
const CATS = ["Langue","Regard","Temps","Prière","Colère","Réseaux","Autre"];

export default function SinsPage() {
  const [when, setWhen] = useState<string>(() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,16); });
  const [category, setCategory] = useState("Langue"); const [severity, setSeverity] = useState(3); const [note, setNote] = useState("");
  const [q, setQ] = useState(""); const [catFilter, setCatFilter] = useState<string>(""); const [from, setFrom] = useState<string>(""); const [to, setTo] = useState<string>("");
  const [items, setItems] = useState<Sin[]>([]); const [editing, setEditing] = useState<string | null>(null); const router = useRouter();

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(items)); }, [items]);

  const add = () => { const id = Date.now().toString(36); const entry: Sin = { id, when: new Date(when).toISOString(), category, severity, note: note.trim() || undefined }; setItems((arr) => [entry, ...arr]); setNote(""); };
  const remove = (id: string) => setItems((arr) => arr.filter((e) => e.id !== id));
  const patch  = (id: string, p: Partial<Sin>) => setItems((arr) => arr.map((e) => (e.id === id ? { ...e, ...p } : e)));

  const askAI = (s: Sin) => {
    patch(s.id, { needsReason: true });
    const params = new URLSearchParams({ ctx: `Aide-moi à analyser ce péché (cat: ${s.category}, sévérité: ${s.severity}/5) le ${new Date(s.when).toLocaleString()}${s.note ? `, note: ${s.note}` : ""}.`, ref: s.id }).toString();
    router.push(`/ai?${params}`);
  };

  const filtered = useMemo(() => {
    const fromD = from ? new Date(from) : null; const toD = to ? new Date(to) : null;
    return items.filter((e) => {
      const d = new Date(e.when);
      if (fromD && d < fromD) return false;
      if (toD && d > toD) return false;
      if (catFilter && e.category !== catFilter) return false;
      if (q && !(`${e.category} ${e.note ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [items, q, catFilter, from, to]);

  const streaks = useMemo(() => {
    const now = new Date(); const lastMap: Record<string, Date | null> = {}; CATS.forEach(c => (lastMap[c] = null));
    for (const s of items) { const d = new Date(s.when); if (!lastMap[s.category] || d > (lastMap[s.category] as Date)) lastMap[s.category] = d; }
    const res = Object.fromEntries(CATS.map((c) => { const last = lastMap[c]; if (!last) return [c, "—"]; const diff = Math.floor((+now - +last) / 86400000); return [c, `${diff} j`]; }));
    return res as Record<string, string>;
  }, [items]);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(items, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "sins-export.json"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Péchomètre</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-4 gap-3">
          <input type="datetime-local" value={when} onChange={(e)=>setWhen(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2"/>
          <select value={category} onChange={(e)=>setCategory(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2">{CATS.map(c => <option key={c}>{c}</option>)}</select>
          <div className="flex items-center gap-2"><label className="text-sm text-gray-300">Sévérité</label><input type="range" min={1} max={5} value={severity} onChange={(e)=>setSeverity(Number(e.target.value))}/><span className="text-purple-300">{severity}/5</span></div>
          <button onClick={add} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700">Enregistrer</button>
        </div>
        <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note / contexte (optionnel)…" className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3 min-h-[80px]"/>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Streaks par catégorie</h2>
        <div className="grid md:grid-cols-3 gap-3">
          {CATS.map(c => <div key={c} className="border border-purple-700/30 rounded-xl p-4 bg-black/40 flex items-center justify-between"><div className="font-semibold">{c}</div><div className="text-2xl">{streaks[c]}</div></div>)}
        </div>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Filtrer</h2>
        <div className="grid md:grid-cols-5 gap-3">
          <input className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" placeholder="Recherche…" value={q} onChange={(e)=>setQ(e.target.value)} />
          <select value={catFilter} onChange={(e)=>setCatFilter(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2">
            <option value="">Toutes catégories</option>{CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2"/>
          <input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2"/>
          <button onClick={()=>{ setQ(""); setCatFilter(""); setFrom(""); setTo(""); }} className="px-4 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">Réinitialiser</button>
        </div>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Historique</h2>
          <button onClick={exportJSON} className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 text-sm">Export JSON</button>
        </div>
        {filtered.length === 0 ? <p className="text-gray-400">Aucune entrée avec ces filtres.</p> : (
          <ul className="space-y-3">
            {filtered.map(e => (
              <li key={e.id} className="border border-purple-700/30 rounded-xl p-4 bg-black/40">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[240px]">
                    <div className="text-xs text-gray-400">{new Date(e.when).toLocaleString()}</div>
                    <div className="font-semibold">{e.category} • <span className="text-purple-300">Sévérité {e.severity}/5</span></div>
                    {editing === e.id ? (
                      <textarea defaultValue={e.note || ""} onChange={(ev)=>patch(e.id, { note: ev.target.value })}
                        className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-2 mt-2"/>
                    ) : <div className="text-gray-300 text-sm mt-1">{e.note || <em className="text-amber-300">Pas de note.</em>}</div>}

                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      {(["regret","stop","resolve"] as const).map(key => (
                        <label key={key} className="flex items-center gap-2">
                          <input type="checkbox" checked={!!e.repent?.[key]}
                            onChange={(ev) => { const r: Repent = { regret: !!e.repent?.regret, stop: !!e.repent?.stop, resolve: !!e.repent?.resolve }; r[key] = ev.target.checked; patch(e.id, { repent: r }); }} />
                          {key === "regret" ? "Regret" : key === "stop" ? "Arrêt immédiat" : "Résolution sincère"}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {editing === e.id ? (
                      <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded-lg border border-green-700/50 hover:bg-green-700/10 text-sm inline-flex items-center gap-2"><Save size={16}/> OK</button>
                    ) : (
                      <button onClick={()=>setEditing(e.id)} className="px-3 py-2 rounded-lg border border-purple-700/50 hover:bg-purple-700/10 text-sm">Éditer</button>
                    )}
                    <button onClick={()=>askAI(e)} className="px-3 py-2 rounded-lg border border-purple-700/40 hover:bg-purple-700/10 text-sm">Je ne sais pas (→ IA)</button>
                    <button onClick={()=>remove(e.id)} className="px-3 py-2 rounded-lg border border-rose-700/50 hover:bg-rose-700/10 text-sm inline-flex items-center gap-2"><Trash2 size={16}/> Supprimer</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
