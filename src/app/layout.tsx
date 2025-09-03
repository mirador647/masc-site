import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "MASC – Muslim AI Support",
  description: "Ton compagnon IA pour rester focus et éviter les péchés",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <header className="w-full py-4 bg-black/40 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6">
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              MASC
            </h1>
            <nav className="flex gap-6 text-gray-300">
              <a href="/" className="hover:text-white">Accueil</a>
              <a href="/chat" className="hover:text-white">Chat IA</a>
              <a href="/about" className="hover:text-white">À propos</a>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-12">{children}</main>
        <footer className="text-center text-sm text-gray-500 py-6 border-t border-gray-800">
          © {new Date().getFullYear()} MASC – Muslim AI Support
        </footer>
      </body>
    </html>
  );
}
