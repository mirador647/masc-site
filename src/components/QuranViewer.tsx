"use client";
import React, { useEffect, useMemo, useState } from "react";

type Verse = { s: number; a: number; t: string };

export default function QuranViewer({ path, rtl = false }: { path: string; rtl?: boolean }) {
  const [data, setData] = useState<Verse[]>([]);
  const [q, setQ] = useState("");
  const [sourah, setSourah] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(path, { cache: "force-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as Verse[];
        if (!cancelled) {
          setData(Array.isArray(json) ? json : []);
          setError(null);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Erreur");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [path]);

  const bySurah = useMemo(() => {
    const map = new Map<number, Verse[]>();
    for (const v of data) {
      const arr = map.get(v.s) ?? [];
      arr.push(v);
      map.set(v.s, arr);
    }
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [data]);

  const filtered = useMemo(() => {
    const base = sourah === "all" ? data : data.filter((v) => v.s === sourah);
    if (!q.trim()) return base;
    const needle = q.trim().toLowerCase();
    return base.filter((v) => v.t.toLowerCase().includes(needle));
  }, [q, data, sourah]);

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Rechercher un mot…"
          className="w-full sm:w-1/2 rounded-xl border px-4 py-2 outline-none focus:ring"
        />
        <select
          value={sourah}
          onChange={(e) => setSourah(e.target.value === "all" ? "all" : Number(e.target.value))}
          className="rounded-xl border px-3 py-2"
        >
          <option value="all">Toutes les sourates</option>
          {bySurah.map(([id]) => (
            <option key={id} value={id}>
              Sourate {id}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Chargement…</p>}
      {error && <p className="text-red-600">Erreur de chargement : {error}</p>}

      <div dir={rtl ? "rtl" : "ltr"} className="space-y-2 leading-8">
        {filtered.map((v) => (
          <p key={`${v.s}-${v.a}`} className="rounded-lg bg-black/5 p-3 dark:bg-white/5">
            <span className="opacity-60 mr-2">[{v.s}:{v.a}]</span>
            <span>{v.t}</span>
          </p>
        ))}
        {!loading && !error && filtered.length === 0 && (
          <p>Aucun verset ne correspond à la recherche.</p>
        )}
      </div>
    </div>
  );
}