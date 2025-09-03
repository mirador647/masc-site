import CategoryCard from "@/components/CategoryCard";

const cats = [
  { slug: "business", title: "Business & Finance", desc: "Construis ton empire 💼" },
  { slug: "technologie", title: "Technologie & IA", desc: "Domine avec l’IA 🤖" },
  { slug: "discipline", title: "Discipline & Mindset", desc: "Mental de guerrier 💪" }
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-5xl font-bold text-purple-400 text-center mb-12">Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cats.map((c) => (
          <CategoryCard key={c.slug} slug={c.slug} title={c.title} desc={c.desc} />
        ))}
      </div>
    </main>
  );
}
