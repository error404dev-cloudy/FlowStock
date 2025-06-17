import "./globals.css";
import { Providers } from "./components/Providers"; // le fichier créé juste au-dessus
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FlowStock.",
  description: "App SaaS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body className="transition-colors duration-500 ease-in-out">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
