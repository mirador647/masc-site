"use client";
export const dynamic = "force-dynamic";
export const revalidate = 0;


import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const arr = JSON.parse(localStorage.getItem("journal:entries") || "[]");
      setCount(Array.isArray(arr) ? arr.length : 0);
    } catch {}
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-5xl font-extrabold text-purple-400 mb-6">Avara</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/ai" className="rounded-2xl bg-purple-600 hover:bg-purple-700 px-6 py-6 text-white">
          <div className="text-xl font-semibold">Parler à l’IA</div>
          <div className="text-sm opacity-90">Espace chat dédié</div>
        </Link>

        <Link href="/quran" className="rounded-2xl border border-purple-700/50 hover:bg-purple-700/10 px-6 py-6">
          <div className="text-xl font-semibold">Coran</div>
          <div className="text-sm text-gray-300">FR & AR</div>
        </Link>

        <Link href="/categories" className="rounded-2xl border border-purple-700/50 hover:bg-purple-700/10 px-6 py-6">
          <div className="text-xl font-semibold">Catégories</div>
          <div className="text-sm text-gray-300">Accès rapide</div>
        </Link>
      </div>

      <div className="mt-8 text-gray-300">Entrées de journal : {count}</div>
    </main>
  );
}
