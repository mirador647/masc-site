// src/app/quran/page.tsx
export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function QuranPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
        Coran — Français & Arabe
      </h1>
      <p className="text-gray-300 max-w-2xl">
        Choisis la version. Tu peux plus tard brancher un JSON, un fichier texte
        ou une API — la structure du site restera stable.
      </p>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <a
          href="/quran/fr"
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 hover:bg-white/10 transition"
        >
          <h2 className="text-xl font-semibold mb-1">Coran — Français</h2>
          <p className="text-gray-300 text-sm">
            Traduction française (texte clair). Navigation par sourates.
          </p>
        </a>

        <a
          href="/quran/ar"
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6 hover:bg-white/10 transition"
        >
          <h2 className="text-xl font-semibold mb-1">القرآن — عربي</h2>
          <p className="text-gray-300 text-sm">
            Texte arabe. Support du sens de lecture RTL possible.
          </p>
        </a>
      </div>

      <div className="mt-10 text-sm text-gray-400">
        <p>
          Astuce : place tes ressources dans <code>/public/quran/fr/</code> et{" "}
          <code>/public/quran/ar/</code> (JSON ou textes), puis fais des pages{" "}
          <code>src/app/quran/fr/page.tsx</code> et <code>src/app/quran/ar/page.tsx</code>
          qui lisent ces fichiers via <code>fetch("/quran/...")</code>.
        </p>
      </div>
    </section>
  );
}
