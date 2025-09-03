// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Sun, Moon, Settings } from "lucide-react";

function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem("theme")) as
      | "dark"
      | "light"
      | null;
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
      <span className="text-sm hidden md:inline">
        {theme === "dark" ? "Clair" : "Sombre"}
      </span>
    </button>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-xl text-sm border transition ${
        active
          ? "border-purple-500 bg-purple-600/20"
          : "border-transparent hover:border-purple-700/50 hover:bg-purple-700/10"
      }`}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur border-b border-purple-700/30">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-extrabold text-purple-400 tracking-wide"
        >
          ⚡ Invincible
        </Link>

        <div className="flex items-center gap-2">
          <NavLink href="/" label="Accueil" active={pathname === "/"} />
          <NavLink
            href="/categories"
            label="Catégories"
            active={pathname === "/categories"}
          />
          <NavLink href="/ai" label="IA" active={pathname === "/ai"} />
          <NavLink href="/quran" label="Coran" active={pathname === "/quran"} />
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
