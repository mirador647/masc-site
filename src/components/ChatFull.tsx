"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Trash2, Download, RotateCcw } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "ai:conversation";

export default function ChatFull() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const viewRef = useRef<HTMLDivElement>(null);
  const sp = useSearchParams();
  const ctxInjected = useRef(false);

  // 1) Charger l'historique + injecter un contexte (?ctx=...) si présent
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}

    const ctx = sp.get("ctx");
    if (ctx && !ctxInjected.current) {
      ctxInjected.current = true;
      setMessages((m) => [...m, { role: "user", content: ctx }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Sauvegarde auto et scroll en bas
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    viewRef.current?.scrollTo({
      top: viewRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // 3) Envoi au backend (ton /api/chat GROQ RESTE INCHANGÉ)
  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const txt = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: txt }]);
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt }),
      });
      const data = await res.json();
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply ?? "…" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Erreur de connexion à l’IA" },
      ]);
    } finally {
      setSending(false);
    }
  };

  // 4) Export .txt
  const exportText = () => {
    const plain = messages
      .map((m) => `${m.role === "user" ? "Tu" : "IA"}: ${m.content}`)
      .join("\n\n");
    const blob = new Blob([plain], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-[calc(100vh-64px-64px)] max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-purple-300">Chat IA</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([])}
            className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Nouvelle conversation"
          >
            <RotateCcw size={16} /> Nouveau
          </button>
          <button
            onClick={exportText}
            className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Exporter en .txt"
          >
            <Download size={16} /> Exporter
          </button>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setMessages([]);
            }}
            className="px-3 py-2 rounded-xl border border-rose-700/50 hover:bg-rose-700/10 inline-flex items-center gap-2"
            title="Effacer l'historique"
          >
            <Trash2 size={16} /> Effacer
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={viewRef}
        className="flex-1 overflow-y-auto rounded-2xl border border-purple-700/40 bg-gray-900/70 p-4 space-y-3"
      >
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Commence la discussion avec l’IA…
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <span
              className={`${
                m.role === "user" ? "bg-purple-600" : "bg-gray-700"
              } px-4 py-2 rounded-xl inline-block max-w-[85%] text-sm`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 bg-black text-white border border-purple-700/40 rounded-xl px-4 py-3 outline-none"
          placeholder="Écris ton message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : undefined)}
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
        >
          {sending ? "Envoi…" : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
