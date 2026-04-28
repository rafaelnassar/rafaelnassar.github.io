import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Brand } from "@/components/shared/Brand";
import { springs } from "@/lib/motion";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const SCROLL_OFFSET = 80;

// IDs e hrefs são fixos (não dependem de idioma) — evita re-execução do
// useEffect do IntersectionObserver quando o usuário troca de idioma.
const NAV_SECTION_IDS = [
  "sobre",
  "experiencia",
  "projetos",
  "clientes",
  "tecnologias",
  "certificacoes",
  "contato",
] as const;

export const Header = () => {
  const { lang } = useLang();
  const tx = t(lang);

  // navLinks dependem de lang (textos traduzidos). IDs e hrefs são fixos
  // pra não quebrar deep-links e ancoragem por seção.
  const navLinks = [
    { name: tx.nav.about, href: "#sobre", id: "sobre" },
    { name: tx.nav.experience, href: "#experiencia", id: "experiencia" },
    { name: tx.nav.projects, href: "#projetos", id: "projetos" },
    { name: tx.nav.clients, href: "#clientes", id: "clientes" },
    { name: tx.nav.stack, href: "#tecnologias", id: "tecnologias" },
    { name: tx.nav.certifications, href: "#certificacoes", id: "certificacoes" },
    { name: tx.nav.contact, href: "#contato", id: "contato" },
  ];

  const [isScrolled, setIsScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > 20
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pendingScrollRef = useRef<string | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Listener único de scroll: atualiza isScrolled + edge cases (topo/fim da página).
  // O destaque por seção visível é responsabilidade do IntersectionObserver abaixo.
  useEffect(() => {
    const sectionIds = NAV_SECTION_IDS;
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) {
      const handleScrollOnly = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener("scroll", handleScrollOnly, { passive: true });
      return () => window.removeEventListener("scroll", handleScrollOnly);
    }

    const visibility = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }

        let bestId: string | null = null;
        let bestRatio = 0;
        visibility.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });

        if (bestRatio > 0) {
          setActiveSection(bestId);
        }
      },
      {
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((section) => observer.observe(section));

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;

      if (scrollY < 100) {
        setActiveSection(null);
        return;
      }
      if (scrollY + viewportHeight >= docHeight - 50) {
        setActiveSection(sectionIds[sectionIds.length - 1]);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Sincroniza posição do indicador com a seção ativa + recalcula em resize.
  useEffect(() => {
    const updateIndicator = () => {
      if (!activeSection || !navRef.current) return;
      const activeLink = navRef.current.querySelector(
        `[data-section="${activeSection}"]`
      ) as HTMLElement | null;
      if (!activeLink) return;
      const navRect = navRef.current.getBoundingClientRect();
      const linkRect = activeLink.getBoundingClientRect();
      setIndicatorStyle({
        left: linkRect.left - navRect.left,
        width: linkRect.width,
      });
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeSection]);

  // Mobile menu: ESC + focus trap + retorno de foco ao botão (WAI-ARIA dialog pattern).
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const menuEl = mobileNavRef.current;
    if (!menuEl) return;

    const focusables = menuEl.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    // Move foco pro primeiro link após o motion mount
    const focusTimer = window.setTimeout(() => first?.focus(), 50);

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab" || focusables.length === 0) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMobileMenuOpen]);

  // Quando o menu fecha, devolve o foco ao botão "Menu" (a11y)
  const previousMenuOpen = useRef(isMobileMenuOpen);
  useEffect(() => {
    if (previousMenuOpen.current && !isMobileMenuOpen) {
      menuButtonRef.current?.focus();
    }
    previousMenuOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <motion.a
          href="#"
          title={tx.nav.backToTop}
          className={cn("cursor-pointer rounded-md", focusRing)}
          whileHover={{ opacity: 0.7 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            setActiveSection(null);
          }}
        >
          <Brand />
        </motion.a>

        <nav
          ref={navRef}
          aria-label={tx.nav.primaryNav}
          className="hidden lg:flex items-center gap-1 bg-secondary/50 backdrop-blur-sm rounded-full px-1.5 py-1.5 relative"
        >
          {activeSection && (
            <motion.span
              aria-hidden
              className="absolute bg-background rounded-full shadow-sm"
              layoutId="nav-indicator"
              initial={false}
              animate={{
                left: indicatorStyle.left,
                width: indicatorStyle.width,
              }}
              transition={springs.soft}
              style={{
                height: "calc(100% - 12px)",
                top: "6px",
              }}
            />
          )}
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              data-section={link.id}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.id);
              }}
              className={cn(
                "relative z-10 px-4 py-2 text-sm rounded-full transition-colors duration-200",
                focusRing,
                activeSection === link.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <Button size="sm" asChild>
            <a
              href="https://www.linkedin.com/in/rafael-nassar-2a3637287"
              target="_blank"
              rel="noopener noreferrer"
            >
              {tx.nav.headerCta}
            </a>
          </Button>
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            className={cn(
              "p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors",
              focusRing
            )}
            aria-label={isMobileMenuOpen ? tx.nav.menuClose : tx.nav.menuOpen}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            ref={mobileNavRef}
            role="dialog"
            aria-modal="true"
            aria-label={tx.nav.menuLabel}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
            onAnimationComplete={(definition) => {
              if (definition === "exit" && pendingScrollRef.current) {
                scrollToSection(pendingScrollRef.current);
                pendingScrollRef.current = null;
              }
            }}
          >
            <nav
              aria-label={tx.nav.mobileNav}
              className="container mx-auto px-6 py-4 flex flex-col gap-1"
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    pendingScrollRef.current = link.id;
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "px-3 py-2.5 rounded-lg transition-colors",
                    focusRing,
                    activeSection === link.id
                      ? "text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.name}
                </a>
              ))}
              <div className="mt-4 pt-4 border-t border-border">
                <Button className="w-full" asChild>
                  <a
                    href="https://www.linkedin.com/in/rafael-nassar-2a3637287"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.nav.headerCtaMobile}
                  </a>
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
