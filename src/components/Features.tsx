"use client";
import { motion } from "framer-motion";
import { Zap, Shield, Rocket } from "lucide-react";

const items = [
  { icon: Zap, title: "Vitesse", desc: "Build et UX ultra-rapides." },
  { icon: Shield, title: "Puissance", desc: "Stack solide, fiable." },
  { icon: Rocket, title: "Croissance", desc: "Prêt pour scaler." }
];

export default function Features() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-bold text-purple-400 mb-12">Pourquoi nous ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {items.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className="bg-gray-900/80 p-8 rounded-2xl border border-purple-700/40 shadow-lg"
          >
            <f.icon className="mx-auto text-purple-500" size={48} />
            <h3 className="text-xl font-semibold mt-4">{f.title}</h3>
            <p className="text-gray-400 mt-1">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
