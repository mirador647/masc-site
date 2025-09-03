"use client";

import { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col p-6">
      <h1 className="text-3xl font-bold mb-6">Assistant MASC</h1>

      <div className="flex-1 overflow-y-auto border border-neutral-800 rounded-xl p-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-3 p-3 rounded-lg ${
              m.role === "user" ? "bg-neutral-800" : "bg-neutral-900"
            }`}
          >
            <strong>{m.role === "user" ? "Toi" : "MASC"} :</strong> {m.content}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <input
          className="flex-1 p-3 rounded-lg bg-neutral-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question…"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-white text-black rounded-lg font-semibold"
        >
          Envoyer
        </button>
      </div>
    </main>
  );
}
