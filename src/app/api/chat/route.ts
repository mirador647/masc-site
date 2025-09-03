// src/app/api/chat/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL =
  process.env.GROQ_MODEL ||
  "meta-llama/llama-4-scout-17b-16e-instruct"; // même modèle que ton curl

type HistoryTurn =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string };

export async function OPTIONS() {
  // (facultatif) CORS souple pour tests locaux
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "content-type, authorization",
    },
  });
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY manquante dans .env.local (ou variables Vercel)" },
        { status: 400 }
      );
    }

    // Body attendu : { message: string, history?: HistoryTurn[] }
    const { message, history }: { message?: string; history?: HistoryTurn[] } =
      await req.json().catch(() => ({} as any));

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Champ 'message' requis (string)" },
        { status: 400 }
      );
    }

    // Construit les messages au format OpenAI compatible
    const messages: Array<{ role: "system" | "user" | "assistant"; content: any }> = [
      {
        role: "system",
        content:
          "Tu es un assistant utile, concis et bienveillant. Réponds clairement en français. " +
          "Si l'utilisateur demande quelque chose d'ambigu, pose une question courte pour préciser.",
      },
    ];

    if (Array.isArray(history)) {
      for (const turn of history) {
        if (
          turn &&
          (turn.role === "user" || turn.role === "assistant") &&
          typeof turn.content === "string"
        ) {
          messages.push({ role: turn.role, content: turn.content });
        }
      }
    }

    // Dernier tour utilisateur
    messages.push({ role: "user", content: message });

    const resp = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.6,
        max_tokens: 1024,
        stream: false, // ChatFull peut streamer si tu veux; ici on renvoie un bloc simple
      }),
    });

    if (!resp.ok) {
      const text = await resp.text().catch(() => "");
      return NextResponse.json(
        {
          error: `Erreur API Grok: ${text || resp.statusText}`,
          status: resp.status,
        },
        { status: 500 }
      );
    }

    const data = await resp.json();

    const reply: string =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.message?.delta?.content ??
      "";

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erreur inconnue" },
      { status: 500 }
    );
  }
}
