"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useMemo, useState } from "react";

type Sin = { id: string; when: string; category: string; severity: number };
type Entry = { id: string; when: string; title: string; };

export default function StatsPage() {
  const [sins, setSins] = useState<Sin[]>([]);
  const [tracker, setTracker] = useState<Entry[]>([]);

  useEffect(() => {
    try { setSins(JSON.parse(localStorage.getItem("sins:entries") || "[]")); } catch {}
    try { setTracker(JSON.parse(localStorage.getItem("tracker:entries") || "[]")); } catch {}
  }, []);

  const perCat = useMemo(() => {
    const map: Record<string, number> = {};
    sins.forEach(s => { map[s.category] = (map[s.category] || 0) + 1; });
    return Object.entries(map).sort((a,b)=>b[1]-a[1]);
  }, [sins]);

  const perDay = useMemo(() => {
    const map: Record<string, number> = {};
    tracker.forEach(t => { const k = t.when.slice(0,10); map[k] = (map[k] || 0) + 1; });
    return Object.entries(map).sort();
  }, [tracker]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Statistiques</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Péchés par catégorie</h2>
        {perCat.length === 0 ? <p className="text-gray-400">Aucune donnée.</p> : (
          <ul className="space-y-2">{perCat.map(([c, n]) => (
            <li key={c} className="flex items-center gap-3">
              <div className="w-32">{c}</div>
              <div className="h-2 flex-1 bg-gray-800 rounded-full"><div className="h-2 bg-purple-600 rounded-full" style={{ width: `${Math.min(100, n*10)}%` }}/></div>
              <div className="w-10 text-right">{n}</div>
            </li>
          ))}</ul>
        )}
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Entrées du suivi par jour</h2>
        {perDay.length === 0 ? <p className="text-gray-400">Aucune donnée.</p> : (
          <ul className="space-y-1">{perDay.map(([d, n]) => (
            <li key={d} className="flex items-center justify-between">
              <div>{new Date(d).toLocaleDateString()}</div><div className="text-purple-300">{n}</div>
            </li>
          ))}</ul>
        )}
      </section>
    </main>
  );
}
