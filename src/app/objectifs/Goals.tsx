"use client";
import { useEffect, useState } from "react";

type Goal = { id: string; text: string; done: boolean };
const KEY = "avara_goals_v1";

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setGoals(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(goals));
    } catch {}
  }, [goals]);

  function addGoal() {
    const t = input.trim();
    if (!t) return;
    setGoals((g) => [{ id: crypto.randomUUID(), text: t, done: false }, ...g]);
    setInput("");
  }

  function toggle(id: string) {
    setGoals((g) => g.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  }

  function remove(id: string) {
    setGoals((g) => g.filter((x) => x.id !== id));
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 rounded-xl border px-4 py-2"
          placeholder="Ajouter un objectif…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addGoal()}
        />
        <button onClick={addGoal} className="rounded-xl border px-4 py-2 hover:bg-black/5">
          Ajouter
        </button>
      </div>

      <ul className="space-y-2">
        {goals.map((g) => (
          <li key={g.id} className="flex items-center justify-between rounded-lg border p-3">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={g.done} onChange={() => toggle(g.id)} />
              <span className={g.done ? "line-through opacity-60" : ""}>{g.text}</span>
            </label>
            <button onClick={() => remove(g.id)} className="opacity-60 hover:opacity-100">
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}