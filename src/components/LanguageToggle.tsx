import { motion, AnimatePresence } from "framer-motion";
import { durations, easings } from "@/lib/motion";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { cn } from "@/lib/utils";

/**
 * Toggle PT ⇄ EN. Posicionado ao lado do ThemeToggle.
 *
 * Mesma silhueta do ThemeToggle pra paridade visual:
 * - iconButtonClassName('outline', 'sm') = p-2 rounded-full (32×32 visual)
 * - Texto envolvido em <span className="w-4 h-4 ..."> ocupa exatamente o
 *   mesmo footprint dos ícones Lucide Sun/Moon (16×16 within the padding)
 * - Cross-fade vertical (y: 8 → 0 → -8) idêntico ao ThemeToggle
 *
 * Mostra a sigla do idioma ALVO (não atual) — quando tá em PT, mostra "EN"
 * pra indicar que clicar muda pra inglês.
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
      className={cn(iconButtonClassName("outline", "sm"), "relative overflow-hidden")}
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
          className="flex items-center justify-center w-4 h-4 text-[11px] font-bold leading-none tracking-tight"
        >
          {targetLabel}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
};
