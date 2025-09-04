// src/app/quran/ar/page.tsx
export const revalidate = 0;
export const dynamic = "force-dynamic";

type Verse = { s: number; a: number; t: string };

async function getData() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/quran/ar.json`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as Verse[];
  } catch {
    return null;
  }
}

export default async function QuranAR() {
  const data = await getData();

  return (
    <section className="max-w-5xl mx-auto px-6 py-10" dir="rtl">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">القرآن الكريم — عربي</h1>
      {!data && (
        <div className="text-gray-300">
          ضع ملف <code>/public/quran/ar.json</code>. مثال:
          <pre className="mt-3 text-xs bg-white/5 p-3 rounded-lg border border-white/10 overflow-auto" dir="ltr">
{`[
  { "s": 1, "a": 1, "t": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" },
  { "s": 1, "a": 2, "t": "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" }
]`}
          </pre>
        </div>
      )}
      {data && (
        <div className="space-y-2">
          {data.map((v, i) => (
            <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-gray-400" dir="ltr">Sourate {v.s} — Verset {v.a}</div>
              <div className="leading-relaxed">{v.t}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
