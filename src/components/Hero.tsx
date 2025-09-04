// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-16 md:pt-24">
        <span className="inline-flex items-center gap-2 text-xs md:text-sm text-purple-300/80 bg-purple-900/30 border border-purple-500/20 rounded-full px-3 py-1">
          <span className="inline-block w-2 h-2 rounded-full bg-purple-400" />
          Avara — Assistant IA + Outils quotidiens
        </span>

        <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-tight">
          Un espace simple, beau et utile<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300">
            pour avancer chaque jour
          </span>
        </h1>

        <p className="mt-4 text-gray-300 max-w-2xl">
          Discute avec Avara, explore le Coran (FR & AR), note tes objectifs, fais ton suivi,
          et garde tes idées au même endroit.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href="/ai" className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 transition font-medium">
            Parler à Avara
          </a>
          <a href="/quran" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium">
            Coran FR & AR
          </a>
          <a href="/categories" className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium">
            Accès rapide
          </a>
        </div>
      </div>
    </section>
  );
}
