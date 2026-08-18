import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getToolsPageCount, DEFAULT_TOOL_CATEGORY, type ToolCategory } from "@/data/tools";
import { buildToolsListHref } from "@/lib/labs-catalog";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const pageHref = (page: number, category?: ToolCategory): string => {
  const params = new URLSearchParams();
  if (category && category !== DEFAULT_TOOL_CATEGORY) params.set("aba", category);
  if (page > 1) params.set("pagina", String(page));
  return buildToolsListHref(params);
};

interface ToolsPaginationProps {
  currentPage: number;
  category?: ToolCategory;
}

export const ToolsPagination = ({ currentPage, category }: ToolsPaginationProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const totalPages = getToolsPageCount(category);

  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label={tx.labs.toolsPagination}
      className="flex items-center justify-center gap-2 pt-2"
    >
      <Link
        to={pageHref(Math.max(1, currentPage - 1), category)}
        aria-disabled={currentPage <= 1}
        className={cn(
          "inline-flex items-center justify-center size-9 rounded-full border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200",
          focusRing,
          currentPage <= 1 && "pointer-events-none opacity-40"
        )}
        aria-label={tx.labs.pagePrev}
      >
        <ChevronLeft className="size-4" aria-hidden />
      </Link>

      <div className="flex items-center gap-1 bg-secondary/50 backdrop-blur-sm rounded-full px-1.5 py-1.5 border border-border">
        {pages.map((page) => (
          <Link
            key={page}
            to={pageHref(page, category)}
            aria-label={`${tx.labs.pageLabel} ${page}`}
            aria-current={page === currentPage ? "page" : undefined}
            className={cn(
              "min-w-[2.25rem] px-3 py-2 text-sm font-medium text-center rounded-full transition-colors duration-200",
              focusRing,
              page === currentPage
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link
        to={pageHref(Math.min(totalPages, currentPage + 1), category)}
        aria-disabled={currentPage >= totalPages}
        className={cn(
          "inline-flex items-center justify-center size-9 rounded-full border border-border",
          "text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors duration-200",
          focusRing,
          currentPage >= totalPages && "pointer-events-none opacity-40"
        )}
        aria-label={tx.labs.pageNext}
      >
        <ChevronRight className="size-4" aria-hidden />
      </Link>
    </nav>
  );
};
