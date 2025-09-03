"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

type H = { id: string; ref?: string; text: string; createdAt: string };
const KEY = "hadiths:notes";

export default function HadithsPage() {
  const [items, setItems] = useState<H[]>([]);
  const [ref, setRef] = useState(""); const [text, setText] = useState("");

  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {} }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = () => { if (!text.trim()) return;
    const id = Date.now().toString(36);
    setItems([{ id, ref: ref.trim() || undefined, text: text.trim(), createdAt: new Date().toISOString() }, ...items]);
    setRef(""); setText("");
  };
  const remove = (id: string) => setItems(arr => arr.filter(i => i.id !== id));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Hadiths (notes)</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-3">
        <input value={ref} onChange={(e)=>setRef(e.target.value)} placeholder="Référence (optionnel)…"
          className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
        <textarea value={text} onChange={(e)=>setText(e.target.value)} placeholder="Texte ou note…"
          className="min-h-[120px] bg-black/50 border border-purple-700/40 rounded-xl p-3" />
        <button onClick={add} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Ajouter</button>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Mes notes</h2>
        {items.length === 0 ? <p className="text-gray-400">Aucune note.</p> : (
          <ul className="space-y-3">
            {items.map(i => (
              <li key={i.id} className="border border-purple-700/30 rounded-xl p-4 bg-black/40">
                <div className="text-xs text-gray-400">{new Date(i.createdAt).toLocaleString()} {i.ref && <>• <span className="text-purple-300">{i.ref}</span></>}</div>
                <div className="mt-1 whitespace-pre-wrap">{i.text}</div>
                <div className="mt-2"><button onClick={()=>remove(i.id)} className="px-3 py-2 rounded-lg border border-rose-700/50 hover:bg-rose-700/10 inline-flex items-center gap-2 text-sm"><Trash2 size={16}/> Supprimer</button></div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
