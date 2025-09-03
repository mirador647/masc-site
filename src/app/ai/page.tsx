import { Suspense } from "react";
import ChatFull from "@/components/ChatFull";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AIPage() {
  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white">
      <Suspense fallback={<div className="p-6 text-gray-400">Chargement…</div>}>
        <ChatFull />
      </Suspense>
    </main>
  );
}
