export const dynamic = "force-dynamic";
export const revalidate = 0;


import { Suspense } from "react";
import ChatFull from "@/components/ChatFull";

export default function AIPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-300 mb-4">Espace IA</h1>
      <Suspense fallback={<div className="text-gray-400">Chargement…</div>}>
        <ChatFull />
      </Suspense>
    </main>
  );
}
