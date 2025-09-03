"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { Trash2, Check, Clock } from "lucide-react";

type Goal = { id: string; title: string; why?: string; target?: string; progress: number; done?: boolean; createdAt: string; };
const STORAGE = "goals:list";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [title, setTitle] = useState(""); const [why, setWhy] = useState(""); const [target, setTarget] = useState("");

  useEffect(() => { try { setGoals(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(STORAGE, JSON.stringify(goals)); }, [goals]);

  const add = () => { if (!title.trim()) return;
    const id = Date.now().toString(36);
    setGoals([{ id, title: title.trim(), why: why.trim() || undefined, target: target || undefined, progress: 0, createdAt: new Date().toISOString() }, ...goals]);
    setTitle(""); setWhy(""); setTarget("");
  };
  const remove = (id: string) => setGoals(arr => arr.filter(g => g.id !== id));
  const toggle = (id: string) => setGoals(arr => arr.map(g => g.id === id ? { ...g, done: !g.done, progress: g.done ? g.progress : 100 } : g));
  const setProgress = (id: string, p: number) => setGoals(arr => arr.map(g => g.id === id ? { ...g, progress: p, done: p >= 100 } : g));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Objectifs</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input placeholder="Titre (spécifique)…" value={title} onChange={(e)=>setTitle(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
          <input placeholder="Pourquoi ? (mesurable / atteignable…)" value={why} onChange={(e)=>setWhy(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
          <input type="date" value={target} onChange={(e)=>setTarget(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
        </div>
        <button onClick={add} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Ajouter</button>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Mes objectifs</h2>
        {goals.length === 0 ? <p className="text-gray-400">Aucun objectif pour l’instant.</p> : (
          <ul className="space-y-3">
            {goals.map(g => (
              <li key={g.id} className="border border-purple-700/30 rounded-xl p-4 bg-black/40">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-400">{new Date(g.createdAt).toLocaleDateString()}{g.target ? (<> • <Clock className="inline" size={12}/> cible: {new Date(g.target).toLocaleDateString()}</>) : null}</div>
                    <div className={`font-semibold ${g.done ? "line-through text-gray-400" : ""}`}>{g.title}</div>
                    {g.why && <div className="text-gray-300 text-sm mt-1">{g.why}</div>}
                    <div className="mt-3">
                      <input type="range" min={0} max={100} value={g.progress} onChange={(e)=>setProgress(g.id, Number(e.target.value))} className="w-full" />
                      <div className="text-sm text-gray-400">{g.progress}%</div>
                      <div className="h-2 bg-gray-800 rounded-full mt-1"><div className="h-2 bg-purple-600 rounded-full" style={{ width: `${g.progress}%` }}/></div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>toggle(g.id)} className="px-3 py-2 rounded-lg border border-green-700/50 hover:bg-green-700/10 inline-flex items-center gap-2 text-sm"><Check size={16}/> {g.done ? "En cours" : "Terminer"}</button>
                    <button onClick={()=>remove(g.id)} className="px-3 py-2 rounded-lg border border-rose-700/50 hover:bg-rose-700/10 inline-flex items-center gap-2 text-sm"><Trash2 size={16}/> Supprimer</button>
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
