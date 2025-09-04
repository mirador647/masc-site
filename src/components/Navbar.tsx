// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/ai", label: "Avara (IA)" },
  { href: "/quran", label: "Coran" },
  { href: "/categories", label: "Catégories" }
];

export default function Navbar() {
  const path = usePathname();

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/40 border-b border-white/10">
      <nav className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-extrabold text-lg">
          Avara
        </Link>
        <div className="flex items-center gap-2">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 rounded-md text-sm transition ${
                  active ? "bg-white/15" : "hover:bg-white/10"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
