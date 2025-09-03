import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // <-- accepte GROQ_API_KEY (Groq) et GROK_API_KEY (typo fréquente)
    const apiKey =
      process.env.GROQ_API_KEY ||
      process.env.GROK_API_KEY ||
      process.env.NEXT_PUBLIC_GROQ_API_KEY || // au cas où tu l’as mis en public (pas recommandé)
      process.env.NEXT_PUBLIC_GROK_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "⚠️ GROQ_API_KEY/GROK_API_KEY manquante dans .env.local" },
        { status: 500 }
      );
    }

    const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "meta-llama/llama-4-scout-17b-16e-instruct",
        messages: [
          { role: "system", content: "Réponds en français, utile et concis." },
          { role: "user", content: message ?? "" }
        ],
        temperature: 0.7
      }),
    });

    const text = await resp.text();

    if (!resp.ok) {
      return NextResponse.json(
        { reply: `⚠️ Erreur API Groq: ${text}` },
        { status: resp.status }
      );
    }

    const data = JSON.parse(text);
    const reply =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      "…";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Erreur /api/chat:", err);
    return NextResponse.json(
      { reply: "⚠️ Erreur serveur IA" },
      { status: 500 }
    );
  }
}
