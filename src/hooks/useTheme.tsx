import { useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "impressio-theme";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

export const initTheme = () => {
  const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light";
  applyTheme(stored);
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "light";
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((t: Theme) => setThemeState(t), []);
  const toggleTheme = useCallback(() => setThemeState((p) => (p === "dark" ? "light" : "dark")), []);

  return { theme, setTheme, toggleTheme };
};