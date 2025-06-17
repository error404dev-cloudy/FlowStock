import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Ajout de la configuration pour Clerk
  images: {
    domains: ["static.clerk.com"], // Définir les domaines autorisés pour les images (si nécessaire)
  },
  env: {
    CLERK_FRONTEND_API: process.env.CLERK_FRONTEND_API, // Utilisation des variables d'environnement
  },
};

export default nextConfig;
