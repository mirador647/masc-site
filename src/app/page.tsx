"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6 border-b border-neutral-800">
        <h1 className="text-2xl font-bold text-green-400">MASC</h1>
        <nav className="flex gap-6 text-neutral-300">
          <Link href="/" className="hover:text-white">Accueil</Link>
          <Link href="/chat" className="hover:text-white">Assistant</Link>
          <Link href="/about" className="hover:text-white">À propos</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
          Reste <span className="text-green-400">focus</span>.  
          <br /> Reste <span className="text-green-400">pur</span>.
        </h2>
        <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-8">
          MASC est ton assistant musulman numérique.  
          Répond uniquement avec le Coran 📖, la Sunna authentique 🕌 et les avis fiables des savants.  
          Toujours avec respect, bienveillance et clarté.
        </p>
        <div className="flex gap-4">
          <Link href="/chat" className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition">
            Essayer l’assistant
          </Link>
          <Link href="/about" className="px-6 py-3 rounded-xl border border-neutral-700 font-semibold hover:bg-neutral-800 transition">
            En savoir plus
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-neutral-900">
        <h3 className="text-2xl font-bold text-center mb-12">Pourquoi choisir MASC ?</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h4 className="text-lg font-semibold mb-2">📖 Références Authentiques</h4>
            <p className="text-neutral-400">Toutes les réponses basées sur le Coran, la Sunna et les avis de savants fiables.</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h4 className="text-lg font-semibold mb-2">🤖 IA au service du bien</h4>
            <p className="text-neutral-400">Une intelligence artificielle conçue pour aider, protéger et rappeler le bien.</p>
          </div>
          <div className="p-6 rounded-xl border border-neutral-800 bg-neutral-950">
            <h4 className="text-lg font-semibold mb-2">🔒 Respect & Sécurité</h4>
            <p className="text-neutral-400">Aucune collecte de données. Ton usage reste privé et confidentiel.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-neutral-500 py-6 border-t border-neutral-800 text-sm">
        © {new Date().getFullYear()} MASC — Muslim Assistant Smart Companion
      </footer>
    </main>
  );
}
