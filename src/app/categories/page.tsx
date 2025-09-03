import CategoryCard from "../../components/CategoryCard";

const categories = [
  { slug: "dev-personnel", title: "Développement Personnel", desc: "Deviens la meilleure version de toi-même." },
  { slug: "discipline", title: "Discipline & Mindset", desc: "Forge un mental d’acier." },
  { slug: "business", title: "Business & Finance", desc: "Construis ton empire." },
  { slug: "technologie", title: "Technologie & IA", desc: "Domine le futur avec l’IA." },
  { slug: "sante", title: "Santé & Force", desc: "Un corps puissant pour une vie puissante." }
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white p-10">
      <h1 className="text-5xl font-bold text-purple-400 text-center mb-12">Catégories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((cat, i) => (
          <CategoryCard key={i} slug={cat.slug} title={cat.title} desc={cat.desc} />
        ))}
      </div>
    </main>
  );
}
