"use client";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black/60 backdrop-blur text-white border-b border-purple-700/40 sticky top-0 z-50">
      <h1 className="text-2xl font-bold text-purple-400">⚡ Invincible</h1>
      <div className="flex gap-6">
        <Link href="/">Accueil</Link>
        <Link href="/categories">Catégories</Link>
        <Link href="/settings">Paramètres</Link>
      </div>
    </nav>
  );
}
