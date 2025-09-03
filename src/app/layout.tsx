import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "MASC - Assistant Musulman",
  description: "Ton compagnon numérique basé sur le Coran et la Sunna",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        {/* HEADER */}
        <header className="bg-black/30 backdrop-blur-md text-white p-4 text-center text-2xl font-bold shadow-lg">
          🌙 Assistant MASC
        </header>

        {/* CONTENT */}
        <main className="flex-1 container mx-auto px-4 py-6">
          {children}
        </main>

        {/* FOOTER */}
        <footer className="bg-black/30 backdrop-blur-md text-gray-300 p-4 text-center text-sm">
          © {new Date().getFullYear()} MASC - Inspiré par le Coran & la Sunna
        </footer>
      </body>
    </html>
  );
}
