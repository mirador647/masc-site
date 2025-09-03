// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { reply: "⚠️ GROQ_API_KEY manquante (mets-la dans .env.local)" },
        { status: 500 }
      );
    }

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "system",
              content:
                "Tu es un assistant utile, concis et concret. Réponds en français.",
            },
            { role: "user", content: message },
          ],
          temperature: 0.7,
        }),
      }
    );

    const raw = await groqRes.text();

    if (!groqRes.ok) {
      // On renvoie l’erreur brute pour debug
      return NextResponse.json(
        { reply: `⚠️ Erreur API Groq: ${raw}` },
        { status: groqRes.status }
      );
    }

    const data = JSON.parse(raw);
    const reply = data?.choices?.[0]?.message?.content ?? "Réponse vide.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Erreur serveur /api/chat:", err);
    return NextResponse.json(
      { reply: "⚠️ Erreur serveur (API Chat)" },
      { status: 500 }
    );
  }
}
