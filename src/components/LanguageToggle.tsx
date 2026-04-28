import { motion, AnimatePresence } from "framer-motion";
import { durations, easings } from "@/lib/motion";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { cn, focusRing } from "@/lib/utils";

/**
 * Toggle PT ⇄ EN. Posicionado ao lado do ThemeToggle.
 *
 * UX:
 * - Mostra a sigla do idioma ALVO (não atual) — quando tá em PT, mostra "EN"
 *   pra indicar que clicar muda pra inglês. Padrão de toggles.
 * - Animação cross-fade espelha o ThemeToggle pra coerência visual.
 * - Não quebra layout: mesmo box que o ThemeToggle (h-9, padding lateral
 *   curto pra acomodar 2 letras).
 */
export const LanguageToggle = () => {
  const { lang, setLang } = useLang();
  const tx = t(lang);
  const target = lang === "pt" ? "en" : "pt";
  const targetLabel = target.toUpperCase();

  return (
    <motion.button
      onClick={() => setLang(target)}
      type="button"
      className={cn(
        "relative inline-flex items-center justify-center px-2.5 h-9 rounded-full",
        "border border-border hover:border-foreground/30 hover:bg-secondary",
        "transition-colors duration-200 overflow-hidden",
        "text-xs font-semibold tracking-wider",
        focusRing
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={
        target === "en" ? tx.toggle.langSwitchToEn : tx.toggle.langSwitchToPt
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={target}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: durations.short, ease: easings.smooth }}
          className="block"
        >
          {targetLabel}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};
