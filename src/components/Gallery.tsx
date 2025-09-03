// src/components/Gallery.tsx
"use client";

import { useState } from "react";

const images = [
  "/images/gallery/1.jpg",
  "/images/gallery/2.jpg",
  "/images/gallery/3.jpg",
  "/images/gallery/4.jpg",
  "/images/gallery/5.jpg",
  "/images/gallery/6.jpg",
];

function ImageTile({ src, index }: { src: string; index: number }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    // Fallback si l'image n'existe pas encore
    return (
      <div className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 grid place-items-center h-40 md:h-48">
        <span className="text-gray-400 text-sm">/public{src} (à ajouter)</span>
      </div>
    );
  }

  return (
    <a
      href={src}
      className="group rounded-xl overflow-hidden border border-white/10 bg-white/5 block"
      title={`Galerie ${index + 1}`}
    >
      <img
        src={src}
        alt={`Galerie ${index + 1}`}
        className="w-full h-40 md:h-48 object-cover group-hover:opacity-90 transition"
        onError={() => setErrored(true)}
        loading="lazy"
      />
    </a>
  );
}

export default function Gallery() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {images.map((src, idx) => (
        <ImageTile key={src + idx} src={src} index={idx} />
      ))}
    </div>
  );
}
