import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Invincible",
  description: "Site stylé + IA Groq",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-950 text-white flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Portails éventuels (modals) */}
        <div id="portal-root" />
      </body>
    </html>
  );
}
