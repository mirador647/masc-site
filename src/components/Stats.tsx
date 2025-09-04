// src/components/Stats.tsx
const items = [
  { k: "+1", v: "Assistant IA (Avara)" },
  { k: "2", v: "Versions Coran (FR & AR)" },
  { k: "∞", v: "Notes & Objectifs" },
  { k: "Quotidien", v: "Suivi / Journal" }
];

export default function Stats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it.v} className="rounded-2xl border border-white/10 bg-white/5 p-5 text-center">
          <div className="text-3xl md:text-4xl font-extrabold text-purple-300">{it.k}</div>
          <div className="text-sm text-gray-300 mt-1">{it.v}</div>
        </div>
      ))}
    </div>
  );
}
