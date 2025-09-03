// src/components/CommandK.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Action = {
  id: string;
  label: string;
  hint?: string;
  run: () => void;
};

export default function CommandK() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  // Actions disponibles (tu peux en ajouter)
  const actions: Action[] = [
    { id: "ai", label: "Parler à l’IA", hint: "Chat", run: () => (location.href = "/ai") },
    { id: "quick", label: "Journal rapide", hint: "Ajouter une entrée", run: () => window.dispatchEvent(new CustomEvent("avara:open-quick-journal")) },
    { id: "quran", label: "Lire le Coran", hint: "FR & AR", run: () => (location.href = "/quran") },
    { id: "tracker", label: "Suivi & Calendrier", run: () => (location.href = "/tracker") },
    { id: "sins", label: "Péchomètre", run: () => (location.href = "/sins") },
    { id: "planner", label: "Planificateur", run: () => (location.href = "/planner") },
    { id: "goals", label: "Objectifs", run: () => (location.href = "/goals") },
    { id: "stats", label: "Statistiques", run: () => (location.href = "/stats") },
    {
      id: "theme",
      label: "Basculer le thème",
      hint: "Clair/Sombre",
      run: () => {
        const cur = document.documentElement.classList.contains("dark") ? "dark" : "light";
        const next = cur === "dark" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        localStorage.setItem("theme", next);
      },
    },
  ];

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return actions;
    return actions.filter(a => (a.label + " " + (a.hint || "")).toLowerCase().includes(s));
  }, [q]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "k") {
        e.preventDefault(); setOpen((o) => !o); setQ(""); setIdx(0);
      } else if (open) {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
        if (e.key === "Enter") { e.preventDefault(); filtered[idx]?.run(); setOpen(false); }
      }
    };
    const onToggle = () => setOpen((o) => !o);
    window.addEventListener("keydown", onKey);
    window.addEventListener("avara:toggle-cmdk", onToggle as any);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("avara:toggle-cmdk", onToggle as any);
    };
  }, [open, filtered, idx]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-purple-700/40 bg-gray-900/95 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-purple-700/30">
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            placeholder="Que veux-tu faire ? (⌘K / Ctrl+K)"
            className="w-full bg-black/40 text-white rounded-xl px-3 py-3 outline-none"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto py-2">
          {filtered.map((a, i) => (
            <li
              key={a.id}
              className={`px-4 py-3 cursor-pointer flex items-center justify-between ${
                i === idx ? "bg-purple-700/20" : "hover:bg-purple-700/10"
              }`}
              onMouseEnter={() => setIdx(i)}
              onClick={() => { a.run(); setOpen(false); }}
            >
              <span className="text-white">{a.label}</span>
              {a.hint && <span className="text-xs text-gray-400">{a.hint}</span>}
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-gray-400">Aucun résultat</li>
          )}
        </ul>
      </div>
    </div>
  );
}
