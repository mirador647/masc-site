export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-2xl text-center px-6">
        <h1 className="text-5xl font-bold">MASC — Ton assistant musulman</h1>
        <p className="mt-4 text-neutral-400 text-lg">
          Une IA halal pour t’accompagner : rappels de salat, hadiths authentiques, dhikr, et conseils pour rester loin des péchés.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <a href="/chat" className="px-6 py-3 bg-white text-black rounded-lg font-semibold">
            Lancer l’IA
          </a>
          <a href="#features" className="px-6 py-3 bg-neutral-800 text-white rounded-lg font-semibold">
            Découvrir
          </a>
        </div>
      </div>
    </main>
  );
}
