// src/app/page.tsx
export const revalidate = 0;
export const dynamic = "force-dynamic";

import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Features from "@/components/Features";
import AutoMarquee from "@/components/AutoMarquee";
import Gallery from "@/components/Gallery";

export default function Page() {
  return (
    <div className="flex flex-col gap-20">
      <Hero />

      <section className="max-w-6xl mx-auto px-6">
        <Stats />
      </section>

      <section className="max-w-6xl mx-auto px-6">
        <Features />
      </section>

      {/* Carrousel horizontal auto-défilant (pause au survol) */}
      <section className="max-w-7xl mx-auto px-0">
        <h2 className="px-6 text-2xl md:text-3xl font-bold mb-4">
          Catégories populaires
        </h2>
        <AutoMarquee
          items={[
            { label: "Coran", href: "/quran" },
            { label: "IA (Avara)", href: "/ai" },
            { label: "Suivi & Calendrier", href: "/planner" },
            { label: "Objectifs", href: "/goals" },
            { label: "Péchés / Journal", href: "/sins" },
            { label: "Hadiths & Notes", href: "/hadiths" },
            { label: "Trackers", href: "/trackers" },
            { label: "Catégories", href: "/categories" },
          ]}
        />
      </section>

      {/* Section galerie pour insérer tes images / présentation */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Présentation & images</h2>
        <p className="text-gray-300 mb-6 max-w-3xl">
          Ajoute ici une présentation de ton projet. Tu peux remplacer les vignettes
          par tes images dans <code>/public/images/gallery/</code>. Clique sur une
          vignette pour l’agrandir (ou remplace le lien par ce que tu veux).
        </p>
        <Gallery />
      </section>

      {/* CTA final */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-2xl border border-white/10 p-8 md:p-12 bg-gradient-to-br from-purple-900/30 to-indigo-900/30">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">Prêt à démarrer ?</h3>
          <p className="text-gray-300 mb-6">
            Lance l’IA Avara, explore le Coran en FR/AR, planifie, note tes objectifs,
            et avance pas à pas.
          </p>
          <div className="flex gap-3">
            <a
              href="/ai"
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-medium"
            >
              Ouvrir Avara
            </a>
            <a
              href="/categories"
              className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium"
            >
              Explorer les catégories
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
