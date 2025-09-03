import Link from "next/link";

export default function CategoryCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link href={href} className="block rounded-2xl border border-purple-700/40 bg-black/40 hover:bg-purple-700/10 p-6">
      <div className="text-xl font-semibold">{title}</div>
      <div className="text-gray-300 mt-1">{desc}</div>
    </Link>
  );
}
