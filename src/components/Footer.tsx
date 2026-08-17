import { Link } from "react-router-dom";
import { Brand } from "@/components/shared/Brand";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const Footer = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <footer className="py-10 sm:py-12 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
          <Brand />
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <Link
              to="/labs"
              className={cn(
                "text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer rounded-md",
                focusRing
              )}
            >
              {tx.footer.labs}
            </Link>
            <span className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} · {tx.footer.rights}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
