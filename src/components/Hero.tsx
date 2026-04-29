import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, FileText, Download, Eye } from "lucide-react";
import { fadeUpSmall, stagger, durations, easings } from "@/lib/motion";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const heroStagger = stagger(0.15, 0.08);

/**
 * Mapa lang → caminho do PDF servido pelo GitHub Pages.
 * Os PDFs são gerados por scripts/build-cv.mjs (um pra cada idioma).
 */
const PDF_FOR_LANG = {
  pt: "/curriculo.pdf",
  en: "/curriculo-en.pdf",
} as const;

const PDF_FILENAME_FOR_LANG = {
  pt: "rafael-nassar-curriculo.pdf",
  en: "rafael-nassar-resume.pdf",
} as const;

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Pausa o scroll-indicator quando o Hero sai da tela (economia de RAF + sem clutter visual).
  const isHeroInView = useInView(sectionRef, { margin: "-30% 0px" });
  const navigate = useNavigate();
  const { lang } = useLang();
  const tx = t(lang);

  /*
   * Comportamento do botão "Currículo / Resume":
   * - Mobile (<640px): deixa o `<a download>` fazer download direto do PDF
   *   (no idioma correspondente ao lang atual).
   * - Tablet/desktop (≥640px): cancela o download e navega via SPA pra /cv,
   *   onde a folha A4 cabe confortavelmente e o user pode ler online.
   * - Modificadores (Ctrl/Cmd/Shift/Alt + click): preserva default do browser.
   */
  const handleResumeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 640px)").matches
    ) {
      e.preventDefault();
      navigate("/cv");
    }
  };

  return (
    <section
      ref={sectionRef}
      aria-label={tx.hero.sectionLabel}
      className="min-h-[100svh] flex items-center justify-center px-6 pt-16 pb-24 relative"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroStagger}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div variants={fadeUpSmall} className="mb-6">
          {/*
            Pílula mantida (decisão estética). Removido o dot verde pulsante
            (clichê SaaS-platform) e ajustado contraste de text-foreground/70
            (borderline 4.5:1) → text-foreground (AAA sobre bg-secondary).
          */}
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-secondary/80 text-sm text-foreground">
            {tx.hero.badge}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUpSmall}
          className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-4"
        >
          Rafael Nassar
        </motion.h1>

        <motion.p
          variants={fadeUpSmall}
          className="text-xl sm:text-2xl font-serif italic text-muted-foreground mb-6"
        >
          {tx.hero.role}
        </motion.p>

        <motion.p
          variants={fadeUpSmall}
          className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed"
        >
          {tx.hero.pitch}
        </motion.p>

        <motion.div
          variants={fadeUpSmall}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="https://github.com/rafaelnassar"
            target="_blank"
            rel="noopener noreferrer"
            className={iconButtonClassName("outline", "lg")}
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" aria-hidden />
          </a>
          <a
            href="https://www.linkedin.com/in/nassarrafael"
            target="_blank"
            rel="noopener noreferrer"
            className={iconButtonClassName("outline", "lg")}
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" aria-hidden />
          </a>
          <a
            href={PDF_FOR_LANG[lang]}
            download={PDF_FILENAME_FOR_LANG[lang]}
            onClick={handleResumeClick}
            className={cn(
              "group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity duration-200 text-sm font-medium",
              focusRing
            )}
            aria-label={tx.hero.resumeAria}
          >
            <span className="relative w-4 h-4 inline-block overflow-hidden">
              <FileText
                aria-hidden
                className="absolute inset-0 w-4 h-4 transition-transform duration-200 ease-out group-hover:-translate-y-5"
              />
              {/* Mobile: Download */}
              <Download
                aria-hidden
                className="sm:hidden absolute inset-0 w-4 h-4 translate-y-5 transition-transform duration-200 ease-out group-hover:translate-y-0"
              />
              {/* Tablet+: Eye */}
              <Eye
                aria-hidden
                className="hidden sm:block absolute inset-0 w-4 h-4 translate-y-5 transition-transform duration-200 ease-out group-hover:translate-y-0"
              />
            </span>
            {tx.hero.resumeLabel}
          </a>
        </motion.div>
      </motion.div>

      {/*
        Scroll indicator — visível em todos os viewports.
        Em mobile faz ainda mais sentido: a Hero ocupa 100svh e o user
        precisa do affordance pra entender que existe conteúdo abaixo.
        bottom-6 em mobile (mais próximo da borda da tela curta) e
        bottom-8 em sm+ (mais respiração no desktop).
      */}
      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroInView ? 1 : 0 }}
        transition={{ duration: durations.long, delay: 0.6, ease: easings.smooth }}
        className={cn(
          "absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/70 hover:text-foreground transition-colors group cursor-pointer rounded-md",
          focusRing
        )}
        aria-label={tx.hero.scrollNext}
      >
        <span className="text-xs font-medium tracking-widest uppercase">{tx.hero.scrollLabel}</span>
        <span
          aria-hidden
          className="w-6 h-10 rounded-full border-2 border-current flex items-start justify-center p-1.5"
        >
          <motion.span
            animate={isHeroInView ? { y: [0, 8, 0] } : { y: 0 }}
            transition={{
              duration: 1.5,
              repeat: isHeroInView ? Infinity : 0,
              ease: "easeInOut",
            }}
            className="block w-1.5 h-1.5 rounded-full bg-current"
          />
        </span>
      </motion.a>
    </section>
  );
};
