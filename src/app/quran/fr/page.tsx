// src/app/quran/fr/page.tsx
export const revalidate = 0;
export const dynamic = "force-dynamic";

type Verse = { s: number; a: number; t: string }; // sourate, ayah, texte

async function getData() {
  // place ton JSON ici : /public/quran/fr.json (format libre, exemple ci-dessous)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/quran/fr.json`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Verse[];
  } catch {
    return null;
  }
}

export default async function QuranFR() {
  const data = await getData();

  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Coran — Français</h1>
      {!data && (
        <div className="text-gray-300">
          Place un fichier <code>/public/quran/fr.json</code>. Ex. :
          <pre className="mt-3 text-xs bg-white/5 p-3 rounded-lg border border-white/10 overflow-auto">
{`[
  { "s": 1, "a": 1, "t": "Au nom d’Allah, le Tout Miséricordieux, le Très Miséricordieux." },
  { "s": 1, "a": 2, "t": "Louange à Allah, Seigneur de l’univers." }
]`}
          </pre>
        </div>
      )}
      {data && (
        <div className="space-y-2">
          {data.map((v, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-gray-400">Sourate {v.s} — Verset {v.a}</div>
              <div>{v.t}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
