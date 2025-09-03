export default function Features() {
  const features = [
    { t: "IA dédiée", d: "Page IA séparée, animation d’écriture, pièces jointes, export." },
    { t: "Suivi & Calendrier", d: "Enregistre, filtre, mini-calendrier, pont vers l’IA." },
    { t: "Péchomètre", d: "Catégories, sévérité, repentance, streaks, export JSON." },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-6">
      {features.map((f, i) => (
        <div key={i} className="bg-black/50 border border-purple-700/30 rounded-2xl p-6">
          <div className="text-xl font-bold text-purple-300">{f.t}</div>
          <div className="text-gray-300 mt-2">{f.d}</div>
        </div>
      ))}
    </section>
  );
}
