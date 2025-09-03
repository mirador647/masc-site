"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { useEffect, useState } from "react";

type Verse = { number: number; text: string };

async function load(lang: "ar" | "fr", sura: number): Promise<Verse[]> {
  const res = await fetch(`/quran/${lang}/${sura}.json`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default function QuranPage() {
  const [lang, setLang] = useState<"ar" | "fr">("fr");
  const [sura, setSura] = useState(1);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    load(lang, sura).then(setVerses).finally(() => setLoading(false));
  }, [lang, sura]);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">Coran</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        <select value={lang} onChange={(e)=>setLang(e.target.value as "ar"|"fr")} className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2">
          <option value="fr">Français</option>
          <option value="ar">Arabe</option>
        </select>
        <input type="number" min={1} max={114} value={sura} onChange={(e)=>setSura(Number(e.target.value))}
          className="w-28 bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2" />
      </div>

      {loading ? <p className="text-gray-400">Chargement…</p> : (
        <div className="space-y-3">
          {verses.length === 0 && <p className="text-gray-400">Ajoute les fichiers JSON dans <code>/public/quran/{`{ar|fr}`}/{`{1..114}`}.json</code>.</p>}
          {verses.map(v => (
            <div key={v.number} className="border border-purple-700/30 rounded-xl p-3 bg-black/40">
              <span className="text-purple-300 mr-2">{v.number}.</span>{v.text}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
