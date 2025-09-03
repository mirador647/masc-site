"use client";
import { motion } from "framer-motion";
import { Zap, Shield, Rocket } from "lucide-react";

const features = [
  { icon: Zap, title: "Vitesse", desc: "Ton site charge en éclair." },
  { icon: Shield, title: "Puissance", desc: "Protégé comme un guerrier." },
  { icon: Rocket, title: "Croissance", desc: "Ton business décolle." }
];

export default function Features() {
  return (
    <section className="py-20 text-center">
      <h2 className="text-4xl font-bold text-purple-400 mb-10">Pourquoi choisir l’invincibilité ?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 px-10">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.3 }}
            className="bg-gray-900 p-6 rounded-2xl shadow-lg"
          >
            <f.icon className="mx-auto text-purple-500" size={48} />
            <h3 className="text-xl font-semibold mt-4">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
