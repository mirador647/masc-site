import ChatUI from "./ChatUI";

export const metadata = {
  title: "Avara (IA)",
  description: "Discute avec Avara.",
};

export default function Page() {
  const hasKey = Boolean(process.env.GROQ_API_KEY);
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-3xl font-semibold mb-4">Avara (IA)</h1>

      {!hasKey ? (
        <div className="rounded-xl border p-4 bg-yellow-50 text-yellow-900">
          <p className="font-medium mb-1">Configuration requise</p>
          <p className="opacity-80">
            Aucune clé détectée. Ajoute la variable <code>GROQ_API_KEY</code> à Vercel (Production, Preview, Development)
            ou crée un fichier <code>.env.local</code> en local. Puis redéploie.
          </p>
        </div>
      ) : (
        <ChatUI />
      )}
    </main>
  );
}