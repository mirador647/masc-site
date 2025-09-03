// src/components/Hero.tsx
"use client";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="h-[80vh] flex flex-col justify-center items-center text-center px-6 relative">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-6xl md:text-7xl font-extrabold text-purple-400 drop-shadow-[0_0_25px_rgba(168,85,247,0.7)]"
      >
        🚀 Deviens Invincible
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-5 text-lg text-gray-300 max-w-2xl"
      >
        IA intégrée, vitesse maximale, design futuriste.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex gap-4"
      >
        <a className="px-6 py-3 bg-purple-600 rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-700/40 cursor-pointer">
          Commencer
        </a>
        <a className="px-6 py-3 border border-purple-500 rounded-xl hover:bg-purple-600 transition cursor-pointer">
          Découvrir
        </a>
      </motion.div>
    </section>
  );
}
