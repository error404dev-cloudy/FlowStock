"use client";

import { useEffect } from "react";

export function ThemeInitializer() {
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const defaultTheme = saved ?? "lemonade";
    document.documentElement.setAttribute("data-theme", defaultTheme);
  }, []);

  return null;
}
