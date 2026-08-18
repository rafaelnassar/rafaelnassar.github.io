import { Link, useLocation } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { IconBadge } from "@/components/shared/IconBadge";
import { buildToolsListHref, saveToolsListHref } from "@/lib/labs-catalog";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import type { LabTool } from "@/data/tools";

interface ToolCardProps {
  tool: LabTool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const { lang } = useLang();
  const { search } = useLocation();
  const Icon = tool.icon;
  const toolsListHref = buildToolsListHref(search);

  return (
    <Link
      to={`/labs/ferramentas/${tool.slug}`}
      state={{ toolsListHref }}
      onClick={() => saveToolsListHref(toolsListHref)}
      className={cn("block rounded-2xl cursor-pointer h-full", focusRing)}
    >
      <Card className="h-full group">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <IconBadge icon={Icon} />
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
            />
          </div>
          <div>
            <h2 className="font-medium text-base sm:text-lg tracking-tight mb-2 text-balance">
              {tool.title[lang]}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {tool.summary[lang]}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
};
