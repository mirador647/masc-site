export default function Footer() {
  return (
    <footer className="bg-black/70 border-t border-purple-700/30">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Invincible — Design néon 💜
      </div>
    </footer>
  );
}
