// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-8 text-sm text-gray-400">
        © {new Date().getFullYear()} Avara — Fais simple, avance chaque jour.
      </div>
    </footer>
  );
}
