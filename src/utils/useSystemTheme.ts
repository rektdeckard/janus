import { useState } from "react";
import { useEvent } from "./useEvent";

const media = window.matchMedia("(prefers-color-scheme: dark)");
const getTheme = (isDark: boolean) => (isDark ? "dark" : "light");

export const useSystemTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getTheme(media.matches));
  useEvent("change", (q) => setTheme(getTheme(q.matches)), true, media);
  return theme;
};
