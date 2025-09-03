// src/app/page.tsx
import { Suspense } from "react";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-400">Chargement…</div>}>
      <Hero />
      <Features />
    </Suspense>
  );
}
