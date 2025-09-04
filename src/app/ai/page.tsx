// src/app/ai/page.tsx
"use client";

export const revalidate = 0;
export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; content: string };

export default function AIPage() {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Turn[]>([]);
  const [typing, setTyping] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, typing]);

  const send = async () => {
    const msg = input.trim();
    if (!msg) return;

    setHistory((h) => [...h, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);

    // Si tu veux envoyer l'image à l'API, convertis en base64 ici et ajoute dans message
    let finalMessage = msg;
    if (image) {
      finalMessage += "\n\n[Image jointe: " + image.name + "]";
    }

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: finalMessage, history })
      });
      const data = await res.json();

      // "animation d’écriture" (client side)
      const reply = (data?.reply ?? "").toString();
      let acc = "";
      for (let i = 0; i < reply.length; i++) {
        acc += reply[i];
        await new Promise((r) => setTimeout(r, 8)); // vitesse d'écriture
        setHistory((h) => {
          const base = [...h];
          const last = base[base.length - 1];
          // si dernier est déjà assistant en train d’écrire, on remplace
          if (last && last.role === "assistant") {
            base[base.length - 1] = { role: "assistant", content: acc };
            return base;
          }
          // sinon on ajoute
          return [...base, { role: "assistant", content: acc }];
        });
      }
    } catch (e) {
      setHistory((h) => [...h, { role: "assistant", content: "Erreur API." }]);
    } finally {
      setTyping(false);
      setImage(null);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold mb-4">Avara — Chat IA</h1>

      <div className="rounded-2xl border border-white/10 bg-white/5">
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {history.map((t, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border border-white/10 ${
                t.role === "user" ? "bg-purple-900/30 ml-auto w-fit" : "bg-white/5"
              }`}
            >
              <div className="text-xs text-gray-400 mb-1">{t.role === "user" ? "Toi" : "Avara"}</div>
              <div className="whitespace-pre-wrap">{t.content}</div>
            </div>
          ))}
          {typing && (
            <div className="p-3 rounded-xl border border-white/10 bg-white/5 w-28 animate-pulse">
              <span className="opacity-80">…</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="p-4 border-t border-white/10 flex flex-col gap-3">
          {image && (
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <img
                src={URL.createObjectURL(image)}
                alt="preview"
                className="w-12 h-12 object-cover rounded-md border border-white/10"
              />
              <div className="truncate">{image.name}</div>
              <button
                onClick={() => setImage(null)}
                className="ml-auto text-xs px-2 py-1 rounded-md bg-white/10 hover:bg-white/20"
              >
                Retirer
              </button>
            </div>
          )}

          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-black/40 outline-none"
              placeholder="Pose ta question…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <label className="px-3 py-3 rounded-xl border border-white/10 bg-white/10 hover:bg-white/20 cursor-pointer">
              Import
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </label>
            <button
              onClick={send}
              className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 font-medium"
            >
              Envoyer
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
