import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Brand } from "@/components/shared/Brand";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

interface LabsShellProps {
  children: ReactNode;
}

export const LabsShell = ({ children }: LabsShellProps) => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <a
        href="#labs-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-full focus:bg-foreground focus:text-background focus:text-sm focus:font-medium focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {tx.nav.skipLink}
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={cn("rounded-md shrink-0 min-w-0 cursor-pointer", focusRing)}
            title={tx.labs.backHome}
          >
            <Brand variant="labs" />
          </Link>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="labs-content" className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};
