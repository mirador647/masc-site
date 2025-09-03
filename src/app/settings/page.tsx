"use client";
import { useEffect, useState } from "react";

type Prefs = {
  uiDensity: "compact" | "comfortable";
  chatFontSize: "sm" | "md" | "lg";
  language: "fr" | "en";
  animations: boolean;
};

const DEFAULT_PREFS: Prefs = {
  uiDensity: "comfortable",
  chatFontSize: "md",
  language: "fr",
  animations: true
};

export default function SettingsPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const save = (next: Prefs) => {
    setPrefs(next);
    localStorage.setItem("prefs", JSON.stringify(next));
  };

  useEffect(() => {
    const raw = localStorage.getItem("prefs");
    if (raw) {
      try { setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(raw) }); } catch {}
    }
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Paramètres</h1>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Densité de l’interface</label>
            <select
              className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3"
              value={prefs.uiDensity}
              onChange={(e) => save({ ...prefs, uiDensity: e.target.value as Prefs["uiDensity"] })}
            >
              <option value="compact">Compacte</option>
              <option value="comfortable">Confort</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Taille du texte du chat</label>
            <select
              className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3"
              value={prefs.chatFontSize}
              onChange={(e) => save({ ...prefs, chatFontSize: e.target.value as Prefs["chatFontSize"] })}
            >
              <option value="sm">Petite</option>
              <option value="md">Moyenne</option>
              <option value="lg">Grande</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Langue de l’UI</label>
            <select
              className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3"
              value={prefs.language}
              onChange={(e) => save({ ...prefs, language: e.target.value as Prefs["language"] })}
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="animations"
              type="checkbox"
              checked={prefs.animations}
              onChange={(e) => save({ ...prefs, animations: e.target.checked })}
              className="size-4"
            />
            <label htmlFor="animations" className="text-sm text-gray-300">Animations</label>
          </div>
        </div>

        <button
          onClick={() => { localStorage.removeItem("prefs"); setPrefs(DEFAULT_PREFS); }}
          className="px-4 py-2 border border-purple-700/50 rounded-xl hover:bg-purple-700/10"
        >
          Réinitialiser
        </button>
      </section>

      <p className="text-gray-400 text-sm mt-4">
        Ces paramètres affectent uniquement l’interface (densité, tailles, animations). L’IA **n’est pas modifiée**.
      </p>
    </main>
  );
}
