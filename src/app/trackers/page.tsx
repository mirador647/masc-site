"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Entry = {
  id: string;
  when: string;   // ISO
  title: string;  // péché
  reason?: string;
  needsReason?: boolean;
};

const STORAGE = "tracker:entries";

export default function TrackerPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [when, setWhen] = useState<string>(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [title, setTitle] = useState("");
  const [reason, setReason] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const router = useRouter();

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(entries));
  }, [entries]);

  const save = (e: Entry) => {
    setEntries((prev) => [e, ...prev].slice(0, 500));
  };

  const onNext = () => {
    if (!title.trim()) return;
    setStep(2);
  };

  const onSave = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36);
    save({ id, when: new Date(when).toISOString(), title: title.trim(), reason: reason.trim() || undefined });
    setTitle(""); setReason(""); setStep(1);
  };

  const onIDontKnow = () => {
    if (!title.trim()) return;
    const id = Date.now().toString(36);
    const entry: Entry = { id, when: new Date(when).toISOString(), title: title.trim(), needsReason: true };
    save(entry);

    // on passe le contexte à la page IA
    const q = new URLSearchParams({
      ctx: `Aide-moi à identifier les causes possibles de ce péché: "${entry.title}" le ${new Date(entry.when).toLocaleString()}.`,
      ref: entry.id
    }).toString();
    router.push(`/ai?${q}`);
  };

  const byDate = useMemo(() => {
    const groups: Record<string, Entry[]> = {};
    for (const e of entries) {
      const d = new Date(e.when);
      const key = d.toISOString().slice(0,10);
      (groups[key] ||= []).push(e);
    }
    return groups;
  }, [entries]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Suivi & Calendrier</h1>

      {/* Étapes */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        {step === 1 && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Date & heure</label>
                <input
                  type="datetime-local"
                  className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3"
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Péché (intitulé)</label>
                <input
                  placeholder="ex: retard de prière, médisance…"
                  className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={onNext} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Suivant</button>
              <button onClick={onIDontKnow} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">
                Je ne sais pas (→ IA)
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div>
              <p className="text-sm text-gray-400 mb-2">Péché : <span className="text-gray-200 font-medium">{title || "—"}</span></p>
              <label className="block text-sm text-gray-400 mb-2">Raison (pourquoi ?)</label>
              <textarea
                className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3 min-h-[120px]"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Analyse, déclencheurs, contexte…"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">
                Retour
              </button>
              <button onClick={onSave} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Enregistrer</button>
              <button onClick={onIDontKnow} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">
                Je ne sais pas (→ IA)
              </button>
            </div>
          </>
        )}
      </section>

      {/* Historique par date */}
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Historique</h2>
        {Object.keys(byDate).length === 0 && (
          <p className="text-gray-400">Aucune entrée pour l’instant.</p>
        )}
        <div className="space-y-6">
          {Object.entries(byDate).sort(([a],[b]) => a < b ? 1 : -1).map(([d, list]) => (
            <div key={d}>
              <h3 className="text-purple-300 font-semibold mb-2">{new Date(d).toLocaleDateString()}</h3>
              <ul className="space-y-2">
                {list.map(e => (
                  <li key={e.id} className="border border-purple-700/30 rounded-xl p-3 bg-black/40 flex justify-between items-start">
                    <div>
                      <div className="text-sm text-gray-400">{new Date(e.when).toLocaleTimeString()}</div>
                      <div className="font-medium">{e.title}</div>
                      <div className="text-gray-300 text-sm mt-1">
                        {e.reason ? e.reason : <em className="text-amber-300">Raison manquante — clique “Je ne sais pas” pour demander à l’IA.</em>}
                      </div>
                    </div>
                    <button
                      className="text-xs px-3 py-1 rounded-lg border border-purple-700/40 hover:bg-purple-700/10"
                      onClick={() => {
                        const q = new URLSearchParams({
                          ctx: `Aide-moi à analyser "${e.title}" le ${new Date(e.when).toLocaleString()}.`,
                          ref: e.id
                        }).toString();
                        location.href = `/ai?${q}`;
                      }}
                    >
                      Demander à l’IA
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
