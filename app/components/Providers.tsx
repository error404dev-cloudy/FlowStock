"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "./ThemeProvider";
import { ThemeInitializer } from "./ThemeInitializer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ThemeInitializer />
      <ThemeProvider>{children}</ThemeProvider>
    </ClerkProvider>
  );
}
