import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Super Saiyan Site",
  description: "Libère ta puissance financière ⚡"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
