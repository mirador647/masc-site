"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Paperclip, RotateCcw, Download, ImagePlus, X, Sparkles } from "lucide-react";

type Role = "user" | "assistant";
type Msg = { role: Role; content: string; images?: string[] };

const STORAGE_KEY = "ai:conversation";
const DRAFT_KEY = "ai:draft";

function TypingDots() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "." : d + "."));
    }, 350);
    return () => clearInterval(t);
  }, []);
  return <span className="opacity-80">{dots}</span>;
}

export default function ChatFull() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const viewRef = useRef<HTMLDivElement>(null);
  const sp = useSearchParams();
  const ctxInjected = useRef(false);

  // Charger historique + ctx (?ctx=...) + brouillon
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) setInput(draft);
    } catch {}
    const ctx = sp.get("ctx");
    if (ctx && !ctxInjected.current) {
      ctxInjected.current = true;
      setMessages((m) => [...m, { role: "user", content: ctx }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sauvegarde + scroll bas
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    viewRef.current?.scrollTo({ top: viewRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Auto-save du brouillon
  useEffect(() => {
    try {
      localStorage.setItem(DRAFT_KEY, input);
    } catch {}
  }, [input]);

  const exportText = () => {
    const plain = messages
      .map((m) => `${m.role === "user" ? "Tu" : "IA"}: ${m.content}${m.images?.length ? ` [${m.images.length} image(s)]` : ""}`)
      .join("\n\n");
    const blob = new Blob([plain], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversation.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Gestion pièces jointes (input & drag/drop)
  const onFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const urls: string[] = [];
    Array.from(fileList).forEach((f) => {
      if (f.type.startsWith("image/")) {
        const u = URL.createObjectURL(f);
        urls.push(u);
      }
    });
    if (urls.length) setAttachments((prev) => [...prev, ...urls]);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files || null);
  };

  const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const it of items as any) {
      if (it.kind === "file") {
        const f = it.getAsFile();
        if (f && f.type.startsWith("image/")) files.push(f);
      }
    }
    if (files.length) {
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      onFiles(dt.files);
    }
  };

  // Animation d'écriture (sans streaming serveur)
  const typeOut = async (full: string) => {
    setTyping(true);
    const id = crypto.randomUUID();
    // On ajoute un message assistant vide puis on le remplit caractère par caractère
    setMessages((m) => [...m, { role: "assistant", content: "", images: [] }]);
    const step = Math.max(1, Math.floor(full.length / 50)); // vitesse adaptative
    for (let i = 0; i <= full.length; i += step) {
      const slice = full.slice(0, i);
      await new Promise((r) => setTimeout(r, 15));
      setMessages((m) => {
        const copy = [...m];
        // remplace le dernier message assistant
        copy[copy.length - 1] = { ...copy[copy.length - 1], content: slice };
        return copy;
      });
    }
    setTyping(false);
  };

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const txt = input.trim();
    setInput("");
    const imgs = attachments;
    setAttachments([]);

    // On enregistre le message utilisateur avec ses images
    setMessages((m) => [...m, { role: "user", content: txt, images: imgs.length ? imgs : undefined }]);
    setSending(true);

    // Indicateur "réfléchit…"
    const thinkingIndex = messages.length + 1; // futur index du message assistant
    setMessages((m) => [...m, { role: "assistant", content: "Réflexion en cours", images: [] }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt })
      });
      const data = await res.json();

      // On retire le placeholder "réflexion" avant d'animer la vraie réponse
      setMessages((m) => m.slice(0, thinkingIndex));
      await typeOut(data.reply ?? "…");
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Erreur de connexion à l’IA", images: [] }
      ]);
    } finally {
      setSending(false);
    }
  };

  const generateImage = async () => {
    // Utilise le texte du champ comme prompt
    const prompt = input.trim();
    if (!prompt) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: `Génère une image: ${prompt}` }]);

    // placeholder assistant "réfléchit"
    setMessages((m) => [...m, { role: "assistant", content: "Génération d’image en cours", images: [] }]);
    const idx = messages.length + 1;

    try {
      const r = await fetch("/api/images/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, n: 1, size: "1024x1024" })
      });
      const j = await r.json();
      if (!r.ok) {
        // remplace le placeholder par l’erreur
        setMessages((m) => {
          const copy = [...m];
          copy[idx] = { role: "assistant", content: `⚠️ ${j?.error || "Échec de génération"}`, images: [] };
          return copy;
        });
        return;
      }
      const imgs: string[] = j.images || [];
      setMessages((m) => {
        const copy = [...m];
        copy[idx] = { role: "assistant", content: "Image générée", images: imgs };
        return copy;
      });
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[idx] = { role: "assistant", content: "⚠️ Erreur réseau pendant la génération", images: [] };
        return copy;
      });
    }
  };

  const empty = messages.length === 0;

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.key === "Enter" && !e.shiftKey)) {
      e.preventDefault();
      sendMessage();
    }
  };

  const dropHandlers = {
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    },
    onDrop,
  };

  return (
    <div className="min-h-[calc(100vh-64px-64px)] max-w-6xl mx-auto px-4 py-6 md:py-8 flex flex-col gap-4">

      {/* Header / actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-300">Espace IA</h1>
          <div className="text-xs text-gray-400">Modèle: Groq Llama 4 Scout 17B (via /api/chat). Aucune modif serveur.</div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { localStorage.removeItem(STORAGE_KEY); setMessages([]); }}
            className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Nouvelle conversation"
          >
            <RotateCcw size={16}/> Nouveau
          </button>
          <button
            onClick={exportText}
            className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Exporter en .txt"
          >
            <Download size={16}/> Exporter
          </button>
        </div>
      </div>

      {/* Zone de drop + messages */}
      <div
        ref={viewRef}
        {...dropHandlers}
        className="flex-1 overflow-y-auto rounded-2xl border border-purple-700/40 bg-gray-900/70 p-4 space-y-3"
      >
        {empty && (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            Dépose des images ici, ou commence à écrire pour discuter avec l’IA.
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
            <div className="inline-flex flex-col gap-2 max-w-[85%]">
              <span
                className={`${m.role === "user" ? "bg-purple-600" : "bg-gray-700"} px-4 py-2 rounded-xl inline-block text-sm whitespace-pre-wrap`}
              >
                {m.content}
                {m.role === "assistant" && sending && i === messages.length - 1 && (
                  <span className="ml-1 opacity-70"><TypingDots/></span>
                )}
              </span>
              {!!m.images?.length && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {m.images.map((src, k) => (
                    <img key={k} src={src} alt="pièce jointe" className="rounded-lg border border-purple-700/30 max-h-40 object-cover" />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Composer */}
      <div className="rounded-2xl border border-purple-700/40 bg-black/60 p-3">
        {/* attachments preview */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {attachments.map((src, i) => (
              <div key={i} className="relative">
                <img src={src} alt="à envoyer" className="w-20 h-20 object-cover rounded-lg border border-purple-700/40" />
                <button
                  className="absolute -top-2 -right-2 bg-rose-600 rounded-full p-1"
                  title="Retirer"
                  onClick={() => setAttachments((arr) => arr.filter((_, idx) => idx !== i))}
                >
                  <X size={14}/>
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2">
          <label className="px-3 py-2 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 cursor-pointer inline-flex items-center gap-2">
            <Paperclip size={16}/> Joindre
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onFiles(e.target.files)}
              className="hidden"
            />
          </label>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
            placeholder="Écris ton message (Shift+Entrée pour saut de ligne)…"
            className="flex-1 bg-black text-white border border-purple-700/40 rounded-xl px-4 py-3 min-h-[48px] max-h-40 outline-none"
          />

          <button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-60"
          >
            Envoyer
          </button>

          <button
            onClick={generateImage}
            disabled={!input.trim()}
            className="px-4 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10 inline-flex items-center gap-2"
            title="Générer une image à partir du prompt"
          >
            <Sparkles size={16}/> Image
          </button>
        </div>
        {sending && !typing && (
          <div className="text-xs text-gray-400 mt-2">L’IA réfléchit <TypingDots/></div>
        )}
      </div>
    </div>
  );
}
