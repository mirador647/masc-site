"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* halo décoratif */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-purple-700/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[35rem] h-[35rem] rounded-full bg-fuchsia-700/20 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight"
        >
          <span className="text-white">Deviens </span>
          <span className="text-purple-400 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
            Invincible
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Un site rapide, net, moderne—avec un chat IA Groq qui te répond en direct.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            href="/ai"
            className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-lg shadow-purple-700/40"
          >
            Ouvrir la page IA
          </Link>
          <Link
            href="/categories"
            className="px-6 py-3 rounded-xl border border-purple-600/60 hover:bg-purple-600/10 transition"
          >
            Explorer les catégories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
