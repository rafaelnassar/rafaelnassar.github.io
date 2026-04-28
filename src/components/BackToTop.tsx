import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const BackToTop = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Closure local evita disparar setState com mesmo valor (skip re-render desnecessário)
    let visible = false;
    const handleScroll = () => {
      const next = window.scrollY > 400;
      if (next !== visible) {
        visible = next;
        setIsVisible(next);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          onClick={scrollToTop}
          className={cn(
            iconButtonClassName("solid", "lg"),
            "fixed bottom-6 right-6 z-40 shadow-lg"
          )}
          aria-label={tx.nav.backToTop}
        >
          <ArrowUp size={20} aria-hidden />
        </motion.button>
      )}
    </AnimatePresence>
  );
};
