"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

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
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`max-w-[75%] p-4 rounded-2xl ${
              m.role === "user"
                ? "ml-auto bg-green-600 text-black"
                : "mr-auto bg-neutral-800 text-white"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {m.content}
          </motion.div>
        ))}
        {loading && (
          <div className="mr-auto bg-neutral-800 text-white px-4 py-2 rounded-2xl animate-pulse">
            MASC écrit...
          </div>
        )}
        <div ref={chatEndRef}></div>
      </div>

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
          className="px-6 py-3 rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
