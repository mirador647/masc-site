"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, PencilLine, Save, ChevronLeft, ChevronRight, Wand2 } from "lucide-react";

type Entry = { id: string; when: string; title: string; reason?: string; needsReason?: boolean; };
const STORAGE = "tracker:entries";

function startOfMonth(d: Date) { const x = new Date(d); x.setDate(1); x.setHours(0,0,0,0); return x; }
function addMonths(d: Date, n: number) { const x = new Date(d); x.setMonth(x.getMonth() + n); return x; }
function daysGrid(view: Date) {
  const first = startOfMonth(view);
  const startDay = new Date(first);
  const weekday = (first.getDay() + 6) % 7;
  startDay.setDate(first.getDate() - weekday);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) { const c = new Date(startDay); c.setDate(startDay.getDate() + i); cells.push(c); }
  return cells;
}

export default function TrackerPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [when, setWhen] = useState<string>(() => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,16); });
  const [title, setTitle] = useState(""); const [reason, setReason] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]); const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState(""); const [from, setFrom] = useState<string>(""); const [to, setTo] = useState<string>("");
  const [view, setView] = useState<Date>(() => new Date());
  const router = useRouter();

  useEffect(() => { try { setEntries(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(entries)); }, [entries]);

  const saveEntry = (e: Entry) => setEntries((prev) => [e, ...prev].slice(0, 1000));
  const updateEntry = (id: string, patch: Partial<Entry>) => setEntries((arr) => arr.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  const deleteEntry = (id: string) => setEntries((arr) => arr.filter((e) => e.id !== id));

  const onNext = () => { if (title.trim()) setStep(2); };
  const onSave = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36);
    saveEntry({ id, when: new Date(when).toISOString(), title: title.trim(), reason: reason.trim() || undefined });
    setTitle(""); setReason(""); setStep(1);
  };

  const onIDontKnow = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36);
    const entry: Entry = { id, when: new Date(when).toISOString(), title: title.trim(), needsReason: true };
    saveEntry(entry);
    const qs = new URLSearchParams({ ctx: `Aide-moi à identifier les causes possibles de "${entry.title}" le ${new Date(entry.when).toLocaleString()}.`, ref: entry.id }).toString();
    router.push(`/ai?${qs}`);
  };

  const suggestReasons = async () => {
    if (!title.trim()) return;
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
        message: `Contexte: "${title}" / ${new Date(when).toLocaleString()}. Donne 3–5 causes probables et 3 actions concrètes (puces).`
      })});
      const data = await res.json();
      const add = data?.reply ?? "";
      if (add) setReason(prev => (prev ? prev + "\n\n" + add : add));
    } catch {
      setReason(prev => (prev ? prev + "\n\n⚠️ Erreur de l’IA" : "⚠️ Erreur de l’IA"));
    }
  };

  const filtered = useMemo(() => {
    const fromD = from ? new Date(from) : null; const toD = to ? new Date(to) : null;
    return entries.filter((e) => {
      const d = new Date(e.when);
      if (fromD && d < fromD) return false;
      if (toD && d > toD) return false;
      if (q && !(`${e.title} ${e.reason ?? ""}`.toLowerCase().includes(q.toLowerCase()))) return false;
      return true;
    });
  }, [entries, q, from, to]);

  const countByDay = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of entries) { const k = e.when.slice(0,10); map[k] = (map[k] || 0) + 1; }
    return map;
  }, [entries]);

  const grid = daysGrid(view); const ym = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,"0")}`;

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Suivi & Calendrier</h1>

      {/* Calendrier */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <button onClick={() => setView(addMonths(view, -1))} className="px-3 py-2 rounded-xl border border-purple-700/40 hover:bg-purple-700/10"><ChevronLeft size={16}/></button>
          <div className="text-lg font-semibold">{view.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <button onClick={() => setView(addMonths(view, 1))} className="px-3 py-2 rounded-xl border border-purple-700/40 hover:bg-purple-700/10"><ChevronRight size={16}/></button>
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-400">{["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"].map(d => <div key={d} className="text-center py-1">{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {grid.map((d, i) => {
            const inMonth = ym(d) === ym(view);
            const key = d.toISOString().slice(0,10);
            const cnt = countByDay[key] || 0;
            return (
              <button key={i} onClick={() => { setFrom(key); setTo(key); }}
                className={`h-16 rounded-xl border text-sm flex flex-col items-center justify-center ${inMonth ? "border-purple-700/40 bg-black/40" : "border-gray-800 bg-black/20 text-gray-500"} hover:bg-purple-700/10`}
                title={cnt ? `${cnt} entrées` : "Aucune entrée"}>
                <div className="font-semibold">{d.getDate()}</div>
                <div className="text-xs text-purple-300">{cnt ? `${cnt}` : " "}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Form */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date & heure</label>
                <input type="datetime-local" value={when} onChange={(e)=>setWhen(e.target.value)}
                  className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3" />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Péché (intitulé)</label>
                <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="ex: retard de prière, médisance…"
                  className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3" />
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button onClick={onNext} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Suivant</button>
              <button onClick={onIDontKnow} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">Je ne sais pas (→ IA)</button>
              <button onClick={suggestReasons} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2">
                <Wand2 size={16}/> Proposer des causes (IA)
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <p className="text-sm text-gray-400 mb-2">Péché : <span className="text-gray-200 font-medium">{title || "—"}</span></p>
            <label className="block text-sm text-gray-400 mb-2">Raison (pourquoi ?)</label>
            <textarea value={reason} onChange={(e)=>setReason(e.target.value)}
              className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3 min-h-[140px]" placeholder="Analyse, déclencheurs, contexte…" />
            <div className="flex flex-wrap gap-3 mt-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">Retour</button>
              <button onClick={onSave} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Enregistrer</button>
              <button onClick={onIDontKnow} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">Je ne sais pas (→ IA)</button>
              <button onClick={suggestReasons} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2">
                <Wand2 size={16}/> Proposer des causes (IA)
              </button>
            </div>
          </>
        )}
      </section>

      {/* Filtres */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <h2 className="text-2xl font-bold">Filtrer</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <input className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" placeholder="Recherche mot-clé…" value={q} onChange={(e)=>setQ(e.target.value)} />
          <input type="date" className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" value={from} onChange={(e)=>setFrom(e.target.value)} />
          <input type="date" className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" value={to} onChange={(e)=>setTo(e.target.value)} />
          <button className="px-4 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10" onClick={()=>{ setQ(""); setFrom(""); setTo(""); }}>Réinitialiser</button>
        </div>
      </section>

      {/* Liste */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Historique</h2>
        {filtered.length === 0 && <p className="text-gray-400">Aucune entrée avec ces filtres.</p>}
        <ul className="space-y-3">
          {filtered.map((e) => (
            <li key={e.id} className="border border-purple-700/30 rounded-xl p-3 bg-black/40">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="text-xs text-gray-400">{new Date(e.when).toLocaleString()}</div>
                  <div className="font-medium">{e.title}</div>
                  {editing === e.id ? (
                    <textarea className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-2 mt-2"
                      defaultValue={e.reason || ""} onChange={(ev)=>updateEntry(e.id, { reason: ev.target.value })} />
                  ) : (
                    <div className="text-gray-300 text-sm mt-1">{e.reason ? e.reason : <em className="text-amber-300">Raison manquante.</em>}</div>
                  )}
                </div>
                <div className="flex gap-2 shrink-0">
                  {editing === e.id ? (
                    <button onClick={()=>setEditing(null)} className="px-3 py-2 rounded-lg border border-green-700/50 hover:bg-green-700/10 inline-flex items-center gap-2 text-sm"><Save size={16}/> OK</button>
                  ) : (
                    <button onClick={()=>setEditing(e.id)} className="px-3 py-2 rounded-lg border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2 text-sm"><PencilLine size={16}/> Éditer</button>
                  )}
                  <button className="px-3 py-2 rounded-lg border border-purple-700/40 hover:bg-purple-700/10 text-sm"
                    onClick={() => {
                      const params = new URLSearchParams({ ctx: `Analyse "${e.title}" le ${new Date(e.when).toLocaleString()}${e.reason ? `, raison: ${e.reason}` : ""}.`, ref: e.id }).toString();
                      location.href = `/ai?${params}`;
                    }}>Demander à l’IA</button>
                  <button onClick={()=>deleteEntry(e.id)} className="px-3 py-2 rounded-lg border border-rose-700/50 hover:bg-rose-700/10 inline-flex items-center gap-2 text-sm"><Trash2 size={16}/> Supprimer</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
