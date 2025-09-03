export const dynamic = "force-dynamic";
export const revalidate = 0;

import CategoryCard from "@/components/CategoryCard";

const cats = [
  { href: "/sins",     title: "Péchomètre",          desc: "Catégories, sévérité, repentance, filtres, streaks." },
  { href: "/tracker",  title: "Suivi & Calendrier",  desc: "Date/heure, raison, historique, IA si besoin." },
  { href: "/hadiths",  title: "Hadiths (notes)",     desc: "Notes & références, tri, suppression." },
  { href: "/quran",    title: "Coran FR & AR",       desc: "Lecture bilingue depuis /public/quran." },
  { href: "/planner",  title: "Planificateur",       desc: "Tâches par jour avec heure, done/undone." },
  { href: "/goals",    title: "Objectifs",           desc: "Objectifs SMART, progrès, échéances." },
  { href: "/stats",    title: "Statistiques",        desc: "Récap par catégories & par jour." },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-5xl font-bold text-purple-400 text-center mb-12">Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((c) => (
          <CategoryCard key={c.href} href={c.href} title={c.title} desc={c.desc} />
        ))}
      </div>
    </main>
  );
}
