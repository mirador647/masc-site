"use client";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatUI() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Salam ! Pose ta question, je t’écoute. ✨" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply: string = data?.content ?? "Erreur ou réponse vide.";

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Une erreur s’est produite. Réessaie plus tard." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-4 rounded-2xl border p-3 bg-white/80 dark:bg-zinc-900/80">
        <div className="space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "user"
                  ? "ml-auto max-w-[85%] rounded-xl px-3 py-2 bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100"
                  : "mr-auto max-w-[85%] rounded-xl px-3 py-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
              }
            >
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="mr-auto max-w-[85%] rounded-xl px-3 py-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50">
              …en train d’écrire
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded-xl border px-4 py-2 bg-white text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100"
          placeholder="Écris ton message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="rounded-xl border px-4 py-2 hover:bg-black/5 disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}