import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/shared/Card";
import { TagPill } from "@/components/shared/TagPill";
import { cn, focusRing } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { categoryLabel, type Lab } from "@/data/labs";

interface LabCardProps {
  lab: Lab;
}

export const LabCard = ({ lab }: LabCardProps) => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <Link
      to={`/labs/${lab.slug}`}
      className={cn("block rounded-2xl cursor-pointer", focusRing)}
    >
      <Card className="h-full group">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <TagPill>{categoryLabel[lab.category][lang]}</TagPill>
            <span className="text-xs text-muted-foreground">
              {tx.labs.updated} {lab.updatedAt}
            </span>
          </div>

          <div className="flex items-start justify-between gap-3">
            <h2 className="font-medium text-base sm:text-lg tracking-tight text-balance">
              {lab.title[lang]}
            </h2>
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
            />
          </div>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {lab.summary[lang]}
          </p>
        </div>
      </Card>
    </Link>
  );
};
