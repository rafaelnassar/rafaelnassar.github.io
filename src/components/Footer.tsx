import { Link } from "react-router-dom";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const Footer = ({ compact = false }: { compact?: boolean }) => {
  const { lang } = useLang();
  const tx = t(lang);
  const year = new Date().getFullYear();

  return (
    <footer className={cn("border-t border-border", compact ? "py-6" : "py-8")}>
      <div className="container mx-auto px-6">
        <p className="flex items-center justify-center gap-2.5 text-sm text-muted-foreground">
          <Link
            to="/"
            className={cn("rounded-md cursor-pointer", focusRing)}
            title={tx.labs.backHome}
          >
            <span className="font-serif italic">rafael</span>
            <span className="font-semibold text-foreground">nassar</span>
            <span className="text-primary">.</span>
          </Link>
          <span aria-hidden>·</span>
          <span>© {year}</span>
        </p>
      </div>
    </footer>
  );
};
