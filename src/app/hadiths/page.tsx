"use client";
import { useEffect, useState } from "react";

type Note = { id: string; title: string; reference?: string; content: string; createdAt: string };
const STORAGE = "hadiths:notes";

export default function HadithsPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    try { setNotes(JSON.parse(localStorage.getItem(STORAGE) || "[]")); } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify(notes));
  }, [notes]);

  const add = () => {
    if (!title.trim() && !content.trim()) return;
    const id = Date.now().toString(36);
    setNotes([{ id, title: title.trim(), reference: reference.trim() || undefined, content: content.trim(), createdAt: new Date().toISOString() }, ...notes]);
    setTitle(""); setReference(""); setContent("");
  };

  const remove = (id: string) => setNotes(notes.filter(n => n.id !== id));

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-bold text-purple-400">Hadiths — notes personnelles</h1>
      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Titre / thème</label>
            <input className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Référence (ex: Bukhari 1:2)</label>
            <input className="w-full bg-black/50 border border-purple-700/40 rounded-xl px-3 py-3" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Contenu</label>
          <textarea className="w-full bg-black/50 border border-purple-700/40 rounded-xl p-3 min-h-[140px]" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Texte / compréhension / rappels…" />
        </div>
        <div className="flex gap-3">
          <button onClick={add} className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700">Enregistrer</button>
          <button onClick={() => { setTitle(""); setReference(""); setContent(""); }} className="px-5 py-3 rounded-xl border border-purple-700/50 hover:bg-purple-700/10">Effacer</button>
        </div>
      </section>

      <section className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-4">Mes notes</h2>
        {notes.length === 0 ? (
          <p className="text-gray-400">Aucune note pour l’instant.</p>
        ) : (
          <ul className="space-y-4">
            {notes.map(n => (
              <li key={n.id} className="border border-purple-700/30 rounded-xl p-4 bg-black/40">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
                    <h3 className="text-lg font-semibold">{n.title || "Sans titre"}</h3>
                    {n.reference && <div className="text-purple-300 text-sm mb-1">{n.reference}</div>}
                    <p className="text-gray-200 whitespace-pre-wrap">{n.content}</p>
                  </div>
                  <button onClick={() => remove(n.id)} className="text-xs px-3 py-1 rounded-lg border border-rose-700/40 hover:bg-rose-700/10">Supprimer</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
