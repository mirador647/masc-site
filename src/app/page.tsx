"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <section className="hero flex flex-col items-center justify-center min-h-[80vh] text-center">
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Reste focus. Reste pur.
      </motion.h1>

      <motion.p
        className="mt-6 text-lg text-gray-300 max-w-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        MASC : ton compagnon IA musulman. Bloque distractions, rappelle les prières,
        et t’aide à rester sur le droit chemin.
      </motion.p>

      <motion.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/chat" className="btn">Essayer le Chat</Link>
        <Link href="/about" className="btn">En savoir plus</Link>
      </motion.div>
    </section>
  );
}
