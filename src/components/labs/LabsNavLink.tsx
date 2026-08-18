import { NavLink, useLocation } from "react-router-dom";
import { FlaskConical } from "lucide-react";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

interface LabsNavLinkProps {
  className?: string;
  onNavigate?: () => void;
}

/**
 * Entrada pra /labs: chip com borda (parece botão) + estado ativo
 * (aria-current + fundo) quando o path já é Labs.
 */
export const LabsNavLink = ({ className, onNavigate }: LabsNavLinkProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const { pathname } = useLocation();
  const isLabs = pathname.startsWith("/labs");

  return (
    <NavLink
      to="/labs/ferramentas"
      onClick={onNavigate}
      aria-current={isLabs ? "page" : undefined}
      className={() =>
        cn(
          "inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200",
          "border",
          focusRing,
          isLabs
            ? "border-foreground/20 bg-secondary text-foreground"
            : "border-border text-foreground hover:border-foreground/30 hover:bg-secondary",
          className
        )
      }
    >
      <FlaskConical className="size-3.5 sm:size-4 shrink-0" aria-hidden />
      {tx.nav.labs}
    </NavLink>
  );
};
