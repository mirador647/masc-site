export default function Footer() {
  return (
    <footer className="bg-black/70 text-gray-400 text-center py-6 text-sm border-t border-purple-700/40">
      © {new Date().getFullYear()} Invincible. Tous droits réservés.
    </footer>
  );
}
