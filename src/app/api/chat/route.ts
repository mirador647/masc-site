import { NextRequest } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "Missing GROQ_API_KEY" }), { status: 500 });
    }
    const groq = new Groq({ apiKey });

    const body = await req.json().catch(() => ({}));
    const messages = Array.isArray(body?.messages) ? body.messages : [];
    const model = process.env.GROQ_MODEL || "llama3-70b-8192";

    const completion = await groq.chat.completions.create({
      model,
      messages: messages.map((m: any) => ({ role: m.role, content: String(m.content ?? "") })),
      temperature: 0.6,
      max_tokens: 1024,
    });

    const content =
      completion?.choices?.[0]?.message?.content ??
      "Je n'ai pas reçu de réponse du modèle.";

    return Response.json({ content });
  } catch (err: any) {
    console.error("CHAT API ERROR:", err);
    return new Response(JSON.stringify({ error: err?.message || "Server error" }), { status: 500 });
  }
}