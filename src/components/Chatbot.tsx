"use client";
import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Erreur de connexion à l’IA" }
      ]);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-gray-900 rounded-xl shadow-xl border border-purple-600 overflow-hidden">
      <div className="bg-purple-700 text-white p-3 font-bold">⚡ Chat IA</div>
      <div className="h-60 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${
              m.role === "user" ? "text-right" : "text-left"
            } text-sm`}
          >
            <span
              className={`${
                m.role === "user" ? "bg-purple-600" : "bg-gray-700"
              } px-2 py-1 rounded-lg inline-block`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex border-t border-gray-700">
        <input
          className="flex-1 p-2 bg-black text-white outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-purple-600 hover:bg-purple-700"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
