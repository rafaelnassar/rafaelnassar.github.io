import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LabsShell } from "@/components/labs/LabsShell";
import { LabsPage } from "@/components/labs/LabsPage";
import { Reveal } from "@/components/shared/Reveal";
import { cn, focusRing } from "@/lib/utils";
import { getToolBySlug } from "@/data/tools";
import { toolComponents } from "@/components/tools/registry";
import { readToolsListHref, TOOLS_LIST_PATH } from "@/lib/labs-catalog";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

interface ToolDetailLocationState {
  toolsListHref?: string;
}

const ToolDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { state } = useLocation();
  const { lang } = useLang();
  const tx = t(lang);
  const tool = slug ? getToolBySlug(slug) : undefined;
  const ToolUi = slug ? toolComponents[slug] : undefined;
  const toolsListHref =
    (state as ToolDetailLocationState | null)?.toolsListHref ?? readToolsListHref();

  if (!tool || !ToolUi) {
    return <Navigate to={toolsListHref || TOOLS_LIST_PATH} replace />;
  }

  return (
    <LabsShell>
      <LabsPage labelledBy="tool-detail-title" as="article">
        <div className="space-y-6">
          <Reveal>
            <Link
              to={toolsListHref}
              className={cn(
                "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer rounded-md mb-4",
                focusRing
              )}
            >
              <ArrowLeft className="size-4 shrink-0" aria-hidden />
              {tx.labs.backToTools}
            </Link>

            <h1
              id="tool-detail-title"
              className="text-3xl font-medium tracking-tight mb-3 text-balance"
            >
              {tool.title[lang]}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-prose text-pretty">
              {tool.summary[lang]}
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <ToolUi />
          </Reveal>
        </div>
      </LabsPage>
    </LabsShell>
  );
};

export default ToolDetail;
