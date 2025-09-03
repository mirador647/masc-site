"use client";

import { useState, useRef, useEffect } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll automatique vers le bas
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply.content },
    ]);
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-neutral-800">
        <h1 className="text-xl font-bold text-green-400">MASC — Assistant IA</h1>
      </header>

      {/* Zone de chat */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] p-3 rounded-2xl ${
              m.role === "user"
                ? "ml-auto bg-green-600 text-black"
                : "mr-auto bg-neutral-800 text-white"
            }`}
          >
            {m.content}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Champ de saisie */}
      <div className="p-4 border-t border-neutral-800 flex gap-2">
        <input
          className="flex-1 p-3 rounded-xl bg-neutral-800 text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="px-5 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
        >
          Envoyer
        </button>
      </div>
    </main>
  );
}
