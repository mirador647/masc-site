// src/components/QuickJournal.tsx
"use client";

import { useEffect, useState } from "react";

type J = { id: string; when: string; text: string };

const KEY = "journal:entries";

export default function QuickJournal() {
  const [open, setOpen] = useState(false);
  const [when, setWhen] = useState(() => {
    const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  });
  const [text, setText] = useState("");

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("avara:open-quick-journal", onOpen as any);
    return () => window.removeEventListener("avara:open-quick-journal", onOpen as any);
  }, []);

  const save = () => {
    if (!text.trim()) return;
    const id = Date.now().toString(36);
    let arr: J[] = [];
    try { arr = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch {}
    arr.unshift({ id, when: new Date(when).toISOString(), text: text.trim() });
    localStorage.setItem(KEY, JSON.stringify(arr));
    setText(""); setOpen(false);
  };

  const toAI = () => {
    if (!text.trim()) return;
    const ctx = encodeURIComponent(`Analyse ceci et propose 3 actions concrètes:\n${text.trim()}\n(${new Date(when).toLocaleString()})`);
    location.href = `/ai?ctx=${ctx}`;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={()=>setOpen(false)}>
      <div className="w-full max-w-lg rounded-2xl border border-purple-700/40 bg-gray-900/95 p-5" onClick={e=>e.stopPropagation()}>
        <h3 className="text-xl font-bold text-purple-300 mb-3">Journal rapide</h3>
        <div className="grid gap-3">
          <input
            type="datetime-local"
            value={when}
            onChange={(e)=>setWhen(e.target.value)}
            className="bg-black/40 border border-purple-700/40 rounded-xl px-3 py-2"
          />
          <textarea
            value={text}
            onChange={(e)=>setText(e.target.value)}
            placeholder="Note, pensée, événement…"
            className="min-h-[120px] bg-black/40 border border-purple-700/40 rounded-xl p-3"
          />
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button onClick={()=>setOpen(false)} className="px-4 py-2 rounded-xl border border-purple-700/40 hover:bg-purple-700/10">Annuler</button>
          <button onClick={toAI} className="px-4 py-2 rounded-xl border border-purple-700/40 hover:bg-purple-700/10">Je ne sais pas (→ IA)</button>
          <button onClick={save} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700">Enregistrer</button>
        </div>
      </div>
    </div>
  );
}
