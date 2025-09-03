"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CategoryCard({ slug, title, desc }: { slug: string; title: string; desc: string; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-purple-700/40 hover:scale-105 hover:shadow-purple-600/40 transition"
    >
      <h2 className="text-2xl font-bold text-purple-400">{title}</h2>
      <p className="text-gray-400 mt-3 mb-5">{desc}</p>
      <Link href={`/categories/${slug}`} className="text-purple-300 hover:underline">
        Explorer →
      </Link>
    </motion.div>
  );
}
