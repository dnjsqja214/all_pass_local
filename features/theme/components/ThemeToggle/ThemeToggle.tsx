"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../provider/ThemeProvider";
import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={styles.button}
      onClick={toggleTheme}
      aria-label={isDark ? "라이트 모드로 변경" : "다크 모드로 변경"}
      title={isDark ? "라이트 모드" : "다크 모드"}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
