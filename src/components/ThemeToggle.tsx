import { Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { durations, easings } from "@/lib/motion";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const ThemeToggle = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [isDark, setIsDark] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );

  // Ref do timer permite cancelar a remoção da classe se o componente desmontar
  // antes do fim da transição (evita orphan callback tocando classList).
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));

    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.add("theme-transitioning");
    document.documentElement.classList.toggle("dark", nextIsDark);
    localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    setIsDark(nextIsDark);

    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
    }

    transitionTimerRef.current = window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transitioning");
      transitionTimerRef.current = null;
    }, 350);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      type="button"
      className={cn(
        iconButtonClassName("outline", "sm"),
        "relative overflow-hidden"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isDark ? tx.toggle.themeLight : tx.toggle.themeDark}
    >
      {/* Cross-fade + sutil rotação — mais elegante que rotação pura */}
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 45, opacity: 0, scale: 0.7 }}
            transition={{ duration: durations.short, ease: easings.smooth }}
            className="block"
          >
            <Sun className="w-4 h-4" aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 45, opacity: 0, scale: 0.7 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -45, opacity: 0, scale: 0.7 }}
            transition={{ duration: durations.short, ease: easings.smooth }}
            className="block"
          >
            <Moon className="w-4 h-4" aria-hidden />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
