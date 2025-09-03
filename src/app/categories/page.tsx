import CategoryCard from "@/components/CategoryCard";

const cats = [
  { slug: "tracker", title: "Suivi & Calendrier", desc: "Choisis la date/heure, enregistre un péché, analyse les raisons." },
  { slug: "hadiths", title: "Hadiths (notes)", desc: "Écris / organise tes notes de hadiths." },
  { slug: "quran", title: "Coran FR & AR", desc: "Lecture bilingue (charge depuis des fichiers JSON en /public/quran)." }
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-5xl font-bold text-purple-400 text-center mb-12">Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cats.map((c) => (
          <CategoryCard key={c.slug} slug={c.slug} title={c.title} desc={c.desc} />
        ))}
      </div>
    </main>
  );
}
