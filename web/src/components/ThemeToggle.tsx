import { useTheme } from "../hooks/themeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="themeToggleButton"
      onClick={toggleTheme}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
