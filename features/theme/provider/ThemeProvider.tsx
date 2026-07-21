"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DEFAULT_THEME, isThemeName, ThemeName } from "../themeRegistry";

const STORAGE_KEY = "allpass-theme";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(DEFAULT_THEME);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const initial = isThemeName(stored)
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : DEFAULT_THEME;
      setTheme(initial);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [ready, theme]);

  const value = useMemo<ThemeContextValue>(() => ({
    theme,
    setTheme,
    toggleTheme: () => setTheme((current) => current === "dark" ? "light" : "dark"),
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme은 ThemeProvider 안에서 사용해야 합니다.");
  return context;
}
