import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`, // clé dans .env.local
    },
    body: JSON.stringify({
      model: "meta-llama/llama-4-scout-17b-16e-instruct", // 👈 ton modèle exact
      messages: messages, // 👈 ça vient du frontend (page.tsx)
    }),
  });

  const data = await res.json();

  return NextResponse.json({
    reply: data.choices[0].message,
  });
}
