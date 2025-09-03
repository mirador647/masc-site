"use client";
import Link from "next/link";

export default function CategoryCard({
  slug, title, desc
}: { slug: string; title: string; desc: string; }) {
  return (
    <div className="bg-gray-900/80 p-8 rounded-2xl border border-purple-700/40 shadow-lg hover:scale-105 transition">
      <h3 className="text-2xl font-bold text-purple-400">{title}</h3>
      <p className="text-gray-400 mt-2 mb-4">{desc}</p>
      <Link href={`/categories/${slug}`} className="text-purple-300 hover:underline">Explorer →</Link>
    </div>
  );
}
