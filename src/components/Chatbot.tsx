"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2, MinusSquare, PlusSquare, Minimize2 } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

export default function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const [fontSize, setFontSize] = useState<"sm"|"md"|"lg">("md");
  const [density, setDensity] = useState<"compact"|"comfortable">("comfortable");
  const viewRef = useRef<HTMLDivElement>(null);

  // Charger préférences UI
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("prefs") || "{}");
      if (p.chatFontSize) setFontSize(p.chatFontSize);
      if (p.uiDensity) setDensity(p.uiDensity);
    } catch {}
  }, []);

  // Scroll bottom on new message
  useEffect(() => {
    viewRef.current?.scrollTo({ top: viewRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const txt = input;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: txt }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt })
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", content: data.reply ?? "…" }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "⚠️ Erreur de connexion à l’IA" }]);
    }
  };

  const sizeClass = useMemo(() => {
    switch (fontSize) {
      case "sm": return "text-xs";
      case "lg": return "text-base";
      default: return "text-sm";
    }
  }, [fontSize]);

  const padClass = density === "compact" ? "py-1 px-2" : "py-2 px-3";

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg"
        aria-label="Ouvrir le chat"
      >
        Ouvrir le chat
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[22rem] bg-gray-900 rounded-2xl shadow-2xl border border-purple-600 overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-3 font-bold flex items-center justify-between">
        <span>⚡ Chat IA <span className="text-xs opacity-70">Groq</span></span>
        <div className="flex items-center gap-2">
          <button
            title="Texte -"
            onClick={() => setFontSize((s) => (s === "lg" ? "md" : s === "md" ? "sm" : "sm"))}
            className="p-1 rounded hover:bg-white/10"
          >
            <MinusSquare size={16}/>
          </button>
          <button
            title="Texte +"
            onClick={() => setFontSize((s) => (s === "sm" ? "md" : s === "md" ? "lg" : "lg"))}
            className="p-1 rounded hover:bg-white/10"
          >
            <PlusSquare size={16}/>
          </button>
          <button
            title="Vider"
            onClick={() => setMessages([])}
            className="p-1 rounded hover:bg-white/10"
          >
            <Trash2 size={16}/>
          </button>
          <button
            title="Réduire"
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-white/10"
          >
            <Minimize2 size={16}/>
          </button>
        </div>
      </div>

      <div ref={viewRef} className="h-72 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === "user" ? "text-right" : "text-left"} ${sizeClass}`}>
            <span
              className={`${m.role === "user" ? "bg-purple-600" : "bg-gray-700"} ${padClass} rounded-xl inline-block max-w-[90%]`}
            >
              {m.content}
            </span>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-xs">Commence la discussion…</p>
        )}
      </div>

      <div className="flex border-t border-gray-700">
        <input
          className={`flex-1 bg-black text-white outline-none ${padClass}`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question…"
          onKeyDown={(e) => (e.key === "Enter" ? sendMessage() : null)}
        />
        <button onClick={sendMessage} className="px-4 bg-purple-600 hover:bg-purple-700">Envoyer</button>
      </div>
    </div>
  );
}
