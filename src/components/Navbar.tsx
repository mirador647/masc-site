"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as "dark" | "light" | null) ?? "dark";
    setTheme(stored);
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);
  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next); localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };
  return (
    <button onClick={toggle} className="px-3 py-2 rounded-xl border border-purple-600/60 hover:bg-purple-600/10">
      {theme === "dark" ? "Clair" : "Sombre"}
  </button>
  );
}

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-purple-700/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-extrabold text-purple-400 tracking-wide">⚡ Avara</Link>
        <div className="flex items-center gap-2">
          <Link href="/ai" className="px-3 py-2 rounded-xl hover:bg-purple-700/10">IA</Link>
          <Link href="/quran" className="px-3 py-2 rounded-xl hover:bg-purple-700/10">Coran</Link>
          <Link href="/categories" className="px-3 py-2 rounded-xl hover:bg-purple-700/10">Catégories</Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
