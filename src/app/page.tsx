"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-black via-neutral-950 to-neutral-900 text-white overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-green-500/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-[120px] animate-pulse"></div>

      <motion.h1
        className="text-5xl md:text-7xl font-extrabold text-center leading-tight"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Reste <span className="text-green-400">focus</span>. <br />
        Reste <span className="text-green-400">pur</span>.
      </motion.h1>

      <motion.p
        className="mt-6 text-lg md:text-xl text-neutral-300 max-w-2xl text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        MASC est ton assistant musulman numérique.  
        Une IA halal, nourrie par le Coran 📖, la Sunna 🕌 et les avis fiables des savants.  
        Pour t’aider à rester droit, productif et connecté à Allah.
      </motion.p>

      <motion.div
        className="mt-8 flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link href="/chat" className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition">
          Essayer MASC
        </Link>
        <Link href="/about" className="px-6 py-3 rounded-xl border border-neutral-700 font-semibold hover:bg-neutral-800 transition">
          En savoir plus
        </Link>
      </motion.div>

      {/* Features section */}
      <section className="mt-24 grid md:grid-cols-3 gap-8 max-w-6xl px-6">
        {[
          { title: "📖 Références Authentiques", desc: "Coran, Sunna et avis de savants fiables uniquement." },
          { title: "🤖 IA au service du bien", desc: "Une IA qui protège ton temps et ton cœur." },
          { title: "🔒 Respect & Sécurité", desc: "Aucune collecte de données. Usage 100% privé." }
        ].map((f, i) => (
          <motion.div
            key={i}
            className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition"
            whileHover={{ scale: 1.05 }}
          >
            <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
            <p className="text-neutral-400">{f.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
