"use client";
import { useEffect, useState } from "react";

type Aya = { n: number; text: string };
type Surah = { surah: number; ayahs: Aya[] };

const NAMES = [
  "", "Al-Fatiha","Al-Baqarah","Al 'Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah",
  "Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha","Al-Anbiya",
  "Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-'Ankabut","Ar-Rum","Luqman",
  "As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir","Fussilat","Ash-Shura",
  "Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf","Adh-Dhariyat",
  "At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
  "As-Saff","Al-Jumu'ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah",
  "Al-Ma'arij","Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba",
  "An-Nazi'at","'Abasa","At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la",
  "Al-Ghashiyah","Al-Fajr","Al-Balad","Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-'Alaq","Al-Qadr",
  "Al-Bayyinah","Az-Zalzalah","Al-'Adiyat","Al-Qari'ah","At-Takathur","Al-'Asr","Al-Humazah","Al-Fil","Quraysh",
  "Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr","Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

export default function QuranPage() {
  const [surah, setSurah] = useState(1);
  const [ar, setAr] = useState<Surah | null>(null);
  const [fr, setFr] = useState<Surah | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async (n: number) => {
    setError(null); setAr(null); setFr(null); setSurah(n);
    try {
      const [arRes, frRes] = await Promise.all([
        fetch(`/quran/ar/${n}.json`),
        fetch(`/quran/fr/${n}.json`)
      ]);
      if (!arRes.ok || !frRes.ok) {
        setError("Fichiers manquants. Placez les JSON dans /public/quran/ar et /public/quran/fr (1..114).");
        return;
      }
      setAr(await arRes.json());
      setFr(await frRes.json());
    } catch (e) {
      setError("Erreur de chargement des fichiers.");
    }
  };

  useEffect(() => { load(1); }, []);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-purple-400">Coran — Français & Arabe</h1>

      <div className="flex gap-3 items-center">
        <label className="text-sm text-gray-300">Sourate</label>
        <select
          className="bg-black/50 border border-purple-700/40 rounded-xl px-3 py-2"
          value={surah}
          onChange={(e) => load(Number(e.target.value))}
        >
          {Array.from({ length: 114 }, (_, i) => i + 1).map((n) => (
            <option key={n} value={n}>{n}. {NAMES[n] || `Sourate ${n}`}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="border border-amber-600/60 bg-amber-600/10 p-4 rounded-xl text-amber-200">
          {error}
          <div className="text-xs opacity-80 mt-2">
            Format attendu: {"{ \"surah\": n, \"ayahs\": [{\"n\":1,\"text\":\"...\"}, ...] }"}.<br/>
            Placez les fichiers ici: <code>/public/quran/ar/&lt;n&gt;.json</code> et <code>/public/quran/fr/&lt;n&gt;.json</code>.
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border border-purple-700/40 rounded-2xl p-4 bg-black/40">
          <h2 className="font-semibold mb-3">Arabe</h2>
          <div className="space-y-2 leading-7">
            {ar?.ayahs?.map(a => (
              <div key={a.n} className="text-right font-[ui-serif] text-lg">
                <span className="text-purple-300 mr-2">{a.n}</span>
                <span>{a.text}</span>
              </div>
            )) || <div className="text-gray-400">Chargement…</div>}
          </div>
        </div>

        <div className="border border-purple-700/40 rounded-2xl p-4 bg-black/40">
          <h2 className="font-semibold mb-3">Français</h2>
          <div className="space-y-2 leading-7">
            {fr?.ayahs?.map(a => (
              <div key={a.n} className="text-left">
                <span className="text-purple-300 mr-2">{a.n}</span>
                <span>{a.text}</span>
              </div>
            )) || <div className="text-gray-400">Chargement…</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
