import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Brand } from "@/components/shared/Brand";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { durations, easings, springs } from "@/lib/motion";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { getLabBySlug } from "@/data/labs";

interface LabsShellProps {
  children: ReactNode;
}

type LabsNavId = "ferramentas" | "scripts" | "docs" | "api";

const getActiveNav = (pathname: string): LabsNavId => {
  if (pathname.startsWith("/labs/ferramentas")) return "ferramentas";
  if (pathname.startsWith("/labs/scripts")) return "scripts";
  if (pathname.startsWith("/labs/docs")) return "docs";
  if (pathname.startsWith("/labs/api")) return "api";

  const slug = pathname.replace(/^\/labs\/?/, "").split("/")[0];
  const lab = slug ? getLabBySlug(slug) : undefined;
  if (lab?.section === "docs") return "docs";
  if (lab?.section === "scripts") return "scripts";
  return "ferramentas";
};

export const LabsShell = ({ children }: LabsShellProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const activeSection = getActiveNav(pathname);

  const navLinks = [
    { id: "ferramentas" as const, name: tx.labs.navTools, href: "/labs/ferramentas" },
    { id: "scripts" as const, name: tx.labs.navScripts, href: "/labs/scripts" },
    { id: "docs" as const, name: tx.labs.navDocs, href: "/labs/docs" },
    { id: "api" as const, name: tx.labs.navApi, href: "/labs/api" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;
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
  }, [activeSection, lang]);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const menuEl = mobileNavRef.current;
    if (!menuEl) return;

    const focusables = menuEl.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const focusTimer = window.setTimeout(() => first?.focus(), 50);

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || focusables.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isMobileMenuOpen]);

  const previousMenuOpen = useRef(isMobileMenuOpen);
  useEffect(() => {
    if (previousMenuOpen.current && !isMobileMenuOpen) {
      menuButtonRef.current?.focus();
    }
    previousMenuOpen.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  const closeMenu = useCallback(() => setIsMobileMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#labs-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-foreground focus:text-background focus:text-sm focus:font-medium focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {tx.nav.skipLink}
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-4">
          <Link
            to="/"
            className={cn("rounded-md shrink-0 min-w-0 cursor-pointer justify-self-start", focusRing)}
            title={tx.labs.backHome}
          >
            <Brand variant="labs" />
          </Link>

          <nav
            ref={navRef}
            aria-label={tx.labs.primaryNav}
            className="hidden lg:flex items-center gap-1 bg-secondary/50 backdrop-blur-sm rounded-full px-1.5 py-1.5 relative justify-self-center"
          >
            <motion.span
              aria-hidden
              className="absolute bg-background rounded-full shadow-sm"
              layoutId="labs-nav-indicator"
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
            {navLinks.map((link) => (
              <NavLink
                key={link.id}
                to={link.href}
                data-section={link.id}
                aria-current={activeSection === link.id ? "page" : undefined}
                className={cn(
                  "relative z-10 px-3 xl:px-4 py-2 text-sm rounded-full transition-colors duration-200 cursor-pointer",
                  focusRing,
                  activeSection === link.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 justify-self-end">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMobileMenuOpen((value) => !value)}
              className={cn(
                "p-2 -mr-2 hover:bg-secondary rounded-lg transition-colors duration-200 cursor-pointer",
                focusRing
              )}
              aria-label={isMobileMenuOpen ? tx.nav.menuClose : tx.nav.menuOpen}
              aria-expanded={isMobileMenuOpen}
              aria-controls="labs-mobile-nav"
            >
              {isMobileMenuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="labs-mobile-nav"
              ref={mobileNavRef}
              role="dialog"
              aria-modal="true"
              aria-label={tx.labs.mobileNav}
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{
                duration: reduceMotion ? 0 : durations.micro,
                ease: easings.swift,
              }}
              className="lg:hidden bg-background border-b border-border overflow-hidden"
            >
              <nav
                aria-label={tx.labs.mobileNav}
                className="container mx-auto px-6 py-4 flex flex-col gap-1"
              >
                {navLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.href}
                    onClick={closeMenu}
                    aria-current={activeSection === link.id ? "page" : undefined}
                    className={cn(
                      "px-3 py-2.5 rounded-lg transition-colors duration-200 cursor-pointer",
                      focusRing,
                      activeSection === link.id
                        ? "text-foreground bg-secondary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="labs-content" className="flex flex-1 flex-col min-h-0">
        {children}
      </main>

      <Footer compact />
    </div>
  );
};
