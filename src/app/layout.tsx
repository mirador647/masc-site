import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "MASC — Muslim Assistant Smart Companion",
  description: "Ton assistant musulman numérique. IA halal avec Coran, Sunna et avis des savants.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-neutral-950 text-white font-sans">
        {/* Navbar */}
        <header className="fixed top-0 w-full z-50 bg-neutral-950/70 backdrop-blur border-b border-neutral-800">
          <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-extrabold text-green-400 tracking-wide">MASC</h1>
            <nav className="flex gap-6 text-neutral-300">
              <Link href="/" className="hover:text-white transition">Accueil</Link>
              <Link href="/chat" className="hover:text-white transition">Assistant</Link>
              <Link href="/about" className="hover:text-white transition">À propos</Link>
            </nav>
          </div>
        </header>
        <main className="pt-20">{children}</main>
        <footer className="text-center text-neutral-500 py-6 border-t border-neutral-800 text-sm">
          © {new Date().getFullYear()} MASC — Muslim Assistant Smart Companion
        </footer>
      </body>
    </html>
  );
}
