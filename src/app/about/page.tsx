export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-4xl font-extrabold text-green-400 mb-6">À propos de MASC</h1>
      <p className="max-w-3xl text-neutral-300 text-lg leading-relaxed text-center">
        MASC (Muslim Assistant Smart Companion) est une initiative pour aider les musulmans à rester
        sur la voie droite à l’ère numérique.  
        <br /><br />
        Notre objectif : proposer une intelligence artificielle qui ne dévie pas, qui s’appuie
        uniquement sur le Coran, la Sunna authentique et les avis des savants fiables.  
        <br /><br />
        Respect, sécurité, et spiritualité sont nos piliers.  
      </p>
    </div>
  );
}
