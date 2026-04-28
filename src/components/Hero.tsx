import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Github, Linkedin, FileText, Download, Eye } from "lucide-react";
import { fadeUpSmall, stagger, durations, easings } from "@/lib/motion";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { cn, focusRing } from "@/lib/utils";

const heroStagger = stagger(0.15, 0.08);

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  // Pausa o scroll-indicator quando o Hero sai da tela (economia de RAF + sem clutter visual).
  const isHeroInView = useInView(sectionRef, { margin: "-30% 0px" });
  const navigate = useNavigate();

  /*
   * Comportamento do botão "Currículo":
   * - Mobile (<640px): deixa o `<a download>` fazer download direto do PDF.
   *   A página /cv tem layout A4 fixo (210mm) que ficaria ilegível em
   *   tela pequena — melhor entregar o PDF pronto pra leitura ou impressão.
   * - Tablet/desktop (≥640px): cancela o download e navega via SPA pra /cv,
   *   onde a folha A4 cabe confortavelmente e o user pode ler online.
   * - Modificadores (Ctrl/Cmd/Shift/Alt + click): preserva default do browser
   *   (abrir em nova aba, baixar, etc) sem interferir.
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
      aria-label="Introdução"
      className="min-h-[100svh] flex items-center justify-center px-6 pt-16 pb-24 relative"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroStagger}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div variants={fadeUpSmall} className="mb-6">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary/80 text-sm text-foreground/70">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Disponível para projetos
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
          Software Engineer
        </motion.p>

        <motion.p
          variants={fadeUpSmall}
          className="text-base sm:text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed"
        >
          Apps web, mobile e SaaS que resolvem problemas reais — do zero ou
          integrando com sistemas legados.
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
            href="https://www.linkedin.com/in/rafael-nassar-2a3637287"
            target="_blank"
            rel="noopener noreferrer"
            className={iconButtonClassName("outline", "lg")}
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" aria-hidden />
          </a>
          {/*
            Comportamento responsivo:
            - <a> com `href` + `download` é o caminho padrão (funciona com JS off,
              em mobile, em ctrl/cmd-click — sempre baixa o PDF).
            - O onClick intercepta apenas em telas ≥640px sem modificadores
              e redireciona pra /cv via React Router.
          */}
          <a
            href="/curriculo.pdf"
            download="rafael-nassar-cv.pdf"
            onClick={handleResumeClick}
            className={cn(
              "group inline-flex items-center gap-2 px-5 py-3 rounded-full bg-foreground text-background hover:opacity-90 transition-opacity duration-200 text-sm font-medium",
              focusRing
            )}
            aria-label="Currículo (ver online ou baixar PDF)"
          >
            {/*
              Ícone do hover varia por viewport, casando com a ação real:
              - Mobile (<640px): Download — comportamento real é baixar PDF
              - Tablet/Desktop (≥640px): Eye — comportamento real é abrir /cv
              Ambos os ícones existem no DOM; Tailwind responsive classes
              alternam visibility sem layout shift (mesmo box, posição absolute).
            */}
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
            Currículo
          </a>
        </motion.div>
      </motion.div>

      <motion.a
        href="#sobre"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroInView ? 1 : 0 }}
        transition={{ duration: durations.long, delay: 0.6, ease: easings.smooth }}
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 text-foreground/70 hover:text-foreground transition-colors group cursor-pointer rounded-md",
          focusRing
        )}
        aria-label="Rolar para a próxima seção"
      >
        <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
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
