"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
  }

  return (
    <div className="max-w-3xl mx-auto card">
      <h2 className="text-2xl font-bold mb-4">💬 Chat avec MASC</h2>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              m.role === "user"
                ? "ml-auto bg-indigo-600 text-white"
                : "mr-auto bg-gray-800 text-gray-200"
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {m.content}
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Écris ton message..."
        />
        <button onClick={sendMessage} className="btn">Envoyer</button>
      </div>
    </div>
  );
}
