// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Sun, Moon, Settings } from "lucide-react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as "dark" | "light" | null;
    const next = stored ?? "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-purple-600/60 hover:bg-purple-600/10 transition"
      aria-label="Basculer le thème"
      title="Thème"
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-sm hidden md:inline">{theme === "dark" ? "Clair" : "Sombre"}</span>
    </button>
  );
}

export default function Navbar() {
  // Sans usePathname: on ne surligne pas "actif" (évite l'erreur de build).
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-purple-700/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-purple-400 tracking-wide">⚡ Invincible</Link>

        <div className="flex items-center gap-2">
          <Link href="/" className="px-3 py-2 rounded-xl text-sm border border-transparent hover:border-purple-700/50 hover:bg-purple-700/10">Accueil</Link>
          <Link href="/categories" className="px-3 py-2 rounded-xl text-sm border border-transparent hover:border-purple-700/50 hover:bg-purple-700/10">Catégories</Link>
          <Link href="/ai" className="px-3 py-2 rounded-xl text-sm border border-transparent hover:border-purple-700/50 hover:bg-purple-700/10">IA</Link>
          <Link href="/quran" className="px-3 py-2 rounded-xl text-sm border border-transparent hover:border-purple-700/50 hover:bg-purple-700/10">Coran</Link>
          <Link
            href="/settings"
            className="px-3 py-2 rounded-xl text-sm border border-transparent hover:border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Paramètres"
          >
            <Settings size={16} /> Paramètres
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
