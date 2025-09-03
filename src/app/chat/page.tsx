"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply || "⚠️ Pas de réponse." },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Erreur serveur." },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-[85vh] max-w-3xl mx-auto bg-black/40 backdrop-blur-md rounded-xl shadow-lg p-4">
      <h1 className="text-3xl font-bold text-center text-indigo-400 mb-4">
        💬 Assistant MASC
      </h1>

      {/* Zone messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-2">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-lg max-w-[75%] ${
              msg.role === "user"
                ? "bg-indigo-600 text-white ml-auto"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            {msg.content}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone input */}
      <div className="flex mt-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Écris ta question..."
          className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-r-lg text-white font-bold transition"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
