import { useEffect, useState } from "react";

const KEY = "crewnyx_theme";
type Theme = "light" | "dark";

const apply = (t: Theme) => {
  const root = document.documentElement;
  if (t === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
};

export const initTheme = () => {
  const saved = (localStorage.getItem(KEY) as Theme | null) ?? "light";
  apply(saved);
};

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(
    () => (typeof window !== "undefined" && (localStorage.getItem(KEY) as Theme | null)) || "light"
  );

  useEffect(() => {
    apply(theme);
    localStorage.setItem(KEY, theme);
  }, [theme]);

  return {
    theme,
    setTheme: setThemeState,
    toggle: () => setThemeState((t) => (t === "dark" ? "light" : "dark")),
  };
};
