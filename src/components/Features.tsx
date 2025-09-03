// src/components/Features.tsx
const features = [
  {
    title: "IA dédiée (Avara)",
    desc:
      "Réponses rapides, suivi des conversations, envoi de fichiers—dans une page dédiée.",
  },
  {
    title: "Coran FR & AR",
    desc:
      "Navigation simple. Ajoute les textes ou JSON au format de ton choix sans casser le site.",
  },
  {
    title: "Suivi & Calendrier",
    desc:
      "Planifie, note tes objectifs, et visualise tes progrès facilement.",
  },
  {
    title: "Design épuré",
    desc:
      "Sections claires, surfaces en verre, contraste lisible, et animations discrètes.",
  },
];

export default function Features() {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 p-6"
        >
          <h3 className="text-xl font-semibold mb-1">{f.title}</h3>
          <p className="text-gray-300">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
