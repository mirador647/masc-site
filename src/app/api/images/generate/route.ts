// src/app/api/images/generate/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, n = 1, size = "1024x1024" } = await req.json();
    const key =
      process.env.OPENAI_API_KEY ||
      process.env.NEXT_PUBLIC_OPENAI_API_KEY; // si jamais

    if (!key) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY manquante dans .env.local (requise pour la génération d’images)" },
        { status: 400 }
      );
    }

    const r = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        n,
        size,
        response_format: "b64_json",
      }),
    });

    const text = await r.text();
    if (!r.ok) {
      return NextResponse.json({ error: text || "API error" }, { status: r.status });
    }
    const data = JSON.parse(text);
    const images: string[] = (data?.data || []).map((d: any) => `data:image/png;base64,${d.b64_json}`);
    return NextResponse.json({ images });
  } catch (e) {
    console.error("images/generate error:", e);
    return NextResponse.json({ error: "Erreur serveur images" }, { status: 500 });
  }
}
