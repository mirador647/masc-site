export const metadata = { title: "Avara (IA)" };


export default function Page() {
const hasKey = Boolean(process.env.OPENAI_API_KEY);
return (
<main className="mx-auto max-w-2xl p-6">
<h1 className="text-3xl font-semibold mb-3">Avara (IA)</h1>
{!hasKey ? (
<div className="rounded-xl border p-4 bg-yellow-50">
<p className="font-medium">Configuration requise</p>
<p className="opacity-80">
Aucune clé d’API IA détectée. Ajoute la variable <code>OPENAI_API_KEY</code> (ou fournisseur équivalent)
dans Vercel et relance le déploiement. L’UI de chat sera activée automatiquement ensuite.
</p>
</div>
) : (
<div className="rounded-xl border p-4">
<p>Clé détectée. Le composant de chat sera branché à la prochaine phase.</p>
</div>
)}
</main>
);
}