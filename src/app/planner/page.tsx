"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { Trash2, Check } from "lucide-react";

type Task = { id: string; text: string; date: string; time?: string; done?: boolean };
const KEY = "planner:tasks";

export default function PlannerPage() {
  const [items, setItems] = useState<Task[]>([]);
  const [text, setText] = useState(""); const [date, setDate] = useState(()=>new Date().toISOString().slice(0,10)); const [time, setTime] = useState("");

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = () => { if (!text.trim()) return;
    const id = Date.now().toString(36);
    setItems([{ id, text: text.trim(), date, time: time || undefined, done: false }, ...items]);
    setText(""); setTime("");
  };
  const toggle = (id: string) => setItems(arr => arr.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const remove = (id: string) => setItems(arr => arr.filter(t => t.id !== id));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Planificateur</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-3">
        <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Tâche…" className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
        <div className="grid grid-cols-2 gap-3">
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
          <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
        </div>
        <button onClick={add} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Ajouter</button>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Tâches</h2>
        {items.length === 0 ? <p className="text-gray-400">Aucune tâche.</p> : (
          <ul className="space-y-3">
            {items.map(i => (
              <li key={i.id} className="border border-purple-700/30 rounded-xl p-4 bg-black/40 flex items-center justify-between gap-3">
                <div className={`flex-1 ${i.done ? "line-through text-gray-500" : ""}`}>
                  <div className="text-sm text-gray-400">{i.date}{i.time ? ` • ${i.time}` : ""}</div>
                  <div>{i.text}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>toggle(i.id)} className="px-3 py-2 rounded-lg border border-green-700/50 hover:bg-green-700/10 inline-flex items-center gap-2 text-sm"><Check size={16}/> {i.done ? "Rouvrir" : "Terminer"}</button>
                  <button onClick={()=>remove(i.id)} className="px-3 py-2 rounded-lg border border-rose-700/50 hover:bg-rose-700/10 inline-flex items-center gap-2 text-sm"><Trash2 size={16}/> Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
