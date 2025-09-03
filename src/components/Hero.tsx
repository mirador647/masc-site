"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full bg-purple-700/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 w-[35rem] h-[35rem] rounded-full bg-fuchsia-700/15 blur-3xl" />

      <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Plateforme personnelle — <span className="text-purple-400">organisée et claire</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-5 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
        >
          Un espace propre pour planifier, noter et réfléchir — avec une page IA dédiée quand tu en as besoin.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <Link
            href="/ai"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition shadow-lg shadow-purple-700/30"
          >
            Page IA
          </Link>
          <Link
            href="/categories"
            className="px-5 py-3 rounded-xl border border-purple-600/60 hover:bg-purple-600/10 transition"
          >
            Catégories
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
